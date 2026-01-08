import { useState } from 'react';

const ConsentForm = ({ onConsent }) => {
  const [agreed, setAgreed] = useState(false);

  return (
    <div className="max-w-4xl mx-auto px-2 sm:px-4">
      <div className="bg-white/90 backdrop-blur-sm rounded-xl md:rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="bg-slate-700 px-4 md:px-6 lg:px-8 py-4 md:py-6">
          <div className="flex items-center">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 rounded-lg md:rounded-xl flex items-center justify-center mr-3 md:mr-4">
              <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white">Informed Consent</h2>
              <p className="text-xs sm:text-sm md:text-base text-slate-200">Research Participation Agreement</p>
            </div>
          </div>
        </div>
        
        <div className="p-4 md:p-6 lg:p-8 space-y-4 md:space-y-6 max-h-80 md:max-h-96 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="bg-slate-100 p-4 md:p-6 rounded-lg md:rounded-xl border border-slate-200">
              <div className="flex items-center mb-2 md:mb-3">
                <div className="w-6 h-6 md:w-8 md:h-8 bg-slate-600 rounded-lg flex items-center justify-center mr-2 md:mr-3">
                  <svg className="w-3 h-3 md:w-4 md:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-sm md:text-base text-slate-800">Study Purpose</h3>
              </div>
              <p className="text-xs md:text-sm text-slate-600">
                You are being invited to participate in research examining how different types of AI assistance 
                affect creativity and learning in data science problem framing.
              </p>
            </div>

            <div className="bg-emerald-50 p-4 md:p-6 rounded-lg md:rounded-xl border border-emerald-200">
              <div className="flex items-center mb-2 md:mb-3">
                <div className="w-6 h-6 md:w-8 md:h-8 bg-emerald-600 rounded-lg flex items-center justify-center mr-2 md:mr-3">
                  <svg className="w-3 h-3 md:w-4 md:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-sm md:text-base text-slate-800">Time Commitment</h3>
              </div>
              <div className="text-xs md:text-sm text-slate-600 space-y-1">
                <p>• Demographics survey: 10 minutes</p>
                <p>• 4 creative tasks: 40 minutes</p>
                <p>• Transfer tasks: 7 minutes</p>
                <p>• Final survey: 3 minutes</p>
                <p className="font-medium text-emerald-700">Total: ~60 minutes</p>
              </div>
            </div>

            <div className="bg-blue-50 p-4 md:p-6 rounded-lg md:rounded-xl border border-blue-200">
              <div className="flex items-center mb-2 md:mb-3">
                <div className="w-6 h-6 md:w-8 md:h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-2 md:mr-3">
                  <svg className="w-3 h-3 md:w-4 md:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-sm md:text-base text-slate-800">Privacy & Data</h3>
              </div>
              <div className="text-xs md:text-sm text-slate-600 space-y-1">
                <p>• Anonymous participant ID only</p>
                <p>• No personal information stored</p>
                <p>• GDPR compliant data handling</p>
                <p>• Right to withdraw anytime</p>
              </div>
            </div>

            <div className="bg-amber-50 p-4 md:p-6 rounded-lg md:rounded-xl border border-amber-200">
              <div className="flex items-center mb-2 md:mb-3">
                <div className="w-6 h-6 md:w-8 md:h-8 bg-amber-600 rounded-lg flex items-center justify-center mr-2 md:mr-3">
                  <svg className="w-3 h-3 md:w-4 md:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-sm md:text-base text-slate-800">AI Interaction</h3>
              </div>
              <p className="text-xs md:text-sm text-slate-600">
                This study uses GPT-4.0 to generate suggestions. You'll be clearly informed when 
                interacting with AI. Content is for research purposes only.
              </p>
            </div>
          </div>

          <div className="bg-slate-50 p-4 md:p-6 rounded-lg md:rounded-xl border border-slate-200">
            <h3 className="font-semibold text-sm md:text-base text-slate-800 mb-2 md:mb-3">Your Rights</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 text-xs md:text-sm text-slate-600">
              <div className="flex items-center">
                <svg className="w-3 h-3 md:w-4 md:h-4 text-emerald-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Participation is completely voluntary
              </div>
              <div className="flex items-center">
                <svg className="w-3 h-3 md:w-4 md:h-4 text-emerald-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Withdraw at any time without consequence
              </div>
              <div className="flex items-center">
                <svg className="w-3 h-3 md:w-4 md:h-4 text-emerald-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Take breaks during the study
              </div>
              <div className="flex items-center">
                <svg className="w-3 h-3 md:w-4 md:h-4 text-emerald-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Request data deletion anytime
              </div>
            </div>
          </div>

          <div className="bg-slate-100 p-4 md:p-6 rounded-lg md:rounded-xl border border-slate-200">
            <h3 className="font-semibold text-sm md:text-base text-slate-800 mb-2">Contact Information</h3>
            <div className="text-xs md:text-sm text-slate-600">
              <p><strong>Researcher:</strong> Ark Ikhu - aikhu@uni-koblenz.de</p>
              <p><strong>Supervisor:</strong> Prof. Dr. Frank Hopfgartner</p>
              <p><strong>Institution:</strong> University of Koblenz, Department of Computer Science</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 p-4 md:p-6 border-t border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-start space-y-3 sm:space-y-0 sm:space-x-4">
            <input
              type="checkbox"
              id="consent-checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-1 h-4 w-4 md:h-5 md:w-5 text-slate-600 focus:ring-slate-500 border-slate-300 rounded flex-shrink-0"
            />
            <label htmlFor="consent-checkbox" className="text-xs md:text-sm text-slate-700 cursor-pointer">
              I have read and understood the information above. I voluntarily agree to participate 
              in this research study. I understand that I can withdraw at any time without consequence 
              and that my data will be handled according to GDPR regulations.
            </label>
          </div>

          <div className="mt-4 md:mt-6 flex justify-center">
            <button
              onClick={onConsent}
              disabled={!agreed}
              className={`inline-flex items-center justify-center px-6 md:px-8 py-3 md:py-4 rounded-lg md:rounded-xl font-semibold text-sm md:text-base transition-all duration-200 w-full sm:w-auto ${
                agreed 
                  ? 'bg-slate-600 text-white hover:bg-slate-700 shadow-lg hover:shadow-xl' 
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <svg className="w-4 h-4 md:w-5 md:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
              Begin Study
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsentForm;