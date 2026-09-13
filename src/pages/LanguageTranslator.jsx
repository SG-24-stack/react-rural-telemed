import React, { useState } from 'react';

export default function LanguageTranslator({ setCurrentPage }) {
  const [selectedLang, setSelectedLang] = useState('Bengali (বাংলা)');
  const [successMsg, setSuccessMsg] = useState('');
  const [voiceEnabled, setVoiceEnabled] = useState(true);

  const languages = [
    { code: 'bn', name: 'Bengali (বাংলা)', region: 'West Bengal / Rural Hubs', status: 'Active (Full Voice & Text)' },
    { code: 'hi', name: 'Hindi (हिंदी)', region: 'National / Northern Regions', status: 'Active (Full Voice & Text)' },
    { code: 'en', name: 'English', region: 'Standard Clinical', status: 'Active' }
  ];

  const handleSelectLang = (langName) => {
    setSelectedLang(langName);
    setSuccessMsg(`✓ Language updated to ${langName}. Interface, notices, and voice prompts have been synchronized.`);
    setTimeout(() => setSuccessMsg(''), 3500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6 animate-fade-in font-sans">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-800 to-green-800 text-white p-6 rounded-3xl shadow-xl flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-black flex items-center gap-2">
            <span>🌐</span> Multilingual & Voice Accessibility Hub
          </h1>
          <p className="text-emerald-100 text-sm mt-1">
            Switch regional languages (Bengali, Hindi, English) and enable voice assistance for patients and rural health workers.
          </p>
        </div>
        <button 
          onClick={() => setCurrentPage('dashboard')}
          className="bg-white text-emerald-950 px-4 py-2 rounded-xl font-bold hover:bg-emerald-50 transition-all shadow cursor-pointer whitespace-nowrap"
        >
          ← Back to Dashboard
        </button>
      </div>

      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-950 p-4 rounded-2xl text-sm font-bold shadow-md animate-fade-in flex items-center gap-2">
          <span>🎉</span> {successMsg}
        </div>
      )}

      {/* Language Selection Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {languages.map((lang) => (
          <div 
            key={lang.code}
            onClick={() => handleSelectLang(lang.name)}
            className={`bg-white rounded-3xl p-6 shadow-md border-2 cursor-pointer transition-all flex flex-col justify-between ${
              selectedLang === lang.name ? 'border-emerald-600 ring-2 ring-emerald-500 shadow-xl bg-emerald-50/40' : 'border-gray-100 hover:border-emerald-300'
            }`}
          >
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <span className="text-3xl">🗣️</span>
                {selectedLang === lang.name && (
                  <span className="bg-emerald-700 text-white text-[10px] font-black px-2.5 py-1 rounded-full">
                    Current Active
                  </span>
                )}
              </div>
              <h3 className="font-black text-gray-900 text-lg">{lang.name}</h3>
              <p className="text-xs text-gray-500">{lang.region}</p>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-emerald-800">
              <span>{lang.status}</span>
              <span>{selectedLang === lang.name ? '✓ Selected' : 'Switch →'}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Voice Assistant Toggle Settings */}
      <div className="bg-white p-6 rounded-3xl shadow-md border border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <h3 className="font-black text-gray-900 text-base">🔊 Automated Voice Readout & Audio Navigation</h3>
          <p className="text-xs text-gray-600 mt-0.5">Read emergency notices, prescription timings, and doctor instructions aloud for low-literacy users.</p>
        </div>
        <button
          onClick={() => setVoiceEnabled(!voiceEnabled)}
          className={`px-5 py-2.5 rounded-xl font-bold text-xs shadow transition-all cursor-pointer ${
            voiceEnabled ? 'bg-emerald-700 text-white' : 'bg-gray-200 text-gray-700'
          }`}
        >
          {voiceEnabled ? 'Voice Assistant Enabled ON' : 'Voice Assistant Disabled OFF'}
        </button>
      </div>

    </div>
  );
}