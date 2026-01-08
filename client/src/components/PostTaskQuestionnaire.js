import { useState } from 'react';

const PostTaskQuestionnaire = ({ condition, taskNumber, onComplete }) => {
  const [responses, setResponses] = useState({
    agency: [4, 4, 4, 4, 4, 4], // 6-item scale, default to middle
    dependence: 4,
    cognitiveLoad: [4, 4, 4] // 3-item scale
  });

  const [errors, setErrors] = useState({});

  const agencyQuestions = [
    "I felt in control of the problem-framing process",
    "I felt my ideas were truly my own", 
    "I felt free to explore different approaches",
    "I felt pressure to follow AI suggestions", // reverse scored
    "I felt the AI respected my autonomy",
    "I felt empowered to make my own decisions"
  ];

  const cognitiveLoadQuestions = [
    "Mental demand: How mentally demanding was this task?",
    "Effort: How hard did you have to work?", 
    "Frustration: How frustrated did you feel?"
  ];

  const handleAgencyChange = (index, value) => {
    const newAgency = [...responses.agency];
    newAgency[index] = parseInt(value);
    setResponses(prev => ({
      ...prev,
      agency: newAgency
    }));
  };

  const handleCognitiveLoadChange = (index, value) => {
    const newCognitiveLoad = [...responses.cognitiveLoad];
    newCognitiveLoad[index] = parseInt(value);
    setResponses(prev => ({
      ...prev,
      cognitiveLoad: newCognitiveLoad
    }));
  };

  const validateResponses = () => {
    const newErrors = {};
    
    // Check if all questions are answered (not default values)
    if (responses.agency.some(val => val === null || val === undefined)) {
      newErrors.agency = 'Please answer all agency questions';
    }
    
    if (!responses.dependence) {
      newErrors.dependence = 'Please answer the dependence question';
    }
    
    if (responses.cognitiveLoad.some(val => val === null || val === undefined)) {
      newErrors.cognitiveLoad = 'Please answer all cognitive load questions';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateResponses()) {
      return;
    }

    onComplete(responses);
  };

  const getConditionDescription = () => {
    const timing = condition.timing === 'jit' ? 'Just-In-Time' : 'Always-On';
    const reflection = condition.reflection === 'required' ? 'with required explanations' : 'with optional explanations';
    return `${timing} AI assistance ${reflection}`;
  };

  const getConditionIcon = () => {
    if (condition.timing === 'jit') {
      return (
        <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    } else {
      return (
        <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      );
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-2 sm:px-4">
      <div className="bg-white/90 backdrop-blur-sm rounded-xl md:rounded-2xl shadow-xl border border-white/20 overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-4 md:px-6 lg:px-8 py-4 md:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 rounded-lg md:rounded-xl flex items-center justify-center mr-3 md:mr-4">
                {getConditionIcon()}
              </div>
              <div>
                <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white">Task {taskNumber} Feedback</h2>
                <p className="text-xs sm:text-sm md:text-base text-emerald-100">How was your experience with this condition?</p>
              </div>
            </div>
            <div className="bg-white/20 px-3 md:px-4 py-1.5 md:py-2 rounded-lg md:rounded-xl self-start sm:self-auto">
              <span className="text-xs md:text-sm font-medium text-white">
                {taskNumber}/4
              </span>
            </div>
          </div>
        </div>

        <div className="p-4 md:p-6 lg:p-8">
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg md:rounded-xl p-4 md:p-6 mb-6 md:mb-8 border border-emerald-100">
            <div className="flex items-center mb-2">
              <div className="w-6 h-6 md:w-8 md:h-8 bg-emerald-600 rounded-lg flex items-center justify-center mr-2 md:mr-3">
                <svg className="w-3 h-3 md:w-4 md:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-sm md:text-base text-gray-800">Condition Details</h3>
            </div>
            <p className="text-xs md:text-sm text-gray-600">
              <strong>You just completed:</strong> {getConditionDescription()}
            </p>
            <p className="text-xs md:text-sm text-gray-500 mt-1">
              Please reflect on your experience with this specific condition and answer the following questions.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
            {/* Agency Scale */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl md:rounded-2xl p-4 md:p-6 border border-blue-100">
              <div className="flex items-center mb-4 md:mb-6">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-600 rounded-lg md:rounded-xl flex items-center justify-center mr-2 md:mr-3">
                  <svg className="w-4 h-4 md:w-5 md:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-800">Your Experience</h3>
              </div>
              <p className="text-xs md:text-sm text-gray-600 mb-4 md:mb-6">
                Rate your agreement with each statement about this task:
              </p>
              
              <div className="space-y-4 md:space-y-6">
                {agencyQuestions.map((question, index) => (
                  <div key={index} className="bg-white rounded-lg md:rounded-xl p-4 md:p-6 shadow-sm border border-gray-100">
                    <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-3 md:mb-4">
                      {question}
                    </label>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
                      <span className="text-xs text-gray-500 font-medium">Strongly Disagree</span>
                      <div className="flex justify-center space-x-1 md:space-x-2">
                        {[1, 2, 3, 4, 5, 6, 7].map(value => (
                          <label key={value} className="flex flex-col items-center cursor-pointer group">
                            <input
                              type="radio"
                              name={`agency_${index}`}
                              value={value}
                              checked={responses.agency[index] === value}
                              onChange={(e) => handleAgencyChange(index, e.target.value)}
                              className="sr-only"
                            />
                            <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                              responses.agency[index] === value
                                ? 'bg-blue-600 border-blue-600 text-white scale-110 shadow-lg'
                                : 'border-gray-300 text-gray-400 hover:border-blue-400 hover:text-blue-600'
                            }`}>
                              <span className="text-xs md:text-sm font-bold">{value}</span>
                            </div>
                          </label>
                        ))}
                      </div>
                      <span className="text-xs text-gray-500 font-medium">Strongly Agree</span>
                    </div>
                  </div>
                ))}
              </div>
              
              {errors.agency && <p className="text-red-500 text-xs md:text-sm mt-4 flex items-center">
                <svg className="w-3 h-3 md:w-4 md:h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {errors.agency}
              </p>}
            </div>

            {/* AI Dependence */}
            <div className="bg-blue-50 rounded-xl md:rounded-2xl p-4 md:p-6 border border-blue-100">
              <div className="flex items-center mb-4 md:mb-6">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-600 rounded-lg md:rounded-xl flex items-center justify-center mr-2 md:mr-3">
                  <svg className="w-4 h-4 md:w-5 md:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-slate-800">AI Dependence</h3>
              </div>
              
              <div className="bg-white rounded-lg md:rounded-xl p-4 md:p-6 shadow-sm border border-gray-100">
                <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-3 md:mb-4">
                  To what extent did you depend on AI suggestions in this task?
                </label>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
                  <span className="text-xs text-gray-500 font-medium">Not at all</span>
                  <div className="flex justify-center space-x-1 md:space-x-2">
                    {[1, 2, 3, 4, 5, 6, 7].map(value => (
                      <label key={value} className="flex flex-col items-center cursor-pointer group">
                        <input
                          type="radio"
                          name="dependence"
                          value={value}
                          checked={responses.dependence === value}
                          onChange={(e) => setResponses(prev => ({
                            ...prev,
                            dependence: parseInt(e.target.value)
                          }))}
                          className="sr-only"
                        />
                        <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                          responses.dependence === value
                            ? 'bg-blue-600 border-blue-600 text-white scale-110 shadow-lg'
                            : 'border-slate-300 text-slate-400 hover:border-blue-400 hover:text-blue-600'
                        }`}>
                          <span className="text-xs md:text-sm font-bold">{value}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                  <span className="text-xs text-gray-500 font-medium">Completely</span>
                </div>
              </div>
              
              {errors.dependence && <p className="text-red-500 text-xs md:text-sm mt-4 flex items-center">
                <svg className="w-3 h-3 md:w-4 md:h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {errors.dependence}
              </p>}
            </div>

            {/* Cognitive Load */}
            <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl md:rounded-2xl p-4 md:p-6 border border-orange-100">
              <div className="flex items-center mb-4 md:mb-6">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-orange-600 rounded-lg md:rounded-xl flex items-center justify-center mr-2 md:mr-3">
                  <svg className="w-4 h-4 md:w-5 md:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-800">Task Difficulty</h3>
              </div>
              <p className="text-xs md:text-sm text-gray-600 mb-4 md:mb-6">
                Rate each aspect of this task:
              </p>
              
              <div className="space-y-4 md:space-y-6">
                {cognitiveLoadQuestions.map((question, index) => (
                  <div key={index} className="bg-white rounded-lg md:rounded-xl p-4 md:p-6 shadow-sm border border-gray-100">
                    <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-3 md:mb-4">
                      {question}
                    </label>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
                      <span className="text-xs text-gray-500 font-medium">Very Low</span>
                      <div className="flex justify-center space-x-1 md:space-x-2">
                        {[1, 2, 3, 4, 5, 6, 7].map(value => (
                          <label key={value} className="flex flex-col items-center cursor-pointer group">
                            <input
                              type="radio"
                              name={`cognitive_${index}`}
                              value={value}
                              checked={responses.cognitiveLoad[index] === value}
                              onChange={(e) => handleCognitiveLoadChange(index, e.target.value)}
                              className="sr-only"
                            />
                            <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                              responses.cognitiveLoad[index] === value
                                ? 'bg-orange-600 border-orange-600 text-white scale-110 shadow-lg'
                                : 'border-gray-300 text-gray-400 hover:border-orange-400 hover:text-orange-600'
                            }`}>
                              <span className="text-xs md:text-sm font-bold">{value}</span>
                            </div>
                          </label>
                        ))}
                      </div>
                      <span className="text-xs text-gray-500 font-medium">Very High</span>
                    </div>
                  </div>
                ))}
              </div>
              
              {errors.cognitiveLoad && <p className="text-red-500 text-xs md:text-sm mt-4 flex items-center">
                <svg className="w-3 h-3 md:w-4 md:h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {errors.cognitiveLoad}
              </p>}
            </div>

            <div className="flex justify-center pt-2 md:pt-4">
              <button
                type="submit"
                className="inline-flex items-center justify-center px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold text-sm md:text-base rounded-lg md:rounded-xl hover:from-emerald-700 hover:to-teal-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl w-full sm:w-auto"
              >
                <svg className="w-4 h-4 md:w-5 md:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
                Continue to Next Task
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostTaskQuestionnaire;