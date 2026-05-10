const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config({ path: '../.env' });

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-study', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const Participant = require('../models/Participant');

async function testSingle() {
  try {
    console.log('Testing single participant creation...');
    
    const existingCount = await Participant.countDocuments();
    const participantId = `P${String(existingCount + 1).padStart(3, '0')}`;
    
    const testParticipant = {
      participantId,
      demographics: {
        age: 24,
        gender: 'male',
        academicLevel: 'bachelor',
        major: 'Computer Science',
        dataScienceFamiliarity: 5,
        aiExperience: 4,
        priorCourses: ['Introduction to Data Science', 'Statistics']
      },
      conditionOrder: [
        { timing: 'jit', reflection: 'required', taskId: 1 },
        { timing: 'jit', reflection: 'optional', taskId: 2 },
        { timing: 'always_on', reflection: 'required', taskId: 3 },
        { timing: 'always_on', reflection: 'optional', taskId: 4 }
      ],
      sessions: [
        {
          sessionId: uuidv4(),
          condition: {
            timing: 'jit',
            reflection: 'required'
          },
          taskId: 1,
          startTime: new Date(),
          endTime: new Date(Date.now() + 600000),
          ideas: [
            {
              content: 'Test idea 1',
              timestamp: new Date(),
              aiInfluenced: false,
              aiSuggestionId: null
            }
          ],
          aiSuggestions: [
            {
              id: uuidv4(),
              content: 'Test suggestion',
              timestamp: new Date(),
              accepted: false,
              dismissed: true
            }
          ],
          rationales: [
            {
              ideaId: uuidv4(),
              text: 'This is a test rationale',
              timestamp: new Date(),
              type: 'idea_justification'
            }
          ],
          interactions: [
            {
              action: 'help_request',
              timestamp: new Date(),
              details: {}
            }
          ],
          questionnaire: {
            agency: [5, 5, 5, 5, 5, 5],
            dependence: 3,
            cognitiveLoad: [4, 4, 4]
          },
          completed: true
        }
      ],
      transferTasks: [],
      postStudy: {
        conditionPreference: [1, 2, 3, 4],
        learningRating: 5,
        usefulnessRating: 5,
        feedback: 'Test feedback'
      },
      completed: true,
      createdAt: new Date()
    };
    
    console.log('Creating participant...');
    const participant = new Participant(testParticipant);
    await participant.save();
    
    console.log('✅ Success! Participant created:', participantId);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
}

testSingle();
