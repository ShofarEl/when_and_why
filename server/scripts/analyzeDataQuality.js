const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env' });

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-study');

const Participant = require('../models/Participant');

async function analyzeDataQuality() {
  try {
    await mongoose.connection;
    console.log('📊 DATA QUALITY ANALYSIS\n');
    console.log('='.repeat(80));
    
    const participants = await Participant.find({}).sort({ participantId: 1 });
    console.log(`\n1. SAMPLE SIZE`);
    console.log(`   Total participants: ${participants.length}`);
    
    // Check completion status
    const completed = participants.filter(p => p.completed);
    const incomplete = participants.filter(p => !p.completed);
    console.log(`   Study completed: ${completed.length}`);
    console.log(`   Study incomplete: ${incomplete.length}`);
    
    // Check session completion
    console.log(`\n2. SESSION COMPLETION`);
    let allFourSessions = 0;
    let partialSessions = 0;
    let sessionCounts = {};
    
    participants.forEach(p => {
      const completedSessions = p.sessions.filter(s => s.completed).length;
      sessionCounts[completedSessions] = (sessionCounts[completedSessions] || 0) + 1;
      
      if (completedSessions === 4) allFourSessions++;
      else if (completedSessions > 0) partialSessions++;
    });
    
    console.log(`   Completed all 4 conditions: ${allFourSessions}`);
    console.log(`   Partial completion: ${partialSessions}`);
    console.log(`   Session distribution:`, sessionCounts);
    
    // Check transfer tasks
    console.log(`\n3. TRANSFER TASKS (RQ6 - Learning Transfer)`);
    const withTransfer = participants.filter(p => p.transferTasks && p.transferTasks.length > 0);
    const with2Transfer = participants.filter(p => p.transferTasks && p.transferTasks.length === 2);
    console.log(`   Participants with transfer tasks: ${withTransfer.length}`);
    console.log(`   Participants with 2 transfer tasks: ${with2Transfer.length}`);
    
    // Check missing data
    console.log(`\n4. MISSING DATA`);
    let missingAge = 0;
    let missingMajor = 0;
    let sessionsWithoutIdeas = 0;
    let totalCompletedSessions = 0;
    
    participants.forEach(p => {
      if (!p.demographics.age) missingAge++;
      if (!p.demographics.major || p.demographics.major === 'undefined') missingMajor++;
      
      p.sessions.forEach(s => {
        if (s.completed) {
          totalCompletedSessions++;
          if (!s.ideas || s.ideas.length === 0) sessionsWithoutIdeas++;
        }
      });
    });
    
    console.log(`   Missing age: ${missingAge} participants`);
    console.log(`   Missing/undefined major: ${missingMajor} participants`);
    console.log(`   Completed sessions without ideas: ${sessionsWithoutIdeas}/${totalCompletedSessions}`);
    
    // Check for creativity metrics
    console.log(`\n5. CREATIVITY METRICS (RQ1, RQ4)`);
    console.log(`   ⚠️  Expert ratings (novelty, usefulness): NOT IN DATABASE`);
    console.log(`   ⚠️  Semantic diversity scores: NOT COMPUTED YET`);
    console.log(`   ✅ Raw ideas available for rating: ${totalCompletedSessions - sessionsWithoutIdeas} sessions`);
    
    // Recommendations
    console.log(`\n6. RECOMMENDATIONS`);
    console.log('='.repeat(80));
    
    if (allFourSessions < 60) {
      console.log(`   ⚠️  Only ${allFourSessions} complete cases (proposal targets 60-80)`);
      console.log(`   → Need to ensure more participants complete all 4 conditions`);
    } else {
      console.log(`   ✅ ${allFourSessions} complete cases (meets proposal target)`);
    }
    
    if (with2Transfer < allFourSessions) {
      console.log(`   ⚠️  Transfer tasks missing for ${allFourSessions - with2Transfer} participants`);
      console.log(`   → RQ6 (learning transfer) cannot be fully assessed`);
    } else {
      console.log(`   ✅ Transfer tasks available for all complete participants`);
    }
    
    if (missingMajor > 0) {
      console.log(`   ⚠️  ${missingMajor} participants have undefined major`);
      console.log(`   → Consider excluding from analysis or imputing`);
    }
    
    console.log(`   ⚠️  Creativity metrics need to be computed:`);
    console.log(`      1. Expert ratings (2 raters, novelty + usefulness)`);
    console.log(`      2. Semantic diversity (sentence-BERT on ideas)`);
    
    console.log('\n' + '='.repeat(80));
    console.log('\n✅ Analysis complete\n');
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

analyzeDataQuality();
