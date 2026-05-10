const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env' });

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-study');

const Participant = require('../models/Participant');

async function checkData() {
  try {
    await mongoose.connection;
    
    const participants = await Participant.find({}).limit(10).sort({ participantId: 1 });
    
    console.log('\n📊 CHECKING RATIONALES AND TRANSFER TASKS\n');
    console.log('='.repeat(80));
    
    let totalRationales = 0;
    let sessionsWithRationales = 0;
    let participantsWithTransfer = 0;
    let totalTransferIdeas = 0;
    
    participants.forEach(p => {
      console.log(`\n${p.participantId}:`);
      
      // Check sessions for rationales
      p.sessions.forEach((s, i) => {
        const ratCount = s.rationales ? s.rationales.length : 0;
        if (ratCount > 0) {
          console.log(`  Session ${i+1} (${s.condition.timing}+${s.condition.reflection}): ${ratCount} rationales`);
          if (s.rationales[0]) {
            console.log(`    Sample: "${s.rationales[0].text.substring(0, 60)}..."`);
          }
          totalRationales += ratCount;
          sessionsWithRationales++;
        }
      });
      
      // Check transfer tasks
      if (p.transferTasks && p.transferTasks.length > 0) {
        console.log(`  Transfer tasks: ${p.transferTasks.length}`);
        p.transferTasks.forEach((t, i) => {
          const ideas = t.ideas || [];
          console.log(`    Task ${i+1}: ${ideas.length} ideas`);
          if (ideas.length > 0) {
            console.log(`      Sample: "${ideas[0].substring(0, 60)}..."`);
            totalTransferIdeas += ideas.length;
          }
        });
        participantsWithTransfer++;
      } else {
        console.log(`  Transfer tasks: NONE`);
      }
    });
    
    console.log('\n' + '='.repeat(80));
    console.log(`\n📊 Summary (first 10 participants):`);
    console.log(`   Sessions with rationales: ${sessionsWithRationales}`);
    console.log(`   Total rationales: ${totalRationales}`);
    console.log(`   Participants with transfer tasks: ${participantsWithTransfer}`);
    console.log(`   Total transfer ideas: ${totalTransferIdeas}\n`);
    
    // Check if data exists at all
    const allParticipants = await Participant.find({});
    let allRationales = 0;
    let allTransfer = 0;
    
    allParticipants.forEach(p => {
      p.sessions.forEach(s => {
        if (s.rationales) allRationales += s.rationales.length;
      });
      if (p.transferTasks) allTransfer += p.transferTasks.length;
    });
    
    console.log(`📊 Database totals (all ${allParticipants.length} participants):`);
    console.log(`   Total rationales in database: ${allRationales}`);
    console.log(`   Total transfer tasks in database: ${allTransfer}\n`);
    
    if (allRationales === 0) {
      console.log('⚠️  NO RATIONALES IN DATABASE - Need to generate them\n');
    }
    
    if (allTransfer === 0) {
      console.log('⚠️  NO TRANSFER TASKS IN DATABASE - Need to generate them\n');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkData();
