import { useState } from 'react';
import axios from 'axios';

const API_BASE = process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:5000/api';

const DataExport = ({ participantId }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportComplete, setExportComplete] = useState(false);

  const exportData = async () => {
    setIsExporting(true);
    try {
      const response = await axios.get(`${API_BASE}/data/export/${participantId}`);
      
      // Create and download JSON file
      const dataStr = JSON.stringify(response.data, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `participant_${participantId}_data.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
      setExportComplete(true);
    } catch (error) {
      console.error('Error exporting data:', error);
      alert('Error exporting data. Please try again or contact the researcher.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-600 rounded-2xl mb-6 shadow-lg">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        
        <h3 className="text-2xl font-bold text-slate-800 mb-3">Research Data Export</h3>
        <p className="text-slate-600 mb-6 max-w-md mx-auto">
          For research transparency, you can download your complete anonymized study data as a JSON file.
        </p>
        
        {!exportComplete ? (
          <button
            onClick={exportData}
            disabled={isExporting}
            className={`inline-flex items-center px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
              isExporting
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-slate-600 text-white hover:bg-slate-700 shadow-lg hover:shadow-xl'
            }`}
          >
            {isExporting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Preparing Download...
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download My Data
              </>
            )}
          </button>
        ) : (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6">
            <div className="flex items-center justify-center mb-3">
              <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <p className="font-semibold text-emerald-800 mb-1">Data exported successfully!</p>
            <p className="text-sm text-emerald-600">Check your downloads folder for the JSON file.</p>
          </div>
        )}
        
        <div className="mt-6 bg-slate-50 rounded-xl p-4">
          <h4 className="font-medium text-slate-800 mb-2">What's included:</h4>
          <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
            <div className="flex items-center">
              <svg className="w-3 h-3 text-emerald-600 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              All survey responses
            </div>
            <div className="flex items-center">
              <svg className="w-3 h-3 text-emerald-600 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Generated ideas & rationales
            </div>
            <div className="flex items-center">
              <svg className="w-3 h-3 text-emerald-600 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Complete interaction logs
            </div>
            <div className="flex items-center">
              <svg className="w-3 h-3 text-emerald-600 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              AI suggestions & responses
            </div>
            <div className="flex items-center">
              <svg className="w-3 h-3 text-emerald-600 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Timestamps & timing data
            </div>
            <div className="flex items-center">
              <svg className="w-3 h-3 text-red-600 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              No personal information
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataExport;