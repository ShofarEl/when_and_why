import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Clock, HelpCircle, Lightbulb, X } from 'lucide-react';
import PostTaskQuestionnaire from './PostTaskQuestionnaire';

const API_BASE = process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:5000/api';

const ExperimentalTask = ({ participantId, condition, taskNumber, totalTasks, onComplete }) => {
  const [dataset, setDataset] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [currentIdea, setCurrentIdea] = useState('');
  const [ideas, setIdeas] = useState([]);
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [showAiSuggestions, setShowAiSuggestions] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [taskStarted, setTaskStarted] = useState(false);
  const [taskCompleted, setTaskCompleted] = useState(false);
  const [showRationale, setShowRationale] = useState(false);
  const [rationale, setRationale] = useState('');
  const [pendingIdea, setPendingIdea] = useState('');
  const [lastActivityTime, setLastActivityTime] = useState(Date.now());
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [isLoadingAI, setIsLoadingAI] = useState(false);

  const timerRef = useRef(null);
  const activityTimerRef = useRef(null);

  useEffect(() => {
    initializeTask();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (activityTimerRef.current) clearInterval(activityTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (taskStarted && !taskCompleted) {
      // Main timer
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            completeTask();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Activity monitoring for JIT trigger
      if (condition.timing === 'jit') {
        activityTimerRef.current = setInterval(() => {
          const timeSinceActivity = Date.now() - lastActivityTime;
          if (timeSinceActivity >= 60000 && !showAiSuggestions && ideas.length > 0) {
            // Auto-trigger JIT help after 60 seconds of inactivity
            requestAiHelp(true);
          }
        }, 5000);
      }

      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
        if (activityTimerRef.current) clearInterval(activityTimerRef.current);
      };
    }
  }, [taskStarted, taskCompleted, lastActivityTime, showAiSuggestions, ideas.length]);

  useEffect(() => {
    // Always-On mode: refresh suggestions periodically
    if (condition.timing === 'always_on' && taskStarted && !taskCompleted) {
      const interval = setInterval(() => {
        if (!isLoadingAI) {
          generateAiSuggestions();
        }
      }, 20000);
      
      return () => clearInterval(interval);
    }
  }, [condition.timing, taskStarted, taskCompleted, isLoadingAI]);

  const initializeTask = async () => {
    try {
      // Get dataset info
      const datasetResponse = await axios.get(`${API_BASE}/ai/datasets/${condition.taskId}`);
      setDataset(datasetResponse.data);

      // Create session
      const sessionResponse = await axios.post(`${API_BASE}/participants/${participantId}/sessions`, {
        condition,
        taskId: condition.taskId
      });
      setSessionId(sessionResponse.data.sessionId);

      // Log task start
      logInteraction('task_start', { condition, taskId: condition.taskId });

      setTaskStarted(true);

      // For Always-On mode, generate initial suggestions
      if (condition.timing === 'always_on') {
        setTimeout(() => generateAiSuggestions(), 2000);
      }
    } catch (error) {
      console.error('Error initializing task:', error);
      alert('Error loading task. Please refresh and try again.');
    }
  };

  const logInteraction = async (action, details = {}) => {
    try {
      await axios.post(`${API_BASE}/participants/${participantId}/sessions/${sessionId}/interactions`, {
        action,
        details
      });
    } catch (error) {
      console.error('Error logging interaction:', error);
    }
  };

  const generateAiSuggestions = async (isAutoTrigger = false) => {
    if (isLoadingAI) return;
    
    setIsLoadingAI(true);
    try {
      const response = await axios.post(`${API_BASE}/ai/suggestions`, {
        taskId: condition.taskId,
        existingIdeas: ideas.map(idea => idea.content),
        participantId
      });

      const newSuggestions = response.data.suggestions.map((content, index) => ({
        id: `${Date.now()}_${index}`,
        content,
        timestamp: new Date(),
        accepted: false,
        dismissed: false
      }));

      setAiSuggestions(newSuggestions);
      
      if (condition.timing === 'jit') {
        setShowAiSuggestions(true);
      }

      logInteraction('ai_suggestions_generated', { 
        suggestions: newSuggestions,
        isAutoTrigger,
        timing: condition.timing
      });
    } catch (error) {
      console.error('Error generating AI suggestions:', error);
      // Fallback suggestions
      const fallbackSuggestions = [
        "Explore relationships between key variables in your dataset",
        "Consider how external factors might influence the patterns you see", 
        "Think about practical applications of insights from this data"
      ].map((content, index) => ({
        id: `fallback_${Date.now()}_${index}`,
        content,
        timestamp: new Date(),
        accepted: false,
        dismissed: false
      }));
      
      setAiSuggestions(fallbackSuggestions);
      if (condition.timing === 'jit') {
        setShowAiSuggestions(true);
      }
    } finally {
      setIsLoadingAI(false);
    }
  };

  const requestAiHelp = (isAutoTrigger = false) => {
    logInteraction('help_request', { isAutoTrigger });
    generateAiSuggestions(isAutoTrigger);
  };

  const handleIdeaSubmit = () => {
    if (!currentIdea.trim()) return;

    setLastActivityTime(Date.now());

    if (condition.reflection === 'required') {
      setPendingIdea(currentIdea.trim());
      setShowRationale(true);
    } else {
      submitIdea(currentIdea.trim());
    }
  };

  const submitIdea = (ideaContent, rationaleText = '') => {
    const newIdea = {
      id: Date.now(),
      content: ideaContent,
      timestamp: new Date(),
      aiInfluenced: false,
      aiSuggestionId: null
    };

    setIdeas(prev => [...prev, newIdea]);
    setCurrentIdea('');
    setPendingIdea('');
    setRationale('');
    setShowRationale(false);

    logInteraction('idea_submit', { 
      idea: newIdea,
      rationale: rationaleText,
      hasRationale: condition.reflection === 'required'
    });

    // For Always-On mode, refresh suggestions after idea submission
    if (condition.timing === 'always_on') {
      setTimeout(() => generateAiSuggestions(), 1000);
    }
  };

  const handleRationaleSubmit = () => {
    if (rationale.length < 20) {
      alert('Please provide at least 20 characters explaining your reasoning.');
      return;
    }
    
    submitIdea(pendingIdea, rationale);
  };

  const handleSuggestionAction = (suggestion, action) => {
    const updatedSuggestion = { ...suggestion, [action]: true };
    
    setAiSuggestions(prev => 
      prev.map(s => s.id === suggestion.id ? updatedSuggestion : s)
    );

    if (action === 'accepted') {
      setCurrentIdea(suggestion.content);
      setLastActivityTime(Date.now());
    }

    logInteraction(`ai_suggestion_${action}`, { 
      suggestion: updatedSuggestion,
      timing: condition.timing
    });

    if (condition.timing === 'jit') {
      setShowAiSuggestions(false);
    }
  };

  const completeTask = () => {
    if (taskCompleted) return;
    
    setTaskCompleted(true);
    if (timerRef.current) clearInterval(timerRef.current);
    if (activityTimerRef.current) clearInterval(activityTimerRef.current);
    
    logInteraction('task_complete', { 
      totalIdeas: ideas.length,
      timeSpent: 600 - timeLeft,
      condition
    });

    setShowQuestionnaire(true);
  };

  const handleQuestionnaireComplete = async (responses) => {
    try {
      // Update session with questionnaire responses
      await axios.put(`${API_BASE}/participants/${participantId}/sessions/${sessionId}`, {
        questionnaire: responses,
        ideas,
        aiSuggestions,
        endTime: new Date(),
        completed: true
      });

      onComplete();
    } catch (error) {
      console.error('Error saving questionnaire:', error);
      alert('Error saving data. Please try again.');
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (showQuestionnaire) {
    return (
      <PostTaskQuestionnaire
        condition={condition}
        taskNumber={taskNumber}
        onComplete={handleQuestionnaireComplete}
      />
    );
  }

  if (!dataset || !taskStarted) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center">Loading task...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 lg:p-6">
      {/* Task Header - Mobile Optimized */}
      <div className="bg-white p-4 lg:p-6 rounded-lg shadow-sm mb-4 lg:mb-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4">
          <div className="flex items-center space-x-3 mb-3 sm:mb-0">
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-slate-600 rounded-xl flex items-center justify-center">
              <span className="text-white text-lg lg:text-xl font-bold">{taskNumber}</span>
            </div>
            <h2 className="text-xl lg:text-2xl font-bold text-slate-800">
              Task {taskNumber} of {totalTasks}
            </h2>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
            <div className={`flex items-center justify-center sm:justify-start space-x-2 ${timeLeft < 120 ? 'text-red-600' : 'text-gray-600'}`}>
              <Clock size={20} />
              <span className="font-mono text-xl lg:text-2xl font-bold">{formatTime(timeLeft)}</span>
            </div>
            {condition.timing === 'jit' && (
              <button
                onClick={() => requestAiHelp()}
                disabled={isLoadingAI}
                className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-3 rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-all duration-200 font-medium"
              >
                <HelpCircle size={18} />
                <span>{isLoadingAI ? 'Loading...' : 'Get AI Help'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Dataset Info - Mobile Optimized */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-4 lg:p-6">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 lg:w-14 lg:h-14 bg-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 lg:w-7 lg:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg lg:text-xl font-bold text-slate-800 mb-3 leading-tight">{dataset.title}</h3>
              <p className="text-sm lg:text-base text-slate-600 mb-4 leading-relaxed">{dataset.description}</p>
              <div className="bg-white/80 rounded-xl p-4 border border-blue-100">
                <p className="text-sm lg:text-base text-slate-700">
                  <span className="font-semibold text-blue-700">Your Goal:</span> Generate creative research questions and project ideas for this dataset. Think about interesting patterns, relationships, or insights you could explore.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid - Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        {/* Main Input Area */}
        <div className="lg:col-span-2">
          <div className="bg-white p-4 lg:p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-lg lg:text-xl font-semibold text-slate-800">Your Ideas</h3>
            </div>
            
            {/* Ideas List - Mobile Optimized */}
            <div className="space-y-3 mb-6 max-h-64 lg:max-h-80 overflow-y-auto">
              {ideas.map((idea, index) => (
                <div key={idea.id} className="p-4 bg-slate-50 rounded-xl border-l-4 border-emerald-500 transition-all duration-200 hover:shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-semibold text-emerald-700 bg-emerald-100 px-2 py-1 rounded-lg">
                      Idea {index + 1}
                    </span>
                    <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-lg">
                      {new Date(idea.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-sm lg:text-base text-slate-700 leading-relaxed">{idea.content}</p>
                </div>
              ))}
              {ideas.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <p className="text-slate-500 text-base lg:text-lg mb-2">No ideas yet</p>
                  <p className="text-slate-400 text-sm">Start by typing your first research question below</p>
                </div>
              )}
            </div>

            {/* Input Area - Mobile Optimized */}
            <div className="space-y-4">
              <textarea
                value={currentIdea}
                onChange={(e) => {
                  setCurrentIdea(e.target.value);
                  setLastActivityTime(Date.now());
                }}
                placeholder="Type your research question or project idea here..."
                className="w-full p-4 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base lg:text-lg resize-none transition-all duration-200"
                rows={4}
                disabled={taskCompleted}
              />
              <button
                onClick={handleIdeaSubmit}
                disabled={!currentIdea.trim() || taskCompleted}
                className="w-full bg-emerald-600 text-white py-4 rounded-xl hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Submit Idea
              </button>
            </div>
          </div>
        </div>

        {/* AI Suggestions Sidebar - Always visible on desktop, mobile card on mobile */}
        <div className="lg:col-span-1">
          <div className="bg-white p-4 lg:p-6 rounded-2xl shadow-sm border border-slate-200 lg:sticky lg:top-4">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-lg lg:text-xl font-semibold text-slate-800">AI Suggestions</h3>
            </div>
            
            {/* Always-On Mode: Show suggestions in sidebar on desktop, mobile gets them too */}
            {condition.timing === 'always_on' ? (
              <>
                {isLoadingAI ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-slate-500 text-base">Generating suggestions...</p>
                  </div>
                ) : aiSuggestions.length > 0 ? (
                  <div className="space-y-4">
                    {aiSuggestions.map(suggestion => (
                      <div key={suggestion.id} className="p-4 bg-amber-50 rounded-xl border border-amber-200 transition-all duration-200 hover:shadow-sm">
                        <p className="text-sm lg:text-base mb-4 text-slate-700 leading-relaxed">{suggestion.content}</p>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <button
                            onClick={() => handleSuggestionAction(suggestion, 'accepted')}
                            disabled={suggestion.accepted || suggestion.dismissed}
                            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm transition-all duration-200"
                          >
                            {suggestion.accepted ? '✓ Used' : 'Use This'}
                          </button>
                          <button
                            onClick={() => handleSuggestionAction(suggestion, 'dismissed')}
                            disabled={suggestion.accepted || suggestion.dismissed}
                            className="flex-1 bg-slate-400 text-white px-4 py-2 rounded-lg hover:bg-slate-500 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm transition-all duration-200"
                          >
                            {suggestion.dismissed ? '✗ Dismissed' : 'Dismiss'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <p className="text-slate-500 text-base mb-2">AI suggestions will appear here</p>
                    <p className="text-slate-400 text-sm">Automatically generated to help spark ideas</p>
                  </div>
                )}
              </>
            ) : (
              /* JIT Mode: Show help instructions in sidebar, modal for suggestions */
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-slate-500 text-base mb-2">Click "Get AI Help" for suggestions</p>
                <p className="text-slate-400 text-sm">Or wait 60 seconds after inactivity</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* JIT Suggestions Modal - Mobile Optimized */}
      {condition.timing === 'jit' && showAiSuggestions && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white p-6 border-b border-slate-200 rounded-t-2xl">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
                    <Lightbulb size={20} className="text-yellow-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-800">AI Suggestions</h3>
                </div>
                <button
                  onClick={() => setShowAiSuggestions(false)}
                  className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500 hover:text-slate-700 hover:bg-slate-200 transition-all duration-200"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              {aiSuggestions.map(suggestion => (
                <div key={suggestion.id} className="p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                  <p className="text-base mb-4 text-slate-700 leading-relaxed">{suggestion.content}</p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => handleSuggestionAction(suggestion, 'accepted')}
                      className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 font-semibold transition-all duration-200"
                    >
                      Use This Idea
                    </button>
                    <button
                      onClick={() => handleSuggestionAction(suggestion, 'dismissed')}
                      className="flex-1 bg-slate-400 text-white px-6 py-3 rounded-xl hover:bg-slate-500 font-semibold transition-all duration-200"
                    >
                      Not Helpful
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Rationale Modal - Mobile Optimized */}
      {showRationale && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-4 text-slate-800">Explain Your Reasoning</h3>
              <p className="text-base text-slate-600 mb-4">
                Please explain your reasoning for this idea (minimum 20 characters):
              </p>
              <div className="mb-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <p className="text-sm text-slate-500 mb-1">Your idea:</p>
                <p className="text-base font-medium text-slate-800">{pendingIdea}</p>
              </div>
              <textarea
                value={rationale}
                onChange={(e) => setRationale(e.target.value)}
                placeholder="Explain why you think this is a good research question or project idea..."
                className="w-full p-4 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base resize-none"
                rows={5}
              />
              <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
                <span className="text-sm text-slate-500 order-2 sm:order-1">
                  {rationale.length}/20 characters minimum
                </span>
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto order-1 sm:order-2">
                  <button
                    onClick={() => {
                      setShowRationale(false);
                      setPendingIdea('');
                      setRationale('');
                    }}
                    className="px-6 py-3 bg-slate-400 text-white rounded-xl hover:bg-slate-500 font-semibold transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleRationaleSubmit}
                    disabled={rationale.length < 20}
                    className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 font-semibold transition-all duration-200"
                  >
                    Submit Idea
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Task Complete Button - Mobile Optimized */}
      {!taskCompleted && (
        <div className="mt-8 text-center">
          <button
            onClick={completeTask}
            className="bg-red-600 text-white px-8 py-4 rounded-xl hover:bg-red-700 font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Finish Task Early
          </button>
        </div>
      )}
    </div>
  );
};

export default ExperimentalTask;