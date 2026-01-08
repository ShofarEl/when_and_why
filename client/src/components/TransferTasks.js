import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const API_BASE = process.env.NODE_ENV === 'production' 
  ? 'https://whenandwhy-production.up.railway.app/api' 
  : 'http://localhost:5000/api';

const TransferTasks = ({ participantId, onComplete }) => {
  const [currentTask, setCurrentTask] = useState(1);
  const [datasets, setDatasets] = useState({});
  const [task1Ideas, setTask1Ideas] = useState([]);
  const [task2Ideas, setTask2Ideas] = useState([]);
  const [currentIdea, setCurrentIdea] = useState('');
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes per task
  const [taskStartTime, setTaskStartTime] = useState(null);
  const [allTasksComplete, setAllTasksComplete] = useState(false);

  const timerRef = useRef(null);

  useEffect(() => {
    loadDatasets();
    startTask();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (taskStartTime) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleTaskComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
      };
    }
  }, [taskStartTime]);

  const loadDatasets = async () => {
    try {
      const response = await axios.get(`${API_BASE}/ai/datasets`);
      setDatasets(response.data);
    } catch (error) {
      console.error('Error loading datasets:', error);
    }
  };

  const startTask = () => {
    setTaskStartTime(Date.now());
    setTimeLeft(300); // Reset to 5 minutes
  };

  const getCurrentDataset = () => {
    // Use datasets 5 and 6 for transfer tasks
    const taskId = currentTask === 1 ? 5 : 6;
    return datasets[taskId];
  };

  const getCurrentIdeas = () => {
    return currentTask === 1 ? task1Ideas : task2Ideas;
  };

  const addIdea = () => {
    if (!currentIdea.trim()) return;

    const newIdea = {
      id: Date.now(),
      content: currentIdea.trim(),
      timestamp: new Date()
    };

    if (currentTask === 1) {
      setTask1Ideas(prev => [...prev, newIdea]);
    } else {
      setTask2Ideas(prev => [...prev, newIdea]);
    }

    setCurrentIdea('');
  };

  const handleTaskComplete = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    if (currentTask === 1) {
      // Move to task 2
      setCurrentTask(2);
      startTask();
    } else {
      // Complete all transfer tasks
      completeAllTasks();
    }
  };

  const completeAllTasks = async () => {
    try {
      const transferData = {
        transferTasks: [
          {
            taskNumber: 1,
            ideas: task1Ideas.map(idea => idea.content),
            completionTime: 300, // Will be calculated properly in real implementation
            timestamp: new Date()
          },
          {
            taskNumber: 2,
            ideas: task2Ideas.map(idea => idea.content),
            completionTime: Math.round((Date.now() - taskStartTime) / 1000),
            timestamp: new Date()
          }
        ]
      };

      await axios.put(`${API_BASE}/participants/${participantId}/transfer`, transferData);
      setAllTasksComplete(true);
      
      // Small delay before moving to next phase
      setTimeout(() => {
        onComplete();
      }, 2000);
    } catch (error) {
      console.error('Error saving transfer tasks:', error);
      alert('Error saving data. Please try again.');
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentDataset = getCurrentDataset();
  const currentIdeas = getCurrentIdeas();

  if (allTasksComplete) {
    return (
      <div className="max-w-3xl mx-auto text-center">
        <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-12 shadow-lg border border-green-200">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-600 rounded-full mb-6">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Transfer Tasks Complete!</h2>
          <p className="text-lg text-gray-600">Moving to final survey...</p>
          <div className="mt-6 animate-pulse">
            <div className="w-8 h-1 bg-green-600 rounded-full mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentDataset) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading transfer tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
        <div className="bg-gradient-to-r from-amber-600 to-orange-600 px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Transfer Task {currentTask} of 2</h2>
                <p className="text-amber-100">Independent problem-framing assessment</p>
              </div>
            </div>
            <div className={`flex items-center space-x-3 bg-white/20 px-4 py-2 rounded-xl ${timeLeft < 60 ? 'animate-pulse' : ''}`}>
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className={`font-mono text-lg font-bold ${timeLeft < 60 ? 'text-red-200' : 'text-white'}`}>
                {formatTime(timeLeft)}
              </span>
            </div>
          </div>
        </div>

        <div className="p-8">
          {/* Warning Banner */}
          <div className="bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-500 rounded-xl p-6 mb-8">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center mr-4">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-red-800 mb-1">⚠️ No AI Assistance Available</h3>
                <p className="text-sm text-red-700">
                  These tasks measure your independent problem-framing ability. 
                  <strong> No AI suggestions will be provided.</strong> Use only your own knowledge and creativity.
                </p>
              </div>
            </div>
          </div>

          {/* Dataset Information */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 mb-8 border border-blue-100">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800">{currentDataset.title}</h3>
            </div>
            <p className="text-gray-700 mb-4">{currentDataset.description}</p>
            <div className="bg-white rounded-lg p-4 border border-blue-200">
              <p className="text-sm font-semibold text-gray-700 mb-2">Available variables:</p>
              <div className="flex flex-wrap gap-2">
                {currentDataset.variables?.map((variable, index) => (
                  <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                    {variable}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Ideas Section */}
          <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800">Your Ideas</h3>
              </div>
              <div className="bg-white px-4 py-2 rounded-full border border-gray-200">
                <span className="text-sm font-medium text-gray-600">
                  {currentIdeas.length} ideas generated
                </span>
              </div>
            </div>
            
            {/* Ideas List */}
            <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
              {currentIdeas.map((idea, index) => (
                <div key={idea.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 border-l-4 border-l-green-500">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-semibold text-green-700 bg-green-100 px-2 py-1 rounded-full">
                      Idea {index + 1}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(idea.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-gray-800">{idea.content}</p>
                </div>
              ))}
              {currentIdeas.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <p className="text-gray-500 text-lg font-medium mb-2">No ideas yet</p>
                  <p className="text-gray-400 text-sm">Start by typing your first research question or project idea below</p>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Add a new research question or project idea:
              </label>
              <textarea
                value={currentIdea}
                onChange={(e) => setCurrentIdea(e.target.value)}
                placeholder="Type your creative research question or project idea here..."
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 resize-none"
                rows={3}
              />
              <div className="flex justify-between items-center mt-4">
                <span className="text-sm text-gray-500">
                  {currentIdea.length} characters
                </span>
                <button
                  onClick={addIdea}
                  disabled={!currentIdea.trim()}
                  className={`inline-flex items-center px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                    currentIdea.trim()
                      ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 transform hover:scale-105 shadow-lg hover:shadow-xl'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Idea
                </button>
              </div>
            </div>

            {/* Progress Info */}
            <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center space-x-4">
                  <span className="flex items-center">
                    <svg className="w-4 h-4 text-blue-600 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    <strong>{currentIdeas.length}</strong> ideas generated
                  </span>
                  <span className="flex items-center">
                    <svg className="w-4 h-4 text-orange-600 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <strong>{formatTime(timeLeft)}</strong> remaining
                  </span>
                </div>
              </div>
              {currentIdeas.length >= 3 && (
                <div className="mt-3 flex items-center text-green-700">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm font-medium">
                    Great! You've generated {currentIdeas.length} ideas. Keep going or finish when ready.
                  </span>
                </div>
              )}
            </div>

            {/* Complete Task Button */}
            <div className="mt-6 text-center">
              <button
                onClick={handleTaskComplete}
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold rounded-xl hover:from-amber-700 hover:to-orange-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
                {currentTask === 1 ? 'Complete Task 1 & Continue' : 'Complete All Transfer Tasks'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Instructions Reminder */}
      <div className="mt-8 text-center">
        <div className="inline-flex items-center bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-sm border border-gray-200">
          <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm text-gray-600">
            Focus on generating diverse, creative research questions and practical applications
          </span>
        </div>
      </div>
    </div>
  );
};

export default TransferTasks;