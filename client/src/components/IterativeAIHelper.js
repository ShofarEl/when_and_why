import React, { useState } from 'react';
import axios from 'axios';

const API_BASE = process.env.NODE_ENV === 'production' 
  ? 'https://whenandwhy-production.up.railway.app/api' 
  : 'http://localhost:5000/api';

const IterativeAIHelper = ({ 
  condition, 
  taskId, 
  participantId, 
  existingIdeas, 
  onSuggestionAccepted, 
  onInteractionLogged 
}) => {
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [interactionHistory, setInteractionHistory] = useState([]);
  const [userFeedback, setUserFeedback] = useState('');
  const [showFeedbackInput, setShowFeedbackInput] = useState(false);

  const generateSuggestions = async (refinementRequest = '') => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_BASE}/ai/suggestions`, {
        taskId,
        existingIdeas: existingIdeas.map(idea => idea.content),
        participantId,
        refinementRequest,
        interactionHistory
      });

      const newSuggestions = response.data.suggestions.map((content, index) => ({
        id: `${Date.now()}_${index}`,
        content,
        timestamp: new Date(),
        accepted: false,
        dismissed: false,
        refined: false
      }));

      setSuggestions(newSuggestions);
      
      // Log the interaction
      const interaction = {
        type: 'ai_suggestions_generated',
        suggestions: newSuggestions,
        refinementRequest,
        timestamp: new Date()
      };
      
      setInteractionHistory(prev => [...prev, interaction]);
      onInteractionLogged(interaction);
      
    } catch (error) {
      console.error('Error generating suggestions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionAction = (suggestion, action) => {
    const updatedSuggestion = { ...suggestion, [action]: true };
    
    setSuggestions(prev => 
      prev.map(s => s.id === suggestion.id ? updatedSuggestion : s)
    );

    const interaction = {
      type: `ai_suggestion_${action}`,
      suggestion: updatedSuggestion,
      timestamp: new Date()
    };
    
    setInteractionHistory(prev => [...prev, interaction]);
    onInteractionLogged(interaction);

    if (action === 'accepted') {
      onSuggestionAccepted(suggestion.content);
    }
  };

  const requestRefinement = () => {
    if (userFeedback.trim()) {
      generateSuggestions(userFeedback.trim());
      setUserFeedback('');
      setShowFeedbackInput(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Initial Help Button */}
      {suggestions.length === 0 && (
        <button
          onClick={() => generateSuggestions()}
          disabled={isLoading}
          className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-3 rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-all duration-200 font-medium"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{isLoading ? 'Generating...' : 'Get AI Help'}</span>
        </button>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Generating suggestions...</p>
        </div>
      )}

      {/* Suggestions Display */}
      {suggestions.length > 0 && !isLoading && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-gray-800">AI Suggestions</h4>
            <span className="text-sm text-gray-500">Round {interactionHistory.filter(i => i.type === 'ai_suggestions_generated').length}</span>
          </div>
          
          {suggestions.map(suggestion => (
            <div key={suggestion.id} className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
              <p className="text-sm mb-4 text-gray-700 leading-relaxed">{suggestion.content}</p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleSuggestionAction(suggestion, 'accepted')}
                  disabled={suggestion.accepted || suggestion.dismissed}
                  className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm transition-all duration-200"
                >
                  {suggestion.accepted ? '✓ Used' : 'Use This'}
                </button>
                <button
                  onClick={() => handleSuggestionAction(suggestion, 'dismissed')}
                  disabled={suggestion.accepted || suggestion.dismissed}
                  className="flex-1 bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm transition-all duration-200"
                >
                  {suggestion.dismissed ? '✗ Dismissed' : 'Not Helpful'}
                </button>
              </div>
            </div>
          ))}

          {/* Refinement Options */}
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
            <div className="flex flex-col space-y-3">
              <p className="text-sm font-medium text-gray-700">Need different suggestions?</p>
              
              {!showFeedbackInput ? (
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => generateSuggestions('more specific')}
                    disabled={isLoading}
                    className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition-all duration-200"
                  >
                    More Specific
                  </button>
                  <button
                    onClick={() => generateSuggestions('different angle')}
                    disabled={isLoading}
                    className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition-all duration-200"
                  >
                    Different Angle
                  </button>
                  <button
                    onClick={() => setShowFeedbackInput(true)}
                    className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-medium transition-all duration-200"
                  >
                    Custom Request
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <textarea
                    value={userFeedback}
                    onChange={(e) => setUserFeedback(e.target.value)}
                    placeholder="Tell the AI what kind of suggestions you'd prefer..."
                    className="w-full p-3 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
                    rows={2}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={requestRefinement}
                      disabled={!userFeedback.trim() || isLoading}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 text-sm font-medium transition-all duration-200"
                    >
                      Get New Suggestions
                    </button>
                    <button
                      onClick={() => {
                        setShowFeedbackInput(false);
                        setUserFeedback('');
                      }}
                      className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 text-sm font-medium transition-all duration-200"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IterativeAIHelper;