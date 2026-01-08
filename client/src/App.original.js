import React, { useState } from 'react';
import axios from 'axios';
import ConsentForm from './components/ConsentForm';
import PreStudySurvey from './components/PreStudySurvey';
import ExperimentalTask from './components/ExperimentalTask';
import TransferTasks from './components/TransferTasks';
import PostStudySurvey from './components/PostStudySurvey';
import ProgressIndicator from './components/ProgressIndicator';
import DataExport from './components/DataExport';

const API_BASE = process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:5000/api';

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
          <div className="max-w-4xl mx-auto p-6">
            <h2 className="text-2xl font-bold mb-6">Tutorial & Practice</h2>
            <div className="bg-blue-50 p-6 rounded-lg mb-6">
              <h3 className="text-lg font-semibold mb-4">How This Study Works</h3>
              <div className="space-y-4 text-sm">
                <p>You'll complete 4 short tasks (10 minutes each) where you generate creative research ideas for different datasets.</p>
                <p><strong>AI Assistance:</strong> Sometimes you'll see AI suggestions to help spark ideas. You can accept, modify, or ignore these suggestions.</p>
                <p><strong>Reflection:</strong> Sometimes you'll be asked to explain your reasoning for ideas you submit.</p>
                <p><strong>Your Goal:</strong> Generate creative, diverse research questions and project ideas for each dataset.</p>
              </div>
            </div>
            <button 
              onClick={nextPhase}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Start Experimental Tasks
            </button>
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
          <div className="max-w-2xl mx-auto p-6 text-center">
            <h2 className="text-3xl font-bold text-green-600 mb-4">Study Complete!</h2>
            <p className="text-lg mb-6">
              Thank you for participating in this research study. Your data has been recorded.
            </p>
            <p className="text-sm text-gray-600 mb-6">
              Participant ID: <strong>{participantId}</strong>
            </p>
            <DataExport participantId={participantId} />
          </div>
        );
      
      default:
        return <div>Loading...</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            AI-Assisted Data Science Problem Framing Study
          </h1>
          <p className="text-gray-600">
            University of Koblenz - Department of Computer Science
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
