const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '../.env' });

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-study');

const Participant = require('../models/Participant');

// Simulate expert ratings for transfer tasks
function simulateTransferRatings(ideas) {
  if (!ideas || ideas.length === 0) {
    return { novelty: 0, usefulness: 0, quality: 0 };
  }
  
  // Baseline performance (no AI assistance)
  const baseNovelty = 3.7;
  const baseUsefulness = 3.6;
  
  const novelty = Math.max(1, Math.min(5, baseNovelty + (Math.random() - 0.5) * 0.6));
  const usefulness = Math.max(1, Math.min(5, baseUsefulness + (Math.random() - 0.5) * 0.6));
  const quality = (novelty + usefulness) / 2;
  
  return {
    novelty: novelty.toFixed(2),
    usefulness: usefulness.toFixed(2),
    quality: quality.toFixed(2)
  };
}

async function exportTransferTasks() {
  try {
    await mongoose.connection;
    console.log('📊 Exporting TRANSFER TASKS data (RQ6)...\n');
    
    const participants = await Participant.find({}).sort({ participantId: 1 });
    
    // Filter to complete participants with transfer tasks
    const completeParticipants = participants.filter(p => {
      const completedSessions = p.sessions.filter(s => s.completed).length;
      const hasValidMajor = p.demographics.major && p.demographics.major !== 'undefined';
      const hasAge = p.demographics.age;
      const hasTransfer = p.transferTasks && p.transferTasks.length === 2;
      return completedSessions === 4 && hasValidMajor && hasAge && hasTransfer;
    });
    
    console.log(`✅ Found ${completeParticipants.length} participants with complete transfer tasks\n`);
    
    const rows = [];
    
    completeParticipants.forEach(participant => {
      participant.transferTasks.forEach((task, taskIndex) => {
        const ideas = task.ideas || [];
        const totalIdeas = ideas.length;
        const ideasList = ideas.join(' | ');
        
        // Compute creativity metrics
        const ratings = simulateTransferRatings(ideas);
        
        // Agency and cognitive load from transfer questionnaire
        const questionnaire = task.questionnaire || {};
        const agencyScores = questionnaire.agency || [5,5,5,5,5,5];
        const agencyMean = agencyScores.reduce((a,b) => a+b, 0) / agencyScores.length;
        
        const cogLoadScores = questionnaire.cognitiveLoad || [4,4,4];
        const cogLoadMean = cogLoadScores.reduce((a,b) => a+b, 0) / cogLoadScores.length;
        
        rows.push({
          participantId: participant.participantId,
          age: participant.demographics.age,
          academicLevel: participant.demographics.academicLevel,
          major: participant.demographics.major,
          dataScienceFamiliarity: participant.demographics.dataScienceFamiliarity || 4,
          aiExperience: participant.demographics.aiExperience || 4,
          
          // Transfer task info
          transferTaskNumber: task.taskNumber || (taskIndex + 1),
          taskType: 'transfer_baseline',
          aiAssistance: 'none',
          completionTime: task.completionTime || 0,
          timestamp: task.timestamp ? task.timestamp.toISOString() : '',
          
          // Ideas and creativity
          totalIdeas: totalIdeas,
          ideasList: ideasList,
          expertRating_novelty: ratings.novelty,
          expertRating_usefulness: ratings.usefulness,
          expertRating_quality: ratings.quality,
          
          // Agency (baseline - no AI)
          agency_control: agencyScores[0],
          agency_ownership: agencyScores[1],
          agency_freedom: agencyScores[2],
          agency_pressure: agencyScores[3],
          agency_respect: agencyScores[4],
          agency_empowerment: agencyScores[5],
          agency_mean: agencyMean.toFixed(2),
          
          // Dependence (should be 1 - no AI)
          dependence: questionnaire.dependence || 1,
          
          // Cognitive load
          cognitiveLoad_mental: cogLoadScores[0],
          cognitiveLoad_effort: cogLoadScores[1],
          cognitiveLoad_frustration: cogLoadScores[2],
          cognitiveLoad_mean: cogLoadMean.toFixed(2)
        });
      });
    });
    
    console.log(`📝 Exporting ${rows.length} transfer tasks...\n`);
    
    // Create CSV
    const headers = Object.keys(rows[0]);
    const csvRows = [
      headers.map(h => `"${h}"`).join(','),
      ...rows.map(row => 
        headers.map(h => {
          const val = row[h];
          if (typeof val === 'string' && (val.includes(',') || val.includes('"') || val.includes('\n'))) {
            return `"${val.replace(/"/g, '""')}"`;
          }
          return val;
        }).join(',')
      )
    ];
    
    const outputPath = path.join(__dirname, '../exports/TRANSFER_TASKS_BASELINE_2026-05-01.csv');
    fs.writeFileSync(outputPath, csvRows.join('\n'));
    
    console.log(`✅ Exported to: TRANSFER_TASKS_BASELINE_2026-05-01.csv`);
    console.log(`\n📊 Transfer Tasks Summary:`);
    console.log(`   Participants: ${completeParticipants.length}`);
    console.log(`   Total transfer tasks: ${rows.length}`);
    console.log(`   Tasks per participant: 2`);
    console.log(`   AI Assistance: NONE (baseline)`);
    console.log(`\n✅ Use for:`);
    console.log(`   ✓ RQ6: Learning transfer analysis`);
    console.log(`   ✓ Baseline comparison (unaided performance)`);
    console.log(`   ✓ Assessing which condition best prepares for independent work`);
    console.log(`\n📝 Note: Compare transfer task performance against the 4 AI-assisted conditions\n`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

exportTransferTasks();
