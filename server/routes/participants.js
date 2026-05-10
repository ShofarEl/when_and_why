const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const Participant = require('../models/Participant');

// Generate Latin Square for counterbalancing
function generateLatinSquare() {
  const conditions = [
    { timing: 'jit', reflection: 'required' },
    { timing: 'jit', reflection: 'optional' },
    { timing: 'always_on', reflection: 'required' },
    { timing: 'always_on', reflection: 'optional' }
  ];
  
  const squares = [
    [0, 1, 2, 3],
    [1, 2, 3, 0],
    [2, 3, 0, 1],
    [3, 0, 1, 2]
  ];
  
  return squares.map(square => 
    square.map((index, taskId) => ({
      ...conditions[index],
      taskId: taskId + 1
    }))
  );
}

// Create new participant or login existing
router.post('/create', async (req, res) => {
  try {
    // Check if participant ID is provided (returning user)
    if (req.body.participantId) {
      const existingParticipant = await Participant.findOne({ 
        participantId: req.body.participantId 
      });
      
      if (existingParticipant) {
        // Existing user logging back in
        return res.json({
          participantId: existingParticipant.participantId,
          conditionOrder: existingParticipant.conditionOrder,
          success: true,
          returning: true
        });
      }
    }
    
    // Find the highest existing participant number
    const allParticipants = await Participant.find({}, { participantId: 1 }).lean();
    const existingIds = new Set(allParticipants.map(p => p.participantId));
    
    // Find next available ID
    let nextNumber = 1;
    let participantId;
    do {
      participantId = `P${String(nextNumber).padStart(3, '0')}`;
      nextNumber++;
    } while (existingIds.has(participantId));
    
    console.log(`Creating new participant: ${participantId}`);
    
    // Assign to Latin Square group
    const latinSquares = generateLatinSquare();
    const count = allParticipants.length;
    const groupIndex = count % 4;
    const conditionOrder = latinSquares[groupIndex];
    
    // Try to create participant, handle duplicate gracefully
    try {
      const participant = new Participant({
        participantId,
        conditionOrder,
        demographics: req.body.demographics || {}
      });
      
      await participant.save();
      
      res.json({
        participantId,
        conditionOrder,
        success: true,
        returning: false
      });
    } catch (saveError) {
      // If duplicate key error, try to find and return existing
      if (saveError.code === 11000) {
        console.log(`Duplicate detected for ${participantId}, fetching existing...`);
        const existing = await Participant.findOne({ participantId });
        if (existing) {
          return res.json({
            participantId: existing.participantId,
            conditionOrder: existing.conditionOrder,
            success: true,
            returning: true
          });
        }
      }
      throw saveError;
    }
  } catch (error) {
    console.error('Error creating participant:', error);
    res.status(500).json({ 
      error: 'Failed to create participant',
      details: error.message 
    });
  }
});

// Login existing participant
router.post('/login', async (req, res) => {
  try {
    const { participantId } = req.body;
    
    if (!participantId) {
      return res.status(400).json({ 
        error: 'Participant ID is required',
        success: false 
      });
    }
    
    const participant = await Participant.findOne({ participantId });
    
    if (!participant) {
      return res.status(404).json({ 
        error: 'Participant not found',
        success: false 
      });
    }
    
    res.json({
      participantId: participant.participantId,
      conditionOrder: participant.conditionOrder,
      demographics: participant.demographics,
      sessions: participant.sessions,
      transferTasks: participant.transferTasks,
      completed: participant.completed,
      success: true
    });
  } catch (error) {
    console.error('Error logging in participant:', error);
    res.status(500).json({ 
      error: 'Failed to login',
      success: false 
    });
  }
});

// Update participant demographics
router.put('/:id/demographics', async (req, res) => {
  try {
    const participant = await Participant.findOne({ participantId: req.params.id });
    if (!participant) {
      return res.status(404).json({ 
        error: 'Participant not found',
        details: `No participant found with ID: ${req.params.id}`
      });
    }
    
    participant.demographics = req.body;
    await participant.save();
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating demographics:', error);
    res.status(500).json({ 
      error: 'Failed to update demographics',
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Start new session
router.post('/:id/sessions', async (req, res) => {
  try {
    const participant = await Participant.findOne({ participantId: req.params.id });
    if (!participant) {
      return res.status(404).json({ error: 'Participant not found' });
    }
    
    const sessionId = uuidv4();
    const session = {
      sessionId,
      condition: req.body.condition,
      taskId: req.body.taskId,
      startTime: new Date(),
      ideas: [],
      aiSuggestions: [],
      rationales: [],
      interactions: [],
      questionnaire: {}
    };
    
    participant.sessions.push(session);
    await participant.save();
    
    res.json({ sessionId, success: true });
  } catch (error) {
    console.error('Error starting session:', error);
    res.status(500).json({ error: 'Failed to start session' });
  }
});

// Update session data
router.put('/:id/sessions/:sessionId', async (req, res) => {
  try {
    const participant = await Participant.findOne({ participantId: req.params.id });
    if (!participant) {
      return res.status(404).json({ 
        error: 'Participant not found',
        details: `No participant found with ID: ${req.params.id}`
      });
    }
    
    const session = participant.sessions.find(s => s.sessionId === req.params.sessionId);
    if (!session) {
      return res.status(404).json({ 
        error: 'Session not found',
        details: `No session found with ID: ${req.params.sessionId}`
      });
    }
    
    // Update session data with proper field mapping
    if (req.body.questionnaire) {
      session.questionnaire = req.body.questionnaire;
    }
    if (req.body.ideas) {
      session.ideas = req.body.ideas;
    }
    if (req.body.aiSuggestions) {
      session.aiSuggestions = req.body.aiSuggestions;
    }
    if (req.body.endTime) {
      session.endTime = req.body.endTime;
    }
    if (req.body.completed !== undefined) {
      session.completed = req.body.completed;
    }
    
    await participant.save();
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating session:', error);
    res.status(500).json({ 
      error: 'Failed to update session',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      timestamp: new Date().toISOString()
    });
  }
});

// Add interaction log
router.post('/:id/sessions/:sessionId/interactions', async (req, res) => {
  try {
    const participant = await Participant.findOne({ participantId: req.params.id });
    if (!participant) {
      console.error(`Participant not found: ${req.params.id}`);
      return res.status(404).json({ 
        error: 'Participant not found',
        details: `No participant found with ID: ${req.params.id}`
      });
    }
    
    const session = participant.sessions.find(s => s.sessionId === req.params.sessionId);
    if (!session) {
      console.error(`Session not found: ${req.params.sessionId} for participant ${req.params.id}`);
      return res.status(404).json({ 
        error: 'Session not found',
        details: `No session found with ID: ${req.params.sessionId}`
      });
    }
    
    // Validate interaction data
    if (!req.body.action) {
      console.error('Missing action in interaction log');
      return res.status(400).json({ 
        error: 'Invalid interaction data',
        details: 'Action is required'
      });
    }
    
    session.interactions.push({
      action: req.body.action,
      timestamp: new Date(),
      details: req.body.details || {}
    });
    
    await participant.save();
    res.json({ success: true });
  } catch (error) {
    console.error('Error logging interaction:', error);
    console.error('Request body:', JSON.stringify(req.body, null, 2));
    res.status(500).json({ 
      error: 'Failed to log interaction',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      timestamp: new Date().toISOString()
    });
  }
});

// Complete transfer tasks
router.put('/:id/transfer', async (req, res) => {
  try {
    const participant = await Participant.findOne({ participantId: req.params.id });
    if (!participant) {
      return res.status(404).json({ 
        error: 'Participant not found',
        details: `No participant found with ID: ${req.params.id}`
      });
    }
    
    participant.transferTasks = req.body.transferTasks;
    await participant.save();
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating transfer tasks:', error);
    res.status(500).json({ 
      error: 'Failed to update transfer tasks',
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Save transfer task questionnaire
router.post('/:id/transfer-questionnaire', async (req, res) => {
  try {
    const participant = await Participant.findOne({ participantId: req.params.id });
    if (!participant) {
      return res.status(404).json({ 
        error: 'Participant not found',
        details: `No participant found with ID: ${req.params.id}`
      });
    }
    
    const { taskNumber, questionnaire, ideas, completionTime } = req.body;
    
    // Find or create the transfer task entry
    let transferTask = participant.transferTasks.find(t => t.taskNumber === taskNumber);
    
    if (transferTask) {
      // Update existing task
      transferTask.ideas = ideas.map(idea => idea.content || idea);
      transferTask.completionTime = completionTime;
      transferTask.questionnaire = questionnaire;
      transferTask.timestamp = new Date();
    } else {
      // Create new task entry
      participant.transferTasks.push({
        taskNumber,
        ideas: ideas.map(idea => idea.content || idea),
        completionTime,
        questionnaire,
        timestamp: new Date()
      });
    }
    
    await participant.save();
    res.json({ success: true });
  } catch (error) {
    console.error('Error saving transfer questionnaire:', error);
    res.status(500).json({ 
      error: 'Failed to save transfer questionnaire',
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Complete post-study survey
router.put('/:id/complete', async (req, res) => {
  try {
    const participant = await Participant.findOne({ participantId: req.params.id });
    if (!participant) {
      return res.status(404).json({ 
        error: 'Participant not found',
        details: `No participant found with ID: ${req.params.id}`
      });
    }
    
    participant.postStudy = req.body.postStudy;
    participant.completed = true;
    await participant.save();
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error completing study:', error);
    res.status(500).json({ 
      error: 'Failed to complete study',
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Get participant data
router.get('/:id', async (req, res) => {
  try {
    const participant = await Participant.findOne({ participantId: req.params.id });
    if (!participant) {
      return res.status(404).json({ error: 'Participant not found' });
    }
    
    res.json(participant);
  } catch (error) {
    console.error('Error fetching participant:', error);
    res.status(500).json({ error: 'Failed to fetch participant' });
  }
});

module.exports = router;