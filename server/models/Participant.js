const mongoose = require('mongoose');

const participantSchema = new mongoose.Schema({
  participantId: {
    type: String,
    required: true,
    unique: true
  },
  demographics: {
    age: Number,
    gender: String,
    academicLevel: String,
    major: String,
    dataScienceFamiliarity: Number,
    aiExperience: Number,
    priorCourses: [String]
  },
  conditionOrder: [{
    timing: String, // 'jit' or 'always_on'
    reflection: String, // 'required' or 'optional'
    taskId: Number
  }],
  sessions: [{
    sessionId: String,
    condition: {
      timing: String,
      reflection: String
    },
    taskId: Number,
    startTime: Date,
    endTime: Date,
    ideas: [{
      content: String,
      timestamp: Date,
      aiInfluenced: Boolean,
      aiSuggestionId: String
    }],
    aiSuggestions: [{
      id: String,
      content: String,
      timestamp: Date,
      accepted: Boolean,
      dismissed: Boolean
    }],
    rationales: [{
      ideaId: String,
      text: String,
      timestamp: Date,
      type: String // 'idea_justification', 'ai_acceptance', 'ai_rejection'
    }],
    interactions: [{
      action: String, // 'help_request', 'idea_submit', 'ai_accept', 'ai_reject', etc.
      timestamp: Date,
      details: mongoose.Schema.Types.Mixed
    }],
    questionnaire: {
      agency: [Number], // 6-item scale
      dependence: Number,
      cognitiveLoad: [Number] // 3-item scale
    },
    completed: { type: Boolean, default: false }
  }],
  transferTasks: [{
    taskNumber: Number,
    ideas: [String],
    completionTime: Number,
    timestamp: Date
  }],
  postStudy: {
    conditionPreference: [Number], // ranking 1-4
    learningRating: Number,
    usefulnessRating: Number,
    feedback: String
  },
  completed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Participant', participantSchema);