const ProgressIndicator = ({ currentPhase, phases, currentCondition, totalConditions }) => {
  const getPhaseLabel = (phase) => {
    switch (phase) {
      case 'consent': return 'Consent';
      case 'pre-survey': return 'Survey';
      case 'tutorial': return 'Tutorial';
      case 'experiment': return 'Tasks';
      case 'transfer': return 'Transfer';
      case 'post-survey': return 'Feedback';
      case 'complete': return 'Complete';
      default: return phase;
    }
  };

  const getPhaseIcon = (phase) => {
    switch (phase) {
      case 'consent':
        return (
          <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'pre-survey':
        return (
          <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        );
      case 'tutorial':
        return (
          <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        );
      case 'experiment':
        return (
          <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        );
      case 'transfer':
        return (
          <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
      case 'post-survey':
        return (
          <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
          </svg>
        );
      case 'complete':
        return (
          <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      default:
        return (
          <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        );
    }
  };

  const currentPhaseIndex = phases.indexOf(currentPhase);
  
  return (
    <div className="max-w-5xl mx-auto mb-6 md:mb-8 lg:mb-12 px-2 sm:px-4">
      <div className="bg-white/90 backdrop-blur-sm p-3 md:p-4 lg:p-6 rounded-lg md:rounded-2xl shadow-lg border border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 md:mb-6 gap-3">
          <h3 className="text-base md:text-lg lg:text-xl font-bold text-slate-800">Study Progress</h3>
          {currentPhase === 'experiment' && (
            <div className="flex items-center space-x-2 bg-slate-100 px-3 py-1.5 md:px-4 md:py-2 rounded-full">
              <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-slate-600 rounded-full animate-pulse"></div>
              <span className="text-xs md:text-sm font-medium text-slate-700">
                Task {currentCondition} of {totalConditions}
              </span>
            </div>
          )}
        </div>
        
        {/* Mobile Progress - Vertical Layout */}
        <div className="block md:hidden">
          <div className="space-y-3">
            {phases.map((phase, index) => (
              <div key={phase} className="flex items-center space-x-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-150 flex-shrink-0 ${
                    index < currentPhaseIndex
                      ? 'bg-emerald-600 text-white shadow-lg'
                      : index === currentPhaseIndex
                      ? 'bg-slate-600 text-white shadow-lg ring-2 ring-slate-200'
                      : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  {index < currentPhaseIndex ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    getPhaseIcon(phase)
                  )}
                </div>
                <div className="flex-1">
                  <span className={`text-sm font-medium ${
                    index <= currentPhaseIndex ? 'text-slate-700' : 'text-slate-400'
                  }`}>
                    {getPhaseLabel(phase)}
                  </span>
                  {index === currentPhaseIndex && (
                    <div className="text-xs text-slate-500 mt-1">Current Step</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop Progress - Horizontal Layout */}
        <div className="hidden md:block relative overflow-x-auto">
          {/* Progress Line */}
          <div className="absolute top-6 left-12 right-12 h-0.5 bg-slate-200">
            <div 
              className="h-full bg-slate-600 transition-all duration-300 ease-out"
              style={{ width: `${(currentPhaseIndex / (phases.length - 1)) * 100}%` }}
            />
          </div>
          
          {/* Phase Steps */}
          <div className="flex justify-between items-start">
            {phases.map((phase, index) => (
              <div key={phase} className="flex flex-col items-center relative z-10 flex-1">
                <div
                  className={`w-10 h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-150 mb-3 ${
                    index < currentPhaseIndex
                      ? 'bg-emerald-600 text-white shadow-lg scale-110'
                      : index === currentPhaseIndex
                      ? 'bg-slate-600 text-white shadow-lg scale-110 ring-4 ring-slate-200'
                      : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                  }`}
                >
                  {index < currentPhaseIndex ? (
                    <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    getPhaseIcon(phase)
                  )}
                </div>
                <div className="text-center px-2">
                  <span className={`text-sm font-medium transition-colors duration-150 leading-tight block ${
                    index <= currentPhaseIndex ? 'text-slate-700' : 'text-slate-400'
                  }`}>
                    {getPhaseLabel(phase)}
                  </span>
                </div>
                
                {/* Current phase indicator */}
                {index === currentPhaseIndex && (
                  <div className="absolute -bottom-2 w-2 h-2 bg-slate-600 rounded-full animate-bounce"></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Progress Percentage */}
        <div className="mt-4 md:mt-6 flex items-center justify-center">
          <div className="bg-slate-100 rounded-full px-3 py-1.5 md:px-4 md:py-2">
            <span className="text-xs md:text-sm font-medium text-slate-600">
              {Math.round((currentPhaseIndex / (phases.length - 1)) * 100)}% Complete
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressIndicator;