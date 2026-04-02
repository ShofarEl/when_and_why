import { useState } from 'react';

const ConsentForm = ({ onConsent }) => {
  const [agreed, setAgreed] = useState(false);
  const [showFullInfo, setShowFullInfo] = useState(false);

  return (
    <div className="max-w-5xl mx-auto px-2 sm:px-4">
      <div className="bg-white/90 backdrop-blur-sm rounded-xl md:rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="bg-slate-700 px-4 md:px-6 lg:px-8 py-4 md:py-6">
          <div className="flex items-center justify-between">
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
            <button
              onClick={() => setShowFullInfo(!showFullInfo)}
              className="text-white hover:text-slate-200 text-xs md:text-sm underline"
            >
              {showFullInfo ? 'Show Summary' : 'Full Information Sheet'}
            </button>
          </div>
        </div>
        
        <div className="p-4 md:p-6 lg:p-8 space-y-4 md:space-y-6 max-h-[60vh] overflow-y-auto">
          {!showFullInfo ? (
            // Summary View
            <>
              <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-lg">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-amber-600 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-1.964-1.333-2.732 0L3.732 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <div className="text-xs md:text-sm text-amber-800">
                    <strong>Important:</strong> Please read all information carefully before consenting. 
                    Click "Full Information Sheet" above for complete details.
                  </div>
                </div>
              </div>

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
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-sm md:text-base text-slate-800">Data Collection</h3>
                  </div>
                  <div className="text-xs md:text-sm text-slate-600 space-y-1">
                    <p>• Task responses and timestamps</p>
                    <p>• AI interaction logs (prompts & outputs)</p>
                    <p>• Survey responses</p>
                    <p>• No personal identifiers collected</p>
                  </div>
                </div>

                <div className="bg-amber-50 p-4 md:p-6 rounded-lg md:rounded-xl border border-amber-200">
                  <div className="flex items-center mb-2 md:mb-3">
                    <div className="w-6 h-6 md:w-8 md:h-8 bg-amber-600 rounded-lg flex items-center justify-center mr-2 md:mr-3">
                      <svg className="w-3 h-3 md:w-4 md:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-sm md:text-base text-slate-800">Privacy Protection</h3>
                  </div>
                  <div className="text-xs md:text-sm text-slate-600 space-y-1">
                    <p>• Pseudonymous (random ID only)</p>
                    <p>• No names, emails, or IP addresses</p>
                    <p>• Secure encrypted storage</p>
                    <p>• Aggregate reporting only</p>
                  </div>
                </div>
              </div>

              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-1.964-1.333-2.732 0L3.732 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <div className="text-xs md:text-sm text-red-800">
                    <strong>Do Not Enter Personal Information:</strong> Please do not enter any personal, 
                    sensitive, or identifying information (names, addresses, phone numbers, etc.) into the 
                    task responses or AI chat interface.
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-4 md:p-6 rounded-lg md:rounded-xl border border-slate-200">
                <h3 className="font-semibold text-sm md:text-base text-slate-800 mb-2 md:mb-3">Your Rights</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 text-xs md:text-sm text-slate-600">
                  <div className="flex items-center">
                    <svg className="w-3 h-3 md:w-4 md:h-4 text-emerald-600 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Participation is completely voluntary
                  </div>
                  <div className="flex items-center">
                    <svg className="w-3 h-3 md:w-4 md:h-4 text-emerald-600 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Withdraw at any time without consequence
                  </div>
                  <div className="flex items-center">
                    <svg className="w-3 h-3 md:w-4 md:h-4 text-emerald-600 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Take breaks during the study
                  </div>
                  <div className="flex items-center">
                    <svg className="w-3 h-3 md:w-4 md:h-4 text-emerald-600 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Request data deletion (see full info)
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
            </>
          ) : (
            // Full Information Sheet
            <div className="space-y-6 text-xs md:text-sm">
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
                <h3 className="font-bold text-base md:text-lg text-blue-900 mb-2">Full Participant Information Sheet</h3>
                <p className="text-blue-800">
                  Please read this information carefully. You can download or print this page for your records.
                </p>
              </div>

              {/* Study Purpose Section */}
              <div className="bg-white p-4 rounded-lg border border-slate-200">
                <h4 className="font-bold text-slate-800 mb-2">1. Study Purpose and Background</h4>
                <p className="text-slate-600 mb-2">
                  This research investigates how different timing and scaffolding approaches for AI assistance 
                  affect creativity, learning, and perceived agency in data science problem framing. You will 
                  complete creative tasks with varying levels of AI support to help us understand optimal 
                  human-AI collaboration patterns.
                </p>
                <p className="text-slate-600">
                  <strong>Research Questions:</strong> How does the timing of AI support (just-in-time vs. always-on) 
                  and reflection requirements affect creative output quality, learner agency, and knowledge transfer?
                </p>
              </div>

              {/* Data Collection Section */}
              <div className="bg-white p-4 rounded-lg border border-slate-200">
                <h4 className="font-bold text-slate-800 mb-2">2. Data Collection - What We Record</h4>
                <p className="text-slate-600 mb-2"><strong>We collect the following data:</strong></p>
                <ul className="list-disc list-inside text-slate-600 space-y-1 ml-2">
                  <li><strong>Task responses:</strong> Your research questions, ideas, and rationales</li>
                  <li><strong>AI interaction logs:</strong> All prompts sent to AI and AI-generated suggestions</li>
                  <li><strong>Interaction timestamps:</strong> When you submit ideas, request help, accept/dismiss suggestions</li>
                  <li><strong>Survey responses:</strong> Demographics, experience ratings, preference rankings, feedback</li>
                  <li><strong>Session metadata:</strong> Task completion times, condition assignments</li>
                </ul>
                <p className="text-slate-600 mt-2"><strong>We do NOT collect:</strong></p>
                <ul className="list-disc list-inside text-slate-600 space-y-1 ml-2">
                  <li>Names, email addresses, or student IDs</li>
                  <li>IP addresses or device identifiers</li>
                  <li>Browser fingerprints or tracking cookies</li>
                  <li>Keystroke patterns or mouse movements</li>
                  <li>Any personal or sensitive information</li>
                </ul>
              </div>

              {/* AI Usage Section */}
              <div className="bg-white p-4 rounded-lg border border-slate-200">
                <h4 className="font-bold text-slate-800 mb-2">3. AI System Usage and Data Flow</h4>
                <p className="text-slate-600 mb-2">
                  <strong>AI Model:</strong> This study uses OpenAI's GPT-3.5-turbo API to generate creative suggestions.
                </p>
                <p className="text-slate-600 mb-2">
                  <strong>Data sent to OpenAI:</strong> When AI assistance is requested, we send: (1) the dataset 
                  description, (2) your existing ideas (if any), and (3) refinement requests. We do NOT send any 
                  identifying information.
                </p>
                <p className="text-slate-600 mb-2">
                  <strong>OpenAI's data handling:</strong> According to OpenAI's API data usage policy, API inputs 
                  and outputs are not used to train their models and are retained for 30 days for abuse monitoring, 
                  then deleted.
                </p>
                <p className="text-red-600 font-semibold mt-2">
                  ⚠️ IMPORTANT: Do not enter any personal, sensitive, or identifying information into task responses 
                  or AI interactions. Treat all inputs as potentially visible to the AI provider.
                </p>
              </div>

              {/* Privacy and Anonymity Section */}
              <div className="bg-white p-4 rounded-lg border border-slate-200">
                <h4 className="font-bold text-slate-800 mb-2">4. Privacy Protection and Pseudonymity</h4>
                <p className="text-slate-600 mb-2">
                  <strong>Pseudonymous, not fully anonymous:</strong> Your data is linked only to a randomly 
                  generated participant ID (e.g., "P_a7f3k9m2"). We do not collect names, emails, or other 
                  identifiers. However, because we assign you a consistent ID, your data is technically 
                  <em> pseudonymous</em> rather than fully anonymous.
                </p>
                <p className="text-slate-600 mb-2">
                  <strong>What this means:</strong> Your responses across all tasks are linked together for analysis, 
                  but cannot be traced back to your real identity unless you voluntarily include identifying 
                  information in your responses (which you should not do).
                </p>
                <p className="text-slate-600">
                  <strong>Confidentiality measures:</strong> All data is encrypted in transit (HTTPS) and at rest. 
                  Only the research team has access. Results will be reported in aggregate form only.
                </p>
              </div>

              {/* Data Storage Section */}
              <div className="bg-white p-4 rounded-lg border border-slate-200">
                <h4 className="font-bold text-slate-800 mb-2">5. Data Storage, Access, and Retention</h4>
                <p className="text-slate-600 mb-2">
                  <strong>Storage location:</strong> Data is stored on secure servers provided by Render.com 
                  (cloud infrastructure), with servers located in the European Union to comply with data 
                  protection regulations.
                </p>
                <p className="text-slate-600 mb-2">
                  <strong>Who can access your data:</strong> Only the primary researcher (Ark Ikhu) and research 
                  supervisor (Prof. Dr. Frank Hopfgartner) have access to the raw data.
                </p>
                <p className="text-slate-600 mb-2">
                  <strong>Retention period:</strong> Your data will be retained for up to 5 years to allow for 
                  analysis, publication, and potential follow-up studies. After this period, all data will be 
                  permanently deleted.
                </p>
                <p className="text-slate-600">
                  <strong>Public sharing:</strong> No individual-level data will be shared publicly. Only aggregated 
                  results (statistics, charts) will be reported in publications. An anonymized dataset may be 
                  shared with other researchers, but only after removing all potentially identifying information.
                </p>
              </div>

              {/* Risks and Benefits Section */}
              <div className="bg-white p-4 rounded-lg border border-slate-200">
                <h4 className="font-bold text-slate-800 mb-2">6. Risks, Discomforts, and Benefits</h4>
                <p className="text-slate-600 mb-2"><strong>Potential risks and discomforts:</strong></p>
                <ul className="list-disc list-inside text-slate-600 space-y-1 ml-2">
                  <li><strong>Time and effort:</strong> The study requires approximately 60 minutes of focused attention</li>
                  <li><strong>Mental fatigue:</strong> Creative tasks may be mentally demanding</li>
                  <li><strong>Frustration:</strong> You may experience frustration if tasks are challenging or AI suggestions are unhelpful</li>
                  <li><strong>AI-generated content:</strong> AI suggestions may occasionally be irrelevant, biased, or unexpected</li>
                  <li><strong>Confidentiality risk:</strong> Minimal risk if you accidentally include personal information (which you should avoid)</li>
                </ul>
                <p className="text-slate-600 mt-2 mb-2"><strong>How we minimize risks:</strong></p>
                <ul className="list-disc list-inside text-slate-600 space-y-1 ml-2">
                  <li>You can take breaks at any time</li>
                  <li>You can withdraw without penalty</li>
                  <li>Clear warnings not to enter personal information</li>
                  <li>Secure data handling and encryption</li>
                </ul>
                <p className="text-slate-600 mt-2 mb-2"><strong>Potential benefits:</strong></p>
                <ul className="list-disc list-inside text-slate-600 space-y-1 ml-2">
                  <li><strong>Direct benefits:</strong> You may gain experience with AI-assisted problem framing and learn about data science research questions</li>
                  <li><strong>Indirect benefits:</strong> Your participation contributes to understanding how to design better AI tools for education and creativity</li>
                  <li><strong>Societal benefits:</strong> Findings may inform the development of more effective AI-assisted learning systems</li>
                </ul>
              </div>

              {/* Withdrawal and Deletion Section */}
              <div className="bg-white p-4 rounded-lg border border-slate-200">
                <h4 className="font-bold text-slate-800 mb-2">7. Withdrawal and Data Deletion Rights</h4>
                <p className="text-slate-600 mb-2">
                  <strong>Right to withdraw:</strong> You may withdraw from the study at any time without providing 
                  a reason and without any negative consequences. Simply close your browser to stop participating.
                </p>
                <p className="text-slate-600 mb-2">
                  <strong>Data deletion requests:</strong> Because your data is linked to a pseudonymous participant 
                  ID, you can request deletion of your data by emailing aikhu@uni-koblenz.de with your participant 
                  ID (which will be displayed at the end of the study).
                </p>
                <p className="text-slate-600 mb-2">
                  <strong>If you don't have your participant ID:</strong> We understand that you might not be able 
                  to request data deletion because the study is fully anonymous and you may not remember your 
                  participant ID. In such cases, your data will remain part of the anonymized dataset.
                </p>
                <p className="text-slate-600 mb-2">
                  <strong>Deletion deadline:</strong> Data deletion requests must be made within 30 days of completing 
                  the study. After this period, data may be aggregated or anonymized in ways that make individual 
                  deletion impossible.
                </p>
                <p className="text-slate-600">
                  <strong>Aggregated results:</strong> Once your data has been included in aggregated statistical 
                  analyses or published results, it cannot be removed from those aggregate reports (though your 
                  individual raw data can still be deleted).
                </p>
              </div>

              {/* Voluntary Participation Section */}
              <div className="bg-white p-4 rounded-lg border border-slate-200">
                <h4 className="font-bold text-slate-800 mb-2">8. Voluntary Participation</h4>
                <p className="text-slate-600">
                  Your participation in this research is completely voluntary. You are free to decline participation, 
                  skip any questions you don't wish to answer, take breaks, or withdraw at any time without any 
                  penalty or negative consequences. Your decision will not affect your relationship with the 
                  University of Koblenz or the research team.
                </p>
              </div>

              {/* Contact Information Section */}
              <div className="bg-white p-4 rounded-lg border border-slate-200">
                <h4 className="font-bold text-slate-800 mb-2">9. Questions and Concerns</h4>
                <p className="text-slate-600 mb-2">
                  If you have any questions about this research, your rights as a participant, or wish to request 
                  data deletion, please contact:
                </p>
                <div className="bg-slate-50 p-3 rounded border border-slate-200 text-slate-700">
                  <p><strong>Primary Researcher:</strong> Ark Ikhu</p>
                  <p><strong>Email:</strong> aikhu@uni-koblenz.de</p>
                  <p><strong>Supervisor:</strong> Prof. Dr. Frank Hopfgartner</p>
                  <p><strong>Institution:</strong> University of Koblenz, Department of Computer Science</p>
                  <p><strong>Address:</strong> Universitätsstraße 1, 56070 Koblenz, Germany</p>
                </div>
              </div>

              {/* Data Protection Notice */}
              <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-lg">
                <h4 className="font-bold text-amber-900 mb-2">Data Protection Notice</h4>
                <p className="text-amber-800 text-xs">
                  This research follows data protection principles. While we strive to comply with GDPR-like 
                  standards for data protection, formal ethics approval is not required for this low-risk 
                  educational research study. Your data will be handled with the highest standards of 
                  confidentiality and security.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="bg-slate-50 p-4 md:p-6 border-t border-slate-200">
          <div className="mb-4 text-center">
            <button
              onClick={() => window.print()}
              className="text-slate-600 hover:text-slate-800 text-xs md:text-sm underline"
            >
              Print or Save This Page
            </button>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-start space-y-3 sm:space-y-0 sm:space-x-4 mb-4">
            <input
              type="checkbox"
              id="consent-checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-1 h-4 w-4 md:h-5 md:w-5 text-slate-600 focus:ring-slate-500 border-slate-300 rounded flex-shrink-0"
            />
            <label htmlFor="consent-checkbox" className="text-xs md:text-sm text-slate-700 cursor-pointer">
              <strong>I confirm that:</strong>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>I have read and understood the information provided above</li>
                <li>I have had the opportunity to review the full information sheet</li>
                <li>I understand what data will be collected and how it will be used</li>
                <li>I understand that my participation is voluntary and I can withdraw at any time</li>
                <li>I understand the risks and benefits of participation</li>
                <li>I understand how to request data deletion (within 30 days using my participant ID)</li>
                <li>I agree not to enter any personal or sensitive information during the study</li>
                <li>I voluntarily agree to participate in this research study</li>
              </ul>
            </label>
          </div>

          <div className="flex justify-center">
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              I Consent - Begin Study
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsentForm;
