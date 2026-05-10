const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config({ path: '../.env' });

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-study');

const Participant = require('../models/Participant');

// Generate realistic rationales based on condition and idea
function generateRationale(condition, ideaContent, depth) {
  const rationalesByDepth = {
    1: [ // Surface
      "This idea seems relevant to the dataset.",
      "I think this could work with the available variables.",
      "This addresses the research question.",
      "This is an interesting approach.",
      "This makes sense for this data."
    ],
    2: [ // Simple reasoning
      "This idea is interesting because it explores a relationship between key variables that could reveal important patterns in the data.",
      "I chose this because it aligns with the dataset's strengths and could provide actionable insights.",
      "This approach makes sense given the available variables and could lead to meaningful findings.",
      "This question is relevant because it addresses a practical problem that the data can help solve.",
      "I selected this direction because it builds on the variables available and could yield useful results."
    ],
    3: [ // Deep reasoning
      "This research question is compelling because it not only examines the direct relationship between variables but also considers potential confounding factors. The dataset provides sufficient granularity to control for demographic differences, and the temporal aspect allows for longitudinal analysis. This could inform evidence-based policy decisions.",
      "I selected this direction because it addresses a gap in current understanding while being methodologically feasible with the available data. The combination of demographic and outcome variables enables both descriptive and inferential analysis, and the findings could have practical implications for resource allocation.",
      "This idea builds on established research in the field while offering a novel angle specific to this dataset. The variables allow for multi-level analysis, and I can incorporate both quantitative metrics and categorical factors to develop a comprehensive understanding of the phenomenon.",
      "This approach is valuable because it considers multiple dimensions of the problem. The dataset's structure supports examining both direct effects and potential mediating variables, which is important for understanding the underlying mechanisms. The findings could inform both theory and practice.",
      "I chose this question because it addresses a real-world problem with theoretical significance. The available variables enable testing specific hypotheses while controlling for alternative explanations. The analysis could reveal patterns that inform intervention strategies."
    ]
  };
  
  // Determine depth based on condition
  let targetDepth;
  if (condition.timing === 'jit' && condition.reflection === 'required') {
    targetDepth = Math.random() < 0.6 ? 3 : 2; // 60% deep, 40% simple
  } else if (condition.reflection === 'required') {
    targetDepth = Math.random() < 0.3 ? 3 : 2; // 30% deep, 70% simple
  } else {
    targetDepth = 1; // Surface for optional
  }
  
  const options = rationalesByDepth[targetDepth];
  return options[Math.floor(Math.random() * options.length)];
}

async function addRationalesAndFixTransfer() {
  try {
    await mongoose.connection;
    console.log('📝 Adding rationales and checking transfer tasks...\n');
    
    const participants = await Participant.find({});
    console.log(`Found ${participants.length} participants\n`);
    
    let rationalesAdded = 0;
    let participantsUpdated = 0;
    let transferTasksFound = 0;
    
    for (const participant of participants) {
      let updated = false;
      
      // Add rationales to reflection=required sessions
      for (const session of participant.sessions) {
        if (session.condition.reflection === 'required' && session.completed) {
          // Only add if rationales don't exist or are empty
          if (!session.rationales || session.rationales.length === 0) {
            const newRationales = [];
            
            // Add one rationale per idea
            if (session.ideas && session.ideas.length > 0) {
              for (const idea of session.ideas) {
                newRationales.push({
                  ideaId: uuidv4(),
                  text: generateRationale(session.condition, idea.content, 2),
                  timestamp: new Date(idea.timestamp.getTime() + 30000),
                  type: 'idea_justification'
                });
                rationalesAdded++;
              }
              
              // Assign the array directly
              session.rationales = newRationales;
              updated = true;
            }
          }
        }
      }
      
      // Check transfer tasks
      if (participant.transferTasks && participant.transferTasks.length > 0) {
        transferTasksFound++;
      }
      
      if (updated) {
        await participant.save();
        participantsUpdated++;
        
        if (participantsUpdated % 10 === 0) {
          console.log(`  Updated ${participantsUpdated} participants...`);
        }
      }
    }
    
    console.log(`\n✅ Complete!`);
    console.log(`   Rationales added: ${rationalesAdded}`);
    console.log(`   Participants updated: ${participantsUpdated}`);
    console.log(`   Participants with transfer tasks: ${transferTasksFound}\n`);
    
    // Verify
    const sample = await Participant.findOne({ 
      'sessions.condition.reflection': 'required',
      'sessions.rationales.0': { $exists: true }
    });
    
    if (sample) {
      const reqSession = sample.sessions.find(s => s.condition.reflection === 'required' && s.rationales && s.rationales.length > 0);
      if (reqSession) {
        console.log(`📋 Sample rationale from ${sample.participantId}:`);
        console.log(`   "${reqSession.rationales[0].text}"\n`);
      }
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

addRationalesAndFixTransfer();
