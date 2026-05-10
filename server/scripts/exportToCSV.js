const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

// Import the Participant model
const Participant = require('../models/Participant');

// Helper function to flatten nested objects for CSV
const flattenObject = (obj, prefix = '') => {
  let flattened = {};
  
  for (let key in obj) {
    if (obj[key] === null || obj[key] === undefined) {
      flattened[prefix + key] = '';
    } else if (typeof obj[key] === 'object' && !Array.isArray(obj[key]) && !(obj[key] instanceof Date)) {
      Object.assign(flattened, flattenObject(obj[key], prefix + key + '_'));
    } else if (Array.isArray(obj[key])) {
      flattened[prefix + key] = JSON.stringify(obj[key]);
    } else if (obj[key] instanceof Date) {
      flattened[prefix + key] = obj[key].toISOString();
    } else {
      flattened[prefix + key] = obj[key];
    }
  }
  
  return flattened;
};

// Convert array of objects to CSV
const arrayToCSV = (data) => {
  if (data.length === 0) return '';
  
  const headers = Object.keys(data[0]);
  const csvRows = [];
  
  // Add header row
  csvRows.push(headers.map(h => `"${h}"`).join(','));
  
  // Add data rows
  for (const row of data) {
    const values = headers.map(header => {
      const value = row[header];
      const escaped = ('' + value).replace(/"/g, '""');
      return `"${escaped}"`;
    });
    csvRows.push(values.join(','));
  }
  
  return csvRows.join('\n');
};

// Main export function
const exportData = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected successfully!');
    
    // Fetch all participants
    console.log('Fetching participant data...');
    const participants = await Participant.find({}).lean();
    console.log(`Found ${participants.length} participants`);
    
    if (participants.length === 0) {
      console.log('No data to export');
      await mongoose.connection.close();
      return;
    }
    
    // Create exports directory if it doesn't exist
    const exportDir = path.join(__dirname, '../exports');
    if (!fs.existsSync(exportDir)) {
      fs.mkdirSync(exportDir, { recursive: true });
    }
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
    
    // 1. Export main participant data
    console.log('Exporting main participant data...');
    const mainData = participants.map(p => flattenObject({
      participantId: p.participantId,
      createdAt: p.createdAt,
      completedAt: p.completedAt,
      age: p.demographics?.age,
      academicLevel: p.demographics?.academicLevel,
      major: p.demographics?.major,
      dataScienceFamiliarity: p.demographics?.dataScienceFamiliarity,
      aiExperience: p.demographics?.aiExperience,
      priorCourses: p.demographics?.priorCourses?.join('; '),
      conditionOrder: p.conditionOrder?.map(c => `${c.timing}_${c.reflection}`).join('; ')
    }));
    
    fs.writeFileSync(
      path.join(exportDir, `participants_${timestamp}.csv`),
      arrayToCSV(mainData)
    );
    console.log(`✓ Saved participants_${timestamp}.csv`);
    
    // 2. Export experimental sessions
    console.log('Exporting experimental sessions...');
    const sessionsData = [];
    participants.forEach(p => {
      p.sessions?.forEach((session, idx) => {
        sessionsData.push(flattenObject({
          participantId: p.participantId,
          sessionNumber: idx + 1,
          taskId: session.condition?.taskId,
          timing: session.condition?.timing,
          reflection: session.condition?.reflection,
          startTime: session.startTime,
          endTime: session.endTime,
          completed: session.completed,
          ideasCount: session.ideas?.length || 0,
          aiSuggestionsCount: session.aiSuggestions?.length || 0,
          interactionsCount: session.interactions?.length || 0,
          // Questionnaire responses
          agency_1: session.questionnaire?.agency?.[0],
          agency_2: session.questionnaire?.agency?.[1],
          agency_3: session.questionnaire?.agency?.[2],
          agency_4: session.questionnaire?.agency?.[3],
          agency_5: session.questionnaire?.agency?.[4],
          agency_6: session.questionnaire?.agency?.[5],
          dependence: session.questionnaire?.dependence,
          cognitiveLoad_1: session.questionnaire?.cognitiveLoad?.[0],
          cognitiveLoad_2: session.questionnaire?.cognitiveLoad?.[1],
          cognitiveLoad_3: session.questionnaire?.cognitiveLoad?.[2]
        }));
      });
    });
    
    if (sessionsData.length > 0) {
      fs.writeFileSync(
        path.join(exportDir, `sessions_${timestamp}.csv`),
        arrayToCSV(sessionsData)
      );
      console.log(`✓ Saved sessions_${timestamp}.csv`);
    }
    
    // 3. Export ideas
    console.log('Exporting ideas...');
    const ideasData = [];
    participants.forEach(p => {
      p.sessions?.forEach((session, sessionIdx) => {
        session.ideas?.forEach((idea, ideaIdx) => {
          ideasData.push(flattenObject({
            participantId: p.participantId,
            sessionNumber: sessionIdx + 1,
            ideaNumber: ideaIdx + 1,
            timing: session.condition?.timing,
            reflection: session.condition?.reflection,
            content: idea.content,
            timestamp: idea.timestamp,
            aiInfluenced: idea.aiInfluenced,
            aiSuggestionId: idea.aiSuggestionId
          }));
        });
      });
    });
    
    if (ideasData.length > 0) {
      fs.writeFileSync(
        path.join(exportDir, `ideas_${timestamp}.csv`),
        arrayToCSV(ideasData)
      );
      console.log(`✓ Saved ideas_${timestamp}.csv`);
    }
    
    // 4. Export interactions
    console.log('Exporting interactions...');
    const interactionsData = [];
    participants.forEach(p => {
      p.sessions?.forEach((session, sessionIdx) => {
        session.interactions?.forEach((interaction, intIdx) => {
          interactionsData.push(flattenObject({
            participantId: p.participantId,
            sessionNumber: sessionIdx + 1,
            interactionNumber: intIdx + 1,
            timing: session.condition?.timing,
            reflection: session.condition?.reflection,
            action: interaction.action,
            timestamp: interaction.timestamp,
            details: JSON.stringify(interaction.details)
          }));
        });
      });
    });
    
    if (interactionsData.length > 0) {
      fs.writeFileSync(
        path.join(exportDir, `interactions_${timestamp}.csv`),
        arrayToCSV(interactionsData)
      );
      console.log(`✓ Saved interactions_${timestamp}.csv`);
    }
    
    // 5. Export transfer tasks
    console.log('Exporting transfer tasks...');
    const transferData = [];
    participants.forEach(p => {
      p.transferTasks?.forEach((task, idx) => {
        transferData.push(flattenObject({
          participantId: p.participantId,
          taskNumber: task.taskNumber,
          ideasCount: task.ideas?.length || 0,
          ideas: task.ideas?.join(' | '),
          completionTime: task.completionTime,
          timestamp: task.timestamp,
          // Questionnaire responses
          agency_1: task.questionnaire?.agency?.[0],
          agency_2: task.questionnaire?.agency?.[1],
          agency_3: task.questionnaire?.agency?.[2],
          agency_4: task.questionnaire?.agency?.[3],
          agency_5: task.questionnaire?.agency?.[4],
          agency_6: task.questionnaire?.agency?.[5],
          dependence: task.questionnaire?.dependence,
          cognitiveLoad_1: task.questionnaire?.cognitiveLoad?.[0],
          cognitiveLoad_2: task.questionnaire?.cognitiveLoad?.[1],
          cognitiveLoad_3: task.questionnaire?.cognitiveLoad?.[2]
        }));
      });
    });
    
    if (transferData.length > 0) {
      fs.writeFileSync(
        path.join(exportDir, `transfer_tasks_${timestamp}.csv`),
        arrayToCSV(transferData)
      );
      console.log(`✓ Saved transfer_tasks_${timestamp}.csv`);
    }
    
    // 6. Export post-study survey
    console.log('Exporting post-study surveys...');
    const postStudyData = participants
      .filter(p => p.postStudy)
      .map(p => flattenObject({
        participantId: p.participantId,
        conditionPreference_1: p.postStudy?.conditionPreference?.[0],
        conditionPreference_2: p.postStudy?.conditionPreference?.[1],
        conditionPreference_3: p.postStudy?.conditionPreference?.[2],
        conditionPreference_4: p.postStudy?.conditionPreference?.[3],
        learningRating: p.postStudy?.learningRating,
        usefulnessRating: p.postStudy?.usefulnessRating,
        feedback: p.postStudy?.feedback
      }));
    
    if (postStudyData.length > 0) {
      fs.writeFileSync(
        path.join(exportDir, `post_study_${timestamp}.csv`),
        arrayToCSV(postStudyData)
      );
      console.log(`✓ Saved post_study_${timestamp}.csv`);
    }
    
    // 7. Export AI suggestions
    console.log('Exporting AI suggestions...');
    const suggestionsData = [];
    participants.forEach(p => {
      p.sessions?.forEach((session, sessionIdx) => {
        session.aiSuggestions?.forEach((suggestion, suggIdx) => {
          suggestionsData.push(flattenObject({
            participantId: p.participantId,
            sessionNumber: sessionIdx + 1,
            suggestionNumber: suggIdx + 1,
            timing: session.condition?.timing,
            reflection: session.condition?.reflection,
            content: suggestion.content,
            timestamp: suggestion.timestamp,
            accepted: suggestion.accepted,
            dismissed: suggestion.dismissed
          }));
        });
      });
    });
    
    if (suggestionsData.length > 0) {
      fs.writeFileSync(
        path.join(exportDir, `ai_suggestions_${timestamp}.csv`),
        arrayToCSV(suggestionsData)
      );
      console.log(`✓ Saved ai_suggestions_${timestamp}.csv`);
    }
    
    console.log('\n✅ Export completed successfully!');
    console.log(`📁 Files saved to: ${exportDir}`);
    console.log('\nExported files:');
    console.log(`  - participants_${timestamp}.csv (${participants.length} records)`);
    console.log(`  - sessions_${timestamp}.csv (${sessionsData.length} records)`);
    console.log(`  - ideas_${timestamp}.csv (${ideasData.length} records)`);
    console.log(`  - interactions_${timestamp}.csv (${interactionsData.length} records)`);
    console.log(`  - transfer_tasks_${timestamp}.csv (${transferData.length} records)`);
    console.log(`  - post_study_${timestamp}.csv (${postStudyData.length} records)`);
    console.log(`  - ai_suggestions_${timestamp}.csv (${suggestionsData.length} records)`);
    
    // 8. Create MASTER ANALYSIS FILE - All key data in one place
    console.log('\n📊 Creating master analysis files...');
    const masterData = [];
    const completedSessionsData = [];
    
    participants.forEach(p => {
      // Base participant info
      const baseInfo = {
        participantId: p.participantId,
        age: p.demographics?.age || '',
        academicLevel: p.demographics?.academicLevel || '',
        major: p.demographics?.major || '',
        dataScienceFamiliarity: p.demographics?.dataScienceFamiliarity || '',
        aiExperience: p.demographics?.aiExperience || '',
        priorCourses: p.demographics?.priorCourses?.join('; ') || '',
        completedAt: p.completedAt || '',
        studyCompleted: p.completed || false
      };
      
      // Add each experimental session as a row
      p.sessions?.forEach((session, sessionIdx) => {
        const sessionData = {
          ...baseInfo,
          sessionNumber: sessionIdx + 1,
          taskId: session.condition?.taskId || '',
          timing: session.condition?.timing || '',
          reflection: session.condition?.reflection || '',
          sessionStartTime: session.startTime || '',
          sessionEndTime: session.endTime || '',
          sessionCompleted: session.completed || false,
          
          // Ideas metrics
          totalIdeas: session.ideas?.length || 0,
          ideasList: session.ideas?.map(i => i.content).join(' | ') || '',
          aiInfluencedIdeas: session.ideas?.filter(i => i.aiInfluenced).length || 0,
          
          // AI suggestions metrics
          totalAISuggestions: session.aiSuggestions?.length || 0,
          acceptedSuggestions: session.aiSuggestions?.filter(s => s.accepted).length || 0,
          dismissedSuggestions: session.aiSuggestions?.filter(s => s.dismissed).length || 0,
          
          // Interactions metrics
          totalInteractions: session.interactions?.length || 0,
          helpRequests: session.interactions?.filter(i => i.action === 'help_request').length || 0,
          ideaSubmissions: session.interactions?.filter(i => i.action === 'idea_submit').length || 0,
          refinementRequests: session.interactions?.filter(i => i.action === 'idea_refinement_requested').length || 0,
          refinedIdeasAccepted: session.interactions?.filter(i => i.action === 'refined_idea_accepted').length || 0,
          
          // Questionnaire responses - Agency (6 items)
          agency_control: session.questionnaire?.agency?.[0] || '',
          agency_ownership: session.questionnaire?.agency?.[1] || '',
          agency_freedom: session.questionnaire?.agency?.[2] || '',
          agency_pressure: session.questionnaire?.agency?.[3] || '',
          agency_respect: session.questionnaire?.agency?.[4] || '',
          agency_empowerment: session.questionnaire?.agency?.[5] || '',
          agency_mean: session.questionnaire?.agency?.length > 0 
            ? (session.questionnaire.agency.reduce((a, b) => a + b, 0) / session.questionnaire.agency.length).toFixed(2)
            : '',
          
          // Questionnaire - Dependence
          dependence: session.questionnaire?.dependence || '',
          
          // Questionnaire - Cognitive Load (3 items)
          cognitiveLoad_mental: session.questionnaire?.cognitiveLoad?.[0] || '',
          cognitiveLoad_effort: session.questionnaire?.cognitiveLoad?.[1] || '',
          cognitiveLoad_frustration: session.questionnaire?.cognitiveLoad?.[2] || '',
          cognitiveLoad_mean: session.questionnaire?.cognitiveLoad?.length > 0
            ? (session.questionnaire.cognitiveLoad.reduce((a, b) => a + b, 0) / session.questionnaire.cognitiveLoad.length).toFixed(2)
            : ''
        };
        
        masterData.push(flattenObject(sessionData));
        
        // Add to completed sessions only if session is complete and has questionnaire data
        if (session.completed && session.questionnaire && session.questionnaire.agency && session.questionnaire.agency.length > 0) {
          completedSessionsData.push(flattenObject(sessionData));
        }
      });
      
      // Add transfer tasks
      p.transferTasks?.forEach((task, taskIdx) => {
        const transferRow = {
          ...baseInfo,
          sessionNumber: `Transfer_${task.taskNumber}`,
          taskId: task.taskNumber === 1 ? 5 : 6,
          timing: 'none',
          reflection: 'none',
          sessionStartTime: task.timestamp || '',
          sessionEndTime: task.timestamp || '',
          sessionCompleted: true,
          
          // Transfer task metrics
          totalIdeas: task.ideas?.length || 0,
          ideasList: task.ideas?.join(' | ') || '',
          aiInfluencedIdeas: 0,
          completionTime: task.completionTime || '',
          
          // No AI metrics for transfer tasks
          totalAISuggestions: 0,
          acceptedSuggestions: 0,
          dismissedSuggestions: 0,
          totalInteractions: 0,
          helpRequests: 0,
          ideaSubmissions: task.ideas?.length || 0,
          refinementRequests: 0,
          refinedIdeasAccepted: 0,
          
          // Transfer task questionnaire
          agency_control: task.questionnaire?.agency?.[0] || '',
          agency_ownership: task.questionnaire?.agency?.[1] || '',
          agency_freedom: task.questionnaire?.agency?.[2] || '',
          agency_pressure: task.questionnaire?.agency?.[3] || '',
          agency_respect: task.questionnaire?.agency?.[4] || '',
          agency_empowerment: task.questionnaire?.agency?.[5] || '',
          agency_mean: task.questionnaire?.agency?.length > 0 
            ? (task.questionnaire.agency.reduce((a, b) => a + b, 0) / task.questionnaire.agency.length).toFixed(2)
            : '',
          dependence: task.questionnaire?.dependence || '',
          cognitiveLoad_mental: task.questionnaire?.cognitiveLoad?.[0] || '',
          cognitiveLoad_effort: task.questionnaire?.cognitiveLoad?.[1] || '',
          cognitiveLoad_frustration: task.questionnaire?.cognitiveLoad?.[2] || '',
          cognitiveLoad_mean: task.questionnaire?.cognitiveLoad?.length > 0
            ? (task.questionnaire.cognitiveLoad.reduce((a, b) => a + b, 0) / task.questionnaire.cognitiveLoad.length).toFixed(2)
            : ''
        };
        
        masterData.push(flattenObject(transferRow));
        
        // Add to completed sessions if has questionnaire data
        if (task.questionnaire && task.questionnaire.agency && task.questionnaire.agency.length > 0) {
          completedSessionsData.push(flattenObject(transferRow));
        }
      });
      
      // Add post-study data as summary row
      if (p.postStudy) {
        const postStudyRow = {
          ...baseInfo,
          sessionNumber: 'PostStudy',
          taskId: 'Summary',
          timing: 'Summary',
          reflection: 'Summary',
          
          // Post-study ratings
          conditionPreference_JIT_Required: p.postStudy.conditionPreference?.[0] || '',
          conditionPreference_JIT_Optional: p.postStudy.conditionPreference?.[1] || '',
          conditionPreference_AlwaysOn_Required: p.postStudy.conditionPreference?.[2] || '',
          conditionPreference_AlwaysOn_Optional: p.postStudy.conditionPreference?.[3] || '',
          learningRating: p.postStudy.learningRating || '',
          usefulnessRating: p.postStudy.usefulnessRating || '',
          feedback: p.postStudy.feedback || ''
        };
        
        masterData.push(flattenObject(postStudyRow));
      }
    });
    
    if (masterData.length > 0) {
      fs.writeFileSync(
        path.join(exportDir, `MASTER_ANALYSIS_${timestamp}.csv`),
        arrayToCSV(masterData)
      );
      console.log(`✓ Saved MASTER_ANALYSIS_${timestamp}.csv (${masterData.length} records)`);
      console.log('\n🎯 MASTER FILE includes:');
      console.log('   - All participant demographics');
      console.log('   - All experimental sessions with questionnaires');
      console.log('   - All transfer tasks with questionnaires');
      console.log('   - Post-study survey responses');
      console.log('   - Calculated means for agency & cognitive load');
      console.log('   - AI interaction metrics');
      console.log('   - Ideas counts and content');
    }
    
    // 9. Create COMPLETED SESSIONS ONLY file for clean analysis
    if (completedSessionsData.length > 0) {
      fs.writeFileSync(
        path.join(exportDir, `ANALYSIS_COMPLETED_ONLY_${timestamp}.csv`),
        arrayToCSV(completedSessionsData)
      );
      console.log(`\n✓ Saved ANALYSIS_COMPLETED_ONLY_${timestamp}.csv (${completedSessionsData.length} records)`);
      console.log('\n🎯 COMPLETED SESSIONS FILE includes:');
      console.log('   - ONLY completed sessions with full questionnaire data');
      console.log('   - Ready for statistical analysis');
      console.log('   - No missing data in key variables');
      console.log('   - Perfect for SPSS, R, Python analysis');
    }
    
  } catch (error) {
    console.error('❌ Error exporting data:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
  }
};

// Run the export
exportData();
