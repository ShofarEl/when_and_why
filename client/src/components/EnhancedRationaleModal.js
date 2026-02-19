import React, { useState } from 'react';

const EnhancedRationaleModal = ({ 
  pendingIdea, 
  onSubmit, 
  onCancel, 
  condition 
}) => {
  const [rationale, setRationale] = useState('');
  const [refinedIdea, setRefinedIdea] = useState(pendingIdea);
  const [showRefinement, setShowRefinement] = useState(false);

  const handleSubmit = () => {
    if (rationale.length < 20) {
      alert('Please provide at least 20 characters explaining your reasoning.');
      return;
    }
    
    onSubmit(refinedIdea, rationale, refinedIdea !== pendingIdea);
  };

  const handleRefinementToggle = () => {
    setShowRefinement(!showRefinement);
    if (!showRefinement) {
      setRefinedIdea(pendingIdea); // Reset if canceling refinement
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-lg md:rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-4 md:p-6">
          <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 text-gray-800">
            Explain Your Reasoning
          </h3>
          
          <p className="text-sm md:text-base text-gray-600 mb-3 md:mb-4">
            Please explain your reasoning for this idea (minimum 20 characters):
          </p>

          {/* Original Idea Display */}
          <div className="mb-4 md:mb-6 p-3 md:p-4 bg-gray-50 rounded-lg md:rounded-xl border border-gray-200">
            <p className="text-xs md:text-sm text-gray-500 mb-1">Your original idea:</p>
            <p className="text-sm md:text-base font-medium text-gray-800">{pendingIdea}</p>
          </div>

          {/* Refinement Option */}
          <div className="mb-4 md:mb-6">
            <div className="flex items-center justify-between mb-3">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={showRefinement}
                  onChange={handleRefinementToggle}
                  className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-sm font-medium text-gray-700">
                  Refine your idea while reflecting
                </span>
              </label>
            </div>

            {showRefinement && (
              <div className="bg-blue-50 rounded-lg md:rounded-xl p-3 md:p-4 border border-blue-200">
                <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-2">
                  Refined idea (optional):
                </label>
                <textarea
                  value={refinedIdea}
                  onChange={(e) => setRefinedIdea(e.target.value)}
                  placeholder="Refine or improve your original idea based on your reflection..."
                  className="w-full p-3 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
                  rows={3}
                />
                {refinedIdea !== pendingIdea && (
                  <div className="mt-2 text-xs text-blue-600 bg-blue-100 p-2 rounded">
                    ✓ Idea has been refined
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Rationale Input */}
          <div className="mb-4 md:mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Explain your reasoning:
            </label>
            <textarea
              value={rationale}
              onChange={(e) => setRationale(e.target.value)}
              placeholder="Explain why you think this is a good research question or project idea. What makes it interesting or valuable?"
              className="w-full p-3 md:p-4 border-2 border-gray-200 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base resize-none"
              rows={4}
            />
          </div>

          {/* Reflection Prompts */}
          <div className="mb-4 md:mb-6 bg-yellow-50 rounded-lg p-3 md:p-4 border border-yellow-200">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Consider these questions:</h4>
            <ul className="text-xs md:text-sm text-gray-600 space-y-1">
              <li>• What specific insights could this research question reveal?</li>
              <li>• How does this relate to the available variables in the dataset?</li>
              <li>• What practical applications might the findings have?</li>
              <li>• Are there any limitations or challenges with this approach?</li>
            </ul>
          </div>

          {/* Submit Controls */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
            <span className="text-xs md:text-sm text-gray-500 order-2 sm:order-1">
              {rationale.length}/20 characters minimum
            </span>
            <div className="flex flex-col sm:flex-row gap-2 md:gap-3 w-full sm:w-auto order-1 sm:order-2">
              <button
                onClick={onCancel}
                className="px-4 md:px-6 py-2.5 md:py-3 bg-gray-400 text-white rounded-lg md:rounded-xl hover:bg-gray-500 font-semibold text-sm md:text-base transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={rationale.length < 20}
                className="px-4 md:px-6 py-2.5 md:py-3 bg-blue-600 text-white rounded-lg md:rounded-xl hover:bg-blue-700 disabled:opacity-50 font-semibold text-sm md:text-base transition-all duration-200"
              >
                {showRefinement && refinedIdea !== pendingIdea ? 'Submit Refined Idea' : 'Submit Idea'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedRationaleModal;