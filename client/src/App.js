import { useState } from 'react';
import axios from 'axios';
import ConsentForm from './components/ConsentForm';
import PreStudySurvey from './components/PreStudySurvey';
import ExperimentalTask from './components/ExperimentalTask';
import TransferTasks from './components/TransferTasks';
import PostStudySurvey from './components/PostStudySurvey';
import ProgressIndicator from './components/ProgressIndicator';
import DataExport from './components/DataExport';
import Preloader from './components/Preloader';

const API_BASE = process.env.NODE_ENV === 'production' 
  ? 'https://when-why-1.onrender.com/api' 
  : 'http://localhost:5000/api';

function App() {
  const [currentPhase, setCurrentPhase] = useState('consent');
  const [participantId, setParticipantId] = useState(null);
  const [conditionOrder, setConditionOrder] = useState([]);
  const [currentConditionIndex, setCurrentConditionIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Loading...');

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
    setIsLoading(true);
    setLoadingMessage('Creating participant...');
    try {
      const response = await axios.post(`${API_BASE}/participants/create`);
      setParticipantId(response.data.participantId);
      setConditionOrder(response.data.conditionOrder);
      setIsLoading(false);
      return response.data.participantId;
    } catch (error) {
      console.error('Error creating participant:', error);
      setIsLoading(false);
      alert('Error starting study. Please refresh and try again.');
    }
  };

  const nextPhase = () => {
    setIsLoading(true);
    setLoadingMessage('Loading next phase...');
    
    setTimeout(() => {
      const currentIndex = phases.indexOf(currentPhase);
      if (currentIndex < phases.length - 1) {
        setCurrentPhase(phases[currentIndex + 1]);
      }
      setIsLoading(false);
    }, 500);
  };

  const nextCondition = () => {
    console.log('nextCondition called, currentConditionIndex:', currentConditionIndex, 'total:', conditionOrder.length);
    return new Promise((resolve) => {
      setIsLoading(true);
      setLoadingMessage('Loading next task...');
      
      setTimeout(() => {
        if (currentConditionIndex < conditionOrder.length - 1) {
          console.log('Moving to next condition:', currentConditionIndex + 1);
          setCurrentConditionIndex(currentConditionIndex + 1);
        } else {
          console.log('All conditions complete, moving to next phase');
          nextPhase();
        }
        setIsLoading(false);
        resolve();
      }, 300);
    });
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
                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-slate-800 mb-2 md:mb-4 px-2">Welcome to iNSIGHT AI</h2>
                <p className="text-sm md:text-base lg:text-lg text-slate-600 max-w-2xl mx-auto px-4">
                  You're about to participate in cutting-edge research on AI-assisted creativity in data science
                </p>
              </div>
              <div className="text-center">
                <button 
                  onClick={nextPhase}
                  className="inline-flex items-center px-6 md:px-8 py-3 md:py-4 bg-slate-600 text-white font-semibold text-sm md:text-base lg:text-lg rounded-lg md:rounded-xl hover:bg-slate-700 transition-all duration-200 shadow-lg hover:shadow-xl w-full sm:w-auto"
                >
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
              key={`task-${currentConditionIndex}`}
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
      <Preloader isLoading={isLoading} message={loadingMessage} />
      
      <div className="container mx-auto px-2 sm:px-4 py-4 md:py-6 lg:py-8">
        <header className="text-center mb-6 md:mb-8 lg:mb-12">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-slate-800 mb-2 md:mb-4 px-4 leading-tight">
            iNSIGHT AI
          </h1>
          <p className="text-sm md:text-base lg:text-lg text-slate-600 max-w-2xl mx-auto px-4">
            AI-Assisted Data Science Problem Framing Study
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