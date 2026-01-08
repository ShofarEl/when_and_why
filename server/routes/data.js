const express = require('express');
const router = express.Router();
const Participant = require('../models/Participant');

// Export all participant data
router.get('/export', async (req, res) => {
  try {
    const participants = await Participant.find({});
    
    const exportData = {
      exportDate: new Date().toISOString(),
      totalParticipants: participants.length,
      participants: participants.map(p => ({
        participantId: p.participantId,
        demographics: p.demographics,
        conditionOrder: p.conditionOrder,
        sessions: p.sessions.map(s => ({
          sessionId: s.sessionId,
          condition: s.condition,
          taskId: s.taskId,
          startTime: s.startTime,
          endTime: s.endTime,
          duration: s.endTime && s.startTime ? 
            Math.round((s.endTime - s.startTime) / 1000) : null,
          ideasCount: s.ideas.length,
          ideas: s.ideas,
          aiSuggestions: s.aiSuggestions,
          rationales: s.rationales,
          interactions: s.interactions,
          questionnaire: s.questionnaire,
          completed: s.completed
        })),
        transferTasks: p.transferTasks,
        postStudy: p.postStudy,
        completed: p.completed,
        createdAt: p.createdAt
      }))
    };
    
    res.json(exportData);
  } catch (error) {
    console.error('Error exporting data:', error);
    res.status(500).json({ error: 'Failed to export data' });
  }
});

// Export single participant data
router.get('/export/:participantId', async (req, res) => {
  try {
    const participant = await Participant.findOne({ 
      participantId: req.params.participantId 
    });
    
    if (!participant) {
      return res.status(404).json({ error: 'Participant not found' });
    }
    
    const exportData = {
      exportDate: new Date().toISOString(),
      participantId: participant.participantId,
      demographics: participant.demographics,
      conditionOrder: participant.conditionOrder,
      sessions: participant.sessions.map(s => ({
        sessionId: s.sessionId,
        condition: s.condition,
        taskId: s.taskId,
        startTime: s.startTime,
        endTime: s.endTime,
        duration: s.endTime && s.startTime ? 
          Math.round((s.endTime - s.startTime) / 1000) : null,
        ideasCount: s.ideas.length,
        ideas: s.ideas,
        aiSuggestions: s.aiSuggestions,
        rationales: s.rationales,
        interactions: s.interactions,
        questionnaire: s.questionnaire,
        completed: s.completed
      })),
      transferTasks: participant.transferTasks,
      postStudy: participant.postStudy,
      completed: participant.completed,
      createdAt: participant.createdAt
    };
    
    res.json(exportData);
  } catch (error) {
    console.error('Error exporting participant data:', error);
    res.status(500).json({ error: 'Failed to export participant data' });
  }
});

// Get study statistics
router.get('/stats', async (req, res) => {
  try {
    const totalParticipants = await Participant.countDocuments();
    const completedParticipants = await Participant.countDocuments({ completed: true });
    
    const participants = await Participant.find({});
    
    let totalSessions = 0;
    let completedSessions = 0;
    let totalIdeas = 0;
    let totalInteractions = 0;
    
    participants.forEach(p => {
      totalSessions += p.sessions.length;
      completedSessions += p.sessions.filter(s => s.completed).length;
      p.sessions.forEach(s => {
        totalIdeas += s.ideas.length;
        totalInteractions += s.interactions.length;
      });
    });
    
    res.json({
      totalParticipants,
      completedParticipants,
      totalSessions,
      completedSessions,
      totalIdeas,
      totalInteractions,
      completionRate: totalParticipants > 0 ? 
        Math.round((completedParticipants / totalParticipants) * 100) : 0
    });
  } catch (error) {
    console.error('Error getting stats:', error);
    res.status(500).json({ error: 'Failed to get statistics' });
  }
});

module.exports = router;