import { useState } from 'react';
import axios from 'axios';

const API_BASE = process.env.NODE_ENV === 'production' 
  ? 'https://whenandwhy-production.up.railway.app/api' 
  : 'http://localhost:5000/api';

const PreStudySurvey = ({ participantId, onComplete }) => {
  const [formData, setFormData] = useState({
    age: '',
    gender: '',
    academicLevel: '',
    major: '',
    dataScienceFamiliarity: 4,
    aiExperience: 4,
    priorCourses: []
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const handleCourseChange = (course, checked) => {
    setFormData(prev => ({
      ...prev,
      priorCourses: checked 
        ? [...prev.priorCourses, course]
        : prev.priorCourses.filter(c => c !== course)
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.age || formData.age < 18 || formData.age > 100) {
      newErrors.age = 'Please enter a valid age (18-100)';
    }
    if (!formData.gender) {
      newErrors.gender = 'Please select your gender';
    }
    if (!formData.academicLevel) {
      newErrors.academicLevel = 'Please select your academic level';
    }
    if (!formData.major.trim()) {
      newErrors.major = 'Please enter your major/program';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await axios.put(`${API_BASE}/participants/${participantId}/demographics`, formData);
      onComplete();
    } catch (error) {
      console.error('Error saving demographics:', error);
      alert('Error saving data. Please try again.');
    }
  };

  const courses = [
    'Introduction to Data Science',
    'Statistics',
    'Machine Learning',
    'Data Mining',
    'Research Methods',
    'Database Systems',
    'Programming (Python/R)',
    'Data Visualization'
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="bg-blue-700 px-8 py-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mr-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Pre-Study Survey</h2>
              <p className="text-blue-100">Tell us about yourself and your background</p>
            </div>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* Demographics Section */}
          <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-6 border border-gray-100">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800">Demographics</h3>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Age *
                </label>
                <input
                  type="number"
                  min="18"
                  max="100"
                  value={formData.age}
                  onChange={(e) => handleInputChange('age', parseInt(e.target.value))}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                    errors.age ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                  placeholder="Enter your age"
                />
                {errors.age && <p className="text-red-500 text-sm mt-1 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {errors.age}
                </p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Gender *
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                    errors.gender ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="non-binary">Non-binary</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                </select>
                {errors.gender && <p className="text-red-500 text-sm mt-1 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {errors.gender}
                </p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Academic Level *
                </label>
                <select
                  value={formData.academicLevel}
                  onChange={(e) => handleInputChange('academicLevel', e.target.value)}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                    errors.academicLevel ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <option value="">Select level</option>
                  <option value="bachelor">Bachelor's Student</option>
                  <option value="master">Master's Student</option>
                  <option value="phd">PhD Student</option>
                  <option value="other">Other</option>
                </select>
                {errors.academicLevel && <p className="text-red-500 text-sm mt-1 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {errors.academicLevel}
                </p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Major/Program *
                </label>
                <input
                  type="text"
                  value={formData.major}
                  onChange={(e) => handleInputChange('major', e.target.value)}
                  placeholder="e.g., Computer Science, Data Science, etc."
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                    errors.major ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                />
                {errors.major && <p className="text-red-500 text-sm mt-1 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {errors.major}
                </p>}
              </div>
            </div>
          </div>

          {/* Experience Section */}
          <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-800">Experience & Background</h3>
            </div>
            
            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Rate your familiarity with data science concepts
                </label>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-500 font-medium">Not familiar</span>
                  <div className="flex-1 relative">
                    <input
                      type="range"
                      min="1"
                      max="7"
                      value={formData.dataScienceFamiliarity}
                      onChange={(e) => handleInputChange('dataScienceFamiliarity', parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                      {[1,2,3,4,5,6,7].map(n => <span key={n}>{n}</span>)}
                    </div>
                  </div>
                  <span className="text-sm text-gray-500 font-medium">Very familiar</span>
                  <div className="ml-4 bg-blue-100 px-3 py-1 rounded-full">
                    <span className="text-sm font-bold text-blue-700">{formData.dataScienceFamiliarity}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Rate your experience with AI tools (ChatGPT, etc.)
                </label>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-500 font-medium">No experience</span>
                  <div className="flex-1 relative">
                    <input
                      type="range"
                      min="1"
                      max="7"
                      value={formData.aiExperience}
                      onChange={(e) => handleInputChange('aiExperience', parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                      {[1,2,3,4,5,6,7].map(n => <span key={n}>{n}</span>)}
                    </div>
                  </div>
                  <span className="text-sm text-gray-500 font-medium">Very experienced</span>
                  <div className="ml-4 bg-blue-100 px-3 py-1 rounded-full">
                    <span className="text-sm font-bold text-blue-700">{formData.aiExperience}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <label className="block text-sm font-semibold text-gray-700 mb-4">
                  Which courses have you completed? (Check all that apply)
                </label>
                <div className="grid md:grid-cols-2 gap-3">
                  {courses.map(course => (
                    <label key={course} className="flex items-center p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-200">
                      <input
                        type="checkbox"
                        checked={formData.priorCourses.includes(course)}
                        onChange={(e) => handleCourseChange(course, e.target.checked)}
                        className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                      />
                      <span className="ml-3 text-sm font-medium text-gray-700">{course}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center pt-4">
            <button
              type="submit"
              className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
              Continue to Tutorial
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PreStudySurvey;