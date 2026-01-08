import { useState } from 'react';
import axios from 'axios';

const API_BASE = process.env.NODE_ENV === 'production' 
  ? 'https://whenandwhy-production.up.railway.app/api' 
  : 'http://localhost:5000/api';

const PostStudySurvey = ({ participantId, onComplete }) => {
  const [responses, setResponses] = useState({
    conditionPreference: [0, 0, 0, 0], // Rankings 1-4 for each condition
    learningRating: 4,
    usefulnessRating: 4,
    feedback: ''
  });

  const [errors, setErrors] = useState({});

  const conditions = [
    { label: 'Just-In-Time AI + Required Explanations', key: 'jit_required', color: 'blue' },
    { label: 'Just-In-Time AI + Optional Explanations', key: 'jit_optional', color: 'green' },
    { label: 'Always-On AI + Required Explanations', key: 'always_required', color: 'purple' },
    { label: 'Always-On AI + Optional Explanations', key: 'always_optional', color: 'orange' }
  ];

  const handleRankingChange = (conditionIndex, rank) => {
    const newRankings = [...responses.conditionPreference];
    
    // Clear any existing assignment of this rank
    const existingIndex = newRankings.indexOf(rank);
    if (existingIndex !== -1) {
      newRankings[existingIndex] = 0;
    }
    
    // Assign new rank
    newRankings[conditionIndex] = rank;
    
    setResponses(prev => ({
      ...prev,
      conditionPreference: newRankings
    }));
  };

  const validateResponses = () => {
    const newErrors = {};
    
    // Check if all conditions have been ranked
    const rankings = responses.conditionPreference;
    const usedRanks = rankings.filter(rank => rank > 0);
    const uniqueRanks = new Set(usedRanks);
    
    if (usedRanks.length !== 4 || uniqueRanks.size !== 4) {
      newErrors.ranking = 'Please rank all 4 conditions from 1 (most preferred) to 4 (least preferred)';
    }
    
    if (!responses.learningRating) {
      newErrors.learning = 'Please rate how much you learned';
    }
    
    if (!responses.usefulnessRating) {
      newErrors.usefulness = 'Please rate the usefulness of AI assistance';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateResponses()) {
      return;
    }

    try {
      await axios.put(`${API_BASE}/participants/${participantId}/complete`, {
        postStudy: responses
      });
      
      onComplete();
    } catch (error) {
      console.error('Error saving post-study survey:', error);
      alert('Error saving data. Please try again.');
    }
  };

  const getRankingColor = (rank) => {
    switch (rank) {
      case 1: return 'bg-emerald-600 text-white shadow-lg scale-110';
      case 2: return 'bg-blue-600 text-white shadow-lg scale-105';
      case 3: return 'bg-amber-600 text-white shadow-md scale-100';
      case 4: return 'bg-red-600 text-white shadow-sm scale-95';
      default: return 'bg-slate-100 border-2 border-slate-300 text-slate-600 hover:bg-slate-200 hover:border-slate-400';
    }
  };

  const getRankLabel = (rank) => {
    switch (rank) {
      case 1: return '1st - Most Preferred';
      case 2: return '2nd - Good';
      case 3: return '3rd - Okay';
      case 4: return '4th - Least Preferred';
      default: return 'Click to rank';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-2 sm:px-4">
      <div className="bg-white/90 backdrop-blur-sm rounded-xl md:rounded-2xl shadow-xl border border-white/20 overflow-hidden">
        <div className="bg-blue-700 px-4 md:px-6 lg:px-8 py-4 md:py-6">
          <div className="flex items-center">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 rounded-lg md:rounded-xl flex items-center justify-center mr-3 md:mr-4">
              <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white">Final Survey</h2>
              <p className="text-xs sm:text-sm md:text-base text-blue-100">Share your thoughts about the different AI assistance conditions</p>
            </div>
          </div>
        </div>

        <div className="p-4 md:p-6 lg:p-8">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg md:rounded-xl p-4 md:p-6 mb-6 md:mb-8 border border-green-100">
            <div className="flex items-center mb-2">
              <div className="w-6 h-6 md:w-8 md:h-8 bg-green-600 rounded-lg flex items-center justify-center mr-2 md:mr-3">
                <svg className="w-3 h-3 md:w-4 md:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="font-semibold text-sm md:text-base text-gray-800">Congratulations!</h3>
            </div>
            <p className="text-xs md:text-sm text-gray-600">
              You've completed all experimental tasks! Please share your thoughts about the different 
              AI assistance conditions you experienced.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
            {/* Condition Preference Ranking */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl md:rounded-2xl p-4 md:p-6 border border-blue-100">
              <div className="flex items-center mb-4 md:mb-6">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-600 rounded-lg md:rounded-xl flex items-center justify-center mr-2 md:mr-3">
                  <svg className="w-4 h-4 md:w-5 md:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-800">Condition Preferences</h3>
              </div>
              <p className="text-xs md:text-sm text-gray-600 mb-4 md:mb-6">
                Rank the 4 conditions from <strong>1 (most preferred)</strong> to <strong>4 (least preferred)</strong>:
              </p>
              
              <div className="space-y-3 md:space-y-4">
                {conditions.map((condition, index) => (
                  <div key={condition.key} className="bg-white rounded-lg md:rounded-xl p-4 md:p-6 shadow-sm border border-gray-100">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm md:text-base text-gray-800 mb-1">{condition.label}</h4>
                        <p className="text-xs md:text-sm text-gray-500">
                          {condition.key.includes('jit') ? 'Help on demand' : 'Continuous suggestions'} • 
                          {condition.key.includes('required') ? ' Mandatory explanations' : ' Optional explanations'}
                        </p>
                      </div>
                      <div className="flex justify-center lg:justify-end">
                        <div className="flex space-x-2">
                          {[1, 2, 3, 4].map(rank => (
                            <button
                              key={rank}
                              type="button"
                              onClick={() => handleRankingChange(index, rank)}
                              className={`w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl font-bold text-xs md:text-sm transition-all duration-200 ${
                                responses.conditionPreference[index] === rank
                                  ? getRankingColor(rank)
                                  : 'bg-gray-100 border-2 border-gray-300 text-gray-600 hover:bg-gray-200 hover:border-gray-400'
                              }`}
                              title={getRankLabel(rank)}
                            >
                              {rank}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                    {responses.conditionPreference[index] > 0 && (
                      <div className="mt-3 text-xs md:text-sm font-medium text-gray-600">
                        Ranked: {getRankLabel(responses.conditionPreference[index])}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              {errors.ranking && <p className="text-red-500 text-xs md:text-sm mt-4 flex items-center">
                <svg className="w-3 h-3 md:w-4 md:h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {errors.ranking}
              </p>}
              
              <div className="mt-4 md:mt-6 bg-white rounded-lg md:rounded-xl p-3 md:p-4 border border-gray-200">
                <h4 className="font-medium text-xs md:text-sm text-gray-800 mb-2">Ranking Legend:</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                  <div className="flex items-center">
                    <div className="w-4 h-4 md:w-6 md:h-6 bg-emerald-600 rounded mr-2"></div>
                    <span>1st - Most Preferred</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 md:w-6 md:h-6 bg-blue-600 rounded mr-2"></div>
                    <span>2nd - Good</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 md:w-6 md:h-6 bg-amber-600 rounded mr-2"></div>
                    <span>3rd - Okay</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 md:w-6 md:h-6 bg-red-600 rounded mr-2"></div>
                    <span>4th - Least Preferred</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Learning Rating */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl md:rounded-2xl p-4 md:p-6 border border-green-100">
              <div className="flex items-center mb-4 md:mb-6">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-green-600 rounded-lg md:rounded-xl flex items-center justify-center mr-2 md:mr-3">
                  <svg className="w-4 h-4 md:w-5 md:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-800">Learning Experience</h3>
              </div>
              
              <div className="bg-white rounded-lg md:rounded-xl p-4 md:p-6 shadow-sm border border-gray-100">
                <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-3 md:mb-4">
                  How much did you learn about data science problem framing during this study?
                </label>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 md:mb-4 gap-3 sm:gap-0">
                  <span className="text-xs text-gray-500 font-medium">Nothing</span>
                  <div className="flex justify-center space-x-1 md:space-x-2">
                    {[1, 2, 3, 4, 5, 6, 7].map(value => (
                      <label key={value} className="flex flex-col items-center cursor-pointer group">
                        <input
                          type="radio"
                          name="learning"
                          value={value}
                          checked={responses.learningRating === value}
                          onChange={(e) => setResponses(prev => ({
                            ...prev,
                            learningRating: parseInt(e.target.value)
                          }))}
                          className="sr-only"
                        />
                        <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                          responses.learningRating === value
                            ? 'bg-green-600 border-green-600 text-white scale-110 shadow-lg'
                            : 'border-gray-300 text-gray-400 hover:border-green-400 hover:text-green-600'
                        }`}>
                          <span className="text-xs md:text-sm font-bold">{value}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                  <span className="text-xs text-gray-500 font-medium">A lot</span>
                </div>
                <div className="text-center">
                  <span className="text-xs md:text-sm text-gray-600">
                    Selected: <strong>{responses.learningRating}/7</strong>
                  </span>
                </div>
              </div>
              
              {errors.learning && <p className="text-red-500 text-xs md:text-sm mt-4 flex items-center">
                <svg className="w-3 h-3 md:w-4 md:h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {errors.learning}
              </p>}
            </div>

            {/* AI Usefulness Rating */}
            <div className="bg-blue-50 rounded-xl md:rounded-2xl p-4 md:p-6 border border-blue-100">
              <div className="flex items-center mb-4 md:mb-6">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-600 rounded-lg md:rounded-xl flex items-center justify-center mr-2 md:mr-3">
                  <svg className="w-4 h-4 md:w-5 md:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-slate-800">AI Assistance Evaluation</h3>
              </div>
              
              <div className="bg-white rounded-lg md:rounded-xl p-4 md:p-6 shadow-sm border border-gray-100">
                <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-3 md:mb-4">
                  Overall, how useful was the AI assistance for generating creative ideas?
                </label>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 md:mb-4 gap-3 sm:gap-0">
                  <span className="text-xs text-gray-500 font-medium">Not useful</span>
                  <div className="flex justify-center space-x-1 md:space-x-2">
                    {[1, 2, 3, 4, 5, 6, 7].map(value => (
                      <label key={value} className="flex flex-col items-center cursor-pointer group">
                        <input
                          type="radio"
                          name="usefulness"
                          value={value}
                          checked={responses.usefulnessRating === value}
                          onChange={(e) => setResponses(prev => ({
                            ...prev,
                            usefulnessRating: parseInt(e.target.value)
                          }))}
                          className="sr-only"
                        />
                        <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                          responses.usefulnessRating === value
                            ? 'bg-blue-600 border-blue-600 text-white scale-110 shadow-lg'
                            : 'border-slate-300 text-slate-400 hover:border-blue-400 hover:text-blue-600'
                        }`}>
                          <span className="text-xs md:text-sm font-bold">{value}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                  <span className="text-xs text-gray-500 font-medium">Very useful</span>
                </div>
                <div className="text-center">
                  <span className="text-xs md:text-sm text-gray-600">
                    Selected: <strong>{responses.usefulnessRating}/7</strong>
                  </span>
                </div>
              </div>
              
              {errors.usefulness && <p className="text-red-500 text-xs md:text-sm mt-4 flex items-center">
                <svg className="w-3 h-3 md:w-4 md:h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {errors.usefulness}
              </p>}
            </div>

            {/* Open Feedback */}
            <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl md:rounded-2xl p-4 md:p-6 border border-orange-100">
              <div className="flex items-center mb-4 md:mb-6">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-orange-600 rounded-lg md:rounded-xl flex items-center justify-center mr-2 md:mr-3">
                  <svg className="w-4 h-4 md:w-5 md:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                </div>
                <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-800">Additional Comments</h3>
              </div>
              
              <div className="bg-white rounded-lg md:rounded-xl p-4 md:p-6 shadow-sm border border-gray-100">
                <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-2 md:mb-3">
                  Any additional thoughts, suggestions, or feedback about your experience? (Optional)
                </label>
                <textarea
                  value={responses.feedback}
                  onChange={(e) => setResponses(prev => ({
                    ...prev,
                    feedback: e.target.value
                  }))}
                  placeholder="Share any thoughts about the AI assistance, task difficulty, interface, or suggestions for improvement..."
                  className="w-full p-3 md:p-4 border-2 border-gray-200 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 resize-none text-sm md:text-base"
                  rows={4}
                />
                <div className="mt-2 text-right">
                  <span className="text-xs md:text-sm text-gray-500">{responses.feedback.length} characters</span>
                </div>
              </div>
            </div>

            <div className="flex justify-center pt-2 md:pt-4">
              <button
                type="submit"
                className="inline-flex items-center justify-center px-6 md:px-8 py-3 md:py-4 bg-blue-600 text-white font-semibold text-sm md:text-base rounded-lg md:rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl w-full sm:w-auto"
              >
                <svg className="w-4 h-4 md:w-5 md:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Complete Study
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostStudySurvey;