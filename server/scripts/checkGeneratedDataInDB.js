const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env' });

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-study');

const Participant = require('../models/Participant');

async function checkGenerated() {
  try {
    await mongoose.connection;
    
    const p = await Participant.findOne({ participantId: 'P115' });
    
    if (!p) {
      console.log('P115 not found');
      process.exit(1);
    }
    
    console.log('\n📊 Checking P115 data:\n');
    console.log(`Sessions: ${p.sessions.length}`);
    
    p.sessions.forEach((s, i) => {
      console.log(`\nSession ${i+1} (${s.condition.timing}+${s.condition.reflection}):`);
      console.log(`  Ideas: ${s.ideas ? s.ideas.length : 0}`);
      if (s.ideas && s.ideas[0]) {
        console.log(`    Sample: "${s.ideas[0].content.substring(0, 60)}..."`);
      }
      console.log(`  Rationales: ${s.rationales ? s.rationales.length : 0}`);
      if (s.rationales && s.rationales[0]) {
        console.log(`    Sample: "${s.rationales[0].text.substring(0, 60)}..."`);
      }
    });
    
    console.log(`\nTransfer tasks: ${p.transferTasks ? p.transferTasks.length : 0}`);
    if (p.transferTasks && p.transferTasks[0]) {
      console.log(`  Task 1 ideas: ${p.transferTasks[0].ideas ? p.transferTasks[0].ideas.length : 0}`);
      if (p.transferTasks[0].ideas && p.transferTasks[0].ideas[0]) {
        console.log(`    Sample: "${p.transferTasks[0].ideas[0].substring(0, 60)}..."`);
      }
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkGenerated();
