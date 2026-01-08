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

// Create new participant
router.post('/create', async (req, res) => {
  try {
    // Generate participant ID
    const count = await Participant.countDocuments();
    const participantId = `P${String(count + 1).padStart(3, '0')}`;
    
    // Assign to Latin Square group
    const latinSquares = generateLatinSquare();
    const groupIndex = count % 4;
    const conditionOrder = latinSquares[groupIndex];
    
    const participant = new Participant({
      participantId,
      conditionOrder,
      demographics: req.body.demographics || {}
    });
    
    await participant.save();
    
    res.json({
      participantId,
      conditionOrder,
      success: true
    });
  } catch (error) {
    console.error('Error creating participant:', error);
    res.status(500).json({ error: 'Failed to create participant' });
  }
});

// Update participant demographics
router.put('/:id/demographics', async (req, res) => {
  try {
    const participant = await Participant.findOne({ participantId: req.params.id });
    if (!participant) {
      return res.status(404).json({ error: 'Participant not found' });
    }
    
    participant.demographics = req.body;
    await participant.save();
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating demographics:', error);
    res.status(500).json({ error: 'Failed to update demographics' });
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
      return res.status(404).json({ error: 'Participant not found' });
    }
    
    const session = participant.sessions.find(s => s.sessionId === req.params.sessionId);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    // Update session data
    Object.assign(session, req.body);
    await participant.save();
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating session:', error);
    res.status(500).json({ error: 'Failed to update session' });
  }
});

// Add interaction log
router.post('/:id/sessions/:sessionId/interactions', async (req, res) => {
  try {
    const participant = await Participant.findOne({ participantId: req.params.id });
    if (!participant) {
      return res.status(404).json({ error: 'Participant not found' });
    }
    
    const session = participant.sessions.find(s => s.sessionId === req.params.sessionId);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
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
    res.status(500).json({ error: 'Failed to log interaction' });
  }
});

// Complete transfer tasks
router.put('/:id/transfer', async (req, res) => {
  try {
    const participant = await Participant.findOne({ participantId: req.params.id });
    if (!participant) {
      return res.status(404).json({ error: 'Participant not found' });
    }
    
    participant.transferTasks = req.body.transferTasks;
    await participant.save();
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating transfer tasks:', error);
    res.status(500).json({ error: 'Failed to update transfer tasks' });
  }
});

// Complete post-study survey
router.put('/:id/complete', async (req, res) => {
  try {
    const participant = await Participant.findOne({ participantId: req.params.id });
    if (!participant) {
      return res.status(404).json({ error: 'Participant not found' });
    }
    
    participant.postStudy = req.body.postStudy;
    participant.completed = true;
    await participant.save();
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error completing study:', error);
    res.status(500).json({ error: 'Failed to complete study' });
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