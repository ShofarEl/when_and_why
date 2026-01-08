import { useState } from 'react';
import axios from 'axios';
import ConsentForm from './components/ConsentForm';
import PreStudySurvey from './components/PreStudySurvey';
import ExperimentalTask from './components/ExperimentalTask';
import TransferTasks from './components/TransferTasks';
import PostStudySurvey from './components/PostStudySurvey';
import ProgressIndicator from './components/ProgressIndicator';
import DataExport from './components/DataExport';

const API_BASE = process.env.NODE_ENV === 'production' 
  ? 'https://whenandwhy-production.up.railway.app/api' 
  : 'http://localhost:5000/api';

function App() {
  const [currentPhase, setCurrentPhase] = useState('consent');
  const [participantId, setParticipantId] = useState(null);
  const [conditionOrder, setConditionOrder] = useState([]);
  const [currentConditionIndex, setCurrentConditionIndex] = useState(0);

  // Phase progression
  const phases = [
    'consent',
    'pre-survey', 
    'tutorial',
    'experiment',
    'transfer',
    'post-survey',
    'complete'
  ];

  const createParticipant = async () => {
    try {
      const response = await axios.post(`${API_BASE}/participants/create`);
      setParticipantId(response.data.participantId);
      setConditionOrder(response.data.conditionOrder);
      return response.data.participantId;
    } catch (error) {
      console.error('Error creating participant:', error);
      alert('Error starting study. Please refresh and try again.');
    }
  };

  const nextPhase = () => {
    const currentIndex = phases.indexOf(currentPhase);
    if (currentIndex < phases.length - 1) {
      setCurrentPhase(phases[currentIndex + 1]);
    }
  };

  const nextCondition = () => {
    if (currentConditionIndex < conditionOrder.length - 1) {
      setCurrentConditionIndex(currentConditionIndex + 1);
    } else {
      nextPhase(); // Move to transfer tasks
    }
  };

  const renderCurrentPhase = () => {
    switch (currentPhase) {
      case 'consent':
        return (
          <ConsentForm 
            onConsent={async () => {
              const id = await createParticipant();
              if (id) nextPhase();
            }}
          />
        );
      
      case 'pre-survey':
        return (
          <PreStudySurvey 
            participantId={participantId}
            onComplete={nextPhase}
          />
        );
      
      case 'tutorial':
        return (
          <div className="max-w-5xl mx-auto px-2 sm:px-4">
            <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 lg:p-8 shadow-lg border border-slate-200">
              <div className="text-center mb-6 md:mb-8">
                <div className="inline-flex items-center justify-center w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 bg-slate-600 rounded-full mb-3 md:mb-4">
                  <svg className="w-5 h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-slate-800 mb-2 md:mb-4 px-2">Welcome to the Study</h2>
                <p className="text-sm md:text-base lg:text-lg text-slate-600 max-w-2xl mx-auto px-4">
                  You're about to participate in cutting-edge research on AI-assisted creativity in data science
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
                <div className="bg-slate-50 rounded-lg md:rounded-xl p-4 md:p-6 shadow-sm border border-slate-100">
                  <div className="flex items-center mb-3 md:mb-4">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-emerald-100 rounded-lg flex items-center justify-center mr-2 md:mr-3">
                      <svg className="w-4 h-4 md:w-5 md:h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <h3 className="text-base md:text-lg lg:text-xl font-semibold text-slate-800">Creative Tasks</h3>
                  </div>
                  <p className="text-xs md:text-sm lg:text-base text-slate-600">
                    Generate creative research questions and project ideas for real datasets. 
                    Each task takes 10 minutes and focuses on different data domains.
                  </p>
                </div>

                <div className="bg-slate-50 rounded-lg md:rounded-xl p-4 md:p-6 shadow-sm border border-slate-100">
                  <div className="flex items-center mb-3 md:mb-4">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-2 md:mr-3">
                      <svg className="w-4 h-4 md:w-5 md:h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="text-base md:text-lg lg:text-xl font-semibold text-slate-800">AI Assistance</h3>
                  </div>
                  <p className="text-xs md:text-sm lg:text-base text-slate-600">
                    Sometimes you'll receive AI suggestions to spark creativity. 
                    You can accept, modify, or ignore these suggestions completely.
                  </p>
                </div>

                <div className="bg-slate-50 rounded-lg md:rounded-xl p-4 md:p-6 shadow-sm border border-slate-100">
                  <div className="flex items-center mb-3 md:mb-4">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-amber-100 rounded-lg flex items-center justify-center mr-2 md:mr-3">
                      <svg className="w-4 h-4 md:w-5 md:h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-base md:text-lg lg:text-xl font-semibold text-slate-800">Reflection</h3>
                  </div>
                  <p className="text-xs md:text-sm lg:text-base text-slate-600">
                    Sometimes you'll be asked to explain your reasoning. 
                    This helps us understand your creative process.
                  </p>
                </div>

                <div className="bg-slate-50 rounded-lg md:rounded-xl p-4 md:p-6 shadow-sm border border-slate-100">
                  <div className="flex items-center mb-3 md:mb-4">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-slate-200 rounded-lg flex items-center justify-center mr-2 md:mr-3">
                      <svg className="w-4 h-4 md:w-5 md:h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h3 className="text-base md:text-lg lg:text-xl font-semibold text-slate-800">Your Goal</h3>
                  </div>
                  <p className="text-xs md:text-sm lg:text-base text-slate-600">
                    Generate diverse, creative research questions that could lead to 
                    meaningful insights from the data.
                  </p>
                </div>
              </div>

              <div className="text-center">
                <button 
                  onClick={nextPhase}
                  className="inline-flex items-center px-6 md:px-8 py-3 md:py-4 bg-slate-600 text-white font-semibold text-sm md:text-base lg:text-lg rounded-lg md:rounded-xl hover:bg-slate-700 transition-all duration-200 shadow-lg hover:shadow-xl w-full sm:w-auto"
                >
                  <svg className="w-4 h-4 md:w-5 md:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                  Begin Experimental Tasks
                </button>
              </div>
            </div>
          </div>
        );
      
      case 'experiment':
        if (currentConditionIndex < conditionOrder.length) {
          const condition = conditionOrder[currentConditionIndex];
          return (
            <ExperimentalTask
              participantId={participantId}
              condition={condition}
              taskNumber={currentConditionIndex + 1}
              totalTasks={conditionOrder.length}
              onComplete={nextCondition}
            />
          );
        }
        return <div>Loading...</div>;
      
      case 'transfer':
        return (
          <TransferTasks 
            participantId={participantId}
            onComplete={nextPhase}
          />
        );
      
      case 'post-survey':
        return (
          <PostStudySurvey 
            participantId={participantId}
            onComplete={nextPhase}
          />
        );
      
      case 'complete':
        return (
          <div className="max-w-3xl mx-auto text-center px-2 sm:px-4">
            <div className="bg-white rounded-xl md:rounded-2xl p-6 md:p-8 lg:p-12 shadow-lg border border-slate-200">
              <div className="inline-flex items-center justify-center w-16 h-16 md:w-18 md:h-18 lg:w-20 lg:h-20 bg-emerald-600 rounded-full mb-4 md:mb-6">
                <svg className="w-8 h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-slate-800 mb-2 md:mb-4">Study Complete!</h2>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-slate-600 mb-4 md:mb-6 px-2">
                Thank you for your valuable contribution to AI-assisted creativity research
              </p>
              <div className="bg-slate-50 rounded-lg md:rounded-xl p-4 md:p-6 mb-6 md:mb-8 shadow-sm border border-slate-100">
                <p className="text-xs md:text-sm text-slate-500 mb-2">Your anonymous participant ID:</p>
                <p className="text-lg md:text-xl lg:text-2xl font-mono font-bold text-slate-800 break-all">{participantId}</p>
              </div>
              <DataExport participantId={participantId} />
            </div>
          </div>
        );
      
      default:
        return <div>Loading...</div>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-2 sm:px-4 py-4 md:py-6 lg:py-8">
        <header className="text-center mb-6 md:mb-8 lg:mb-12">
          <div className="inline-flex items-center justify-center w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 bg-slate-600 rounded-xl md:rounded-2xl mb-4 md:mb-6 shadow-lg">
            <svg className="w-5 h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-slate-800 mb-2 md:mb-4 px-4 leading-tight">
            AI-Assisted Data Science Problem Framing Study
          </h1>
          <p className="text-sm md:text-base lg:text-lg text-slate-600 max-w-2xl mx-auto px-4">
            University of Koblenz • Department of Computer Science
          </p>
        </header>

        {participantId && currentPhase !== 'consent' && (
          <ProgressIndicator 
            currentPhase={currentPhase}
            phases={phases}
            currentCondition={currentConditionIndex + 1}
            totalConditions={conditionOrder.length}
          />
        )}

        <main>
          {renderCurrentPhase()}
        </main>
      </div>
    </div>
  );
}

export default App;