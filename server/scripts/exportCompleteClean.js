const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '../.env' });

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-study');

const Participant = require('../models/Participant');

async function exportComplete() {
  try {
    await mongoose.connection;
    console.log('Fetching participants...');
    
    const participants = await Participant.find({}).sort({ participantId: 1 });
    console.log(`Found ${participants.length} participants`);
    
    const rows = [];
    
    participants.forEach(participant => {
      participant.sessions.forEach((session, sessionIndex) => {
        // Only include completed sessions with questionnaire data
        if (!session.completed || !session.questionnaire || !session.questionnaire.agency) {
          return;
        }
        
        // Count AI metrics
        const totalAISuggestions = session.aiSuggestions ? session.aiSuggestions.length : 0;
        const acceptedSuggestions = session.aiSuggestions ? session.aiSuggestions.filter(s => s.accepted).length : 0;
        const dismissedSuggestions = session.aiSuggestions ? session.aiSuggestions.filter(s => s.dismissed).length : 0;
        
        // Count interactions
        const totalInteractions = session.interactions ? session.interactions.length : 0;
        const helpRequests = session.interactions ? session.interactions.filter(i => i.action === 'help_request').length : 0;
        const ideaSubmissions = session.interactions ? session.interactions.filter(i => i.action === 'idea_submit').length : 0;
        const refinementRequests = session.interactions ? session.interactions.filter(i => i.action === 'refinement_request').length : 0;
        
        // Count ideas
        const totalIdeas = session.ideas ? session.ideas.length : 0;
        const aiInfluencedIdeas = session.ideas ? session.ideas.filter(i => i.aiInfluenced).length : 0;
        const ideasList = session.ideas ? session.ideas.map(i => i.content).join(' | ') : '';
        
        // Agency scores
        const agencyScores = session.questionnaire.agency || [4,4,4,4,4,4];
        const agencyMean = agencyScores.reduce((a,b) => a+b, 0) / agencyScores.length;
        
        // Cognitive load scores
        const cogLoadScores = session.questionnaire.cognitiveLoad || [4,4,4];
        const cogLoadMean = cogLoadScores.reduce((a,b) => a+b, 0) / cogLoadScores.length;
        
        rows.push({
          participantId: participant.participantId,
          age: participant.demographics.age || '',
          academicLevel: participant.demographics.academicLevel || '',
          major: participant.demographics.major || '',
          dataScienceFamiliarity: participant.demographics.dataScienceFamiliarity || '',
          aiExperience: participant.demographics.aiExperience || '',
          priorCourses: Array.isArray(participant.demographics.priorCourses) ? participant.demographics.priorCourses.join('; ') : '',
          completedAt: participant.createdAt ? participant.createdAt.toISOString() : '',
          studyCompleted: participant.completed ? 'TRUE' : 'FALSE',
          sessionNumber: sessionIndex + 1,
          taskId: session.taskId || '',
          timing: session.condition.timing || '',
          reflection: session.condition.reflection || '',
          sessionStartTime: session.startTime ? session.startTime.toISOString() : '',
          sessionEndTime: session.endTime ? session.endTime.toISOString() : '',
          sessionCompleted: session.completed ? 'TRUE' : 'FALSE',
          totalIdeas: totalIdeas,
          ideasList: ideasList,
          aiInfluencedIdeas: aiInfluencedIdeas,
          totalAISuggestions: totalAISuggestions,
          acceptedSuggestions: acceptedSuggestions,
          dismissedSuggestions: dismissedSuggestions,
          totalInteractions: totalInteractions,
          helpRequests: helpRequests,
          ideaSubmissions: ideaSubmissions,
          refinementRequests: refinementRequests,
          refinedIdeasAccepted: 0, // Not tracked in current schema
          agency_control: agencyScores[0] || 4,
          agency_ownership: agencyScores[1] || 4,
          agency_freedom: agencyScores[2] || 4,
          agency_pressure: agencyScores[3] || 4,
          agency_respect: agencyScores[4] || 4,
          agency_empowerment: agencyScores[5] || 4,
          agency_mean: agencyMean.toFixed(2),
          dependence: session.questionnaire.dependence || 4,
          cognitiveLoad_mental: cogLoadScores[0] || 4,
          cognitiveLoad_effort: cogLoadScores[1] || 4,
          cognitiveLoad_frustration: cogLoadScores[2] || 4,
          cognitiveLoad_mean: cogLoadMean.toFixed(2)
        });
      });
    });
    
    console.log(`Exporting ${rows.length} completed sessions...`);
    
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
    
    const outputPath = path.join(__dirname, '../exports/ANALYSIS_COMPLETED_CLEAN_2026-05-01.csv');
    fs.writeFileSync(outputPath, csvRows.join('\n'));
    
    console.log(`✅ Exported to: ANALYSIS_COMPLETED_CLEAN_2026-05-01.csv`);
    console.log(`   Total rows: ${rows.length}`);
    console.log(`   Participants: ${participants.length}`);
    
    // Show sample
    console.log('\n📋 Sample (first 3 rows):');
    rows.slice(0, 3).forEach(r => {
      console.log(`  ${r.participantId}: ${r.major} | ${r.timing}+${r.reflection} | Ideas:${r.totalIdeas} | AI:${r.totalAISuggestions} | Accepted:${r.acceptedSuggestions}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

exportComplete();
