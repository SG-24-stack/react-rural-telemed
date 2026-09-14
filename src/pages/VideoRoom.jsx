// telemedicine-frontend/src/pages/VideoRoom.jsx
import React, { useState, useEffect, useRef } from 'react';

export default function VideoRoom({ setCurrentPage }) {
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [activePanel, setActivePanel] = useState('notes'); // 'notes' | 'chat' | 'records' | 'ai'
  
  // Mock Patient Data
  const patient = {
    id: 'P-9482',
    name: 'Ananya Sharma',
    age: 34,
    gender: 'Female',
    condition: 'Acute Bronchitis / Asthmatic Flare-up',
    vitals: {
      bp: '128/82 mmHg',
      hr: '94 bpm',
      spo2: '96%',
      temp: '99.2 °F'
    },
    allergies: ['Penicillin', 'Sulfonamides'],
    history: 'Mild asthma since childhood. No prior hospitalizations.'
  };

  const [messages, setMessages] = useState([
    { sender: 'patient', text: 'Hello doctor, my chest tightness started around 4 AM today.', time: '10:15 AM' },
    { sender: 'doctor', text: 'Noted, Ananya. Are you experiencing any shortness of breath while speaking?', time: '10:16 AM' }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [clinicalNotes, setClinicalNotes] = useState(
    'Chief Complaint: Acute chest tightness and dry cough.\nAssessment: Mild asthmatic flare-up triggered by seasonal dust.\nPlan: Prescribe bronchodilator inhaler and monitor vitals for 48 hours.'
  );
  const [aiSuggestions, setAiSuggestions] = useState([
    'Suggest checking peak expiratory flow rate (PEFR).',
    'Recommended prescription: Salbutamol Metered Dose Inhaler (2 puffs QDS PRN).',
    'Patient has a known allergy to Penicillin—avoid beta-lactam antibiotics.'
  ]);

  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    setMessages(prev => [
      ...prev,
      { sender: 'doctor', text: inputMessage, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    ]);
    setInputMessage('');
  };

  const endCall = () => {
    alert('Consultation ended.');
    if (setCurrentPage) setCurrentPage('dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Workspace */}
      <div className="flex-1 flex flex-col lg:flex-row h-screen overflow-hidden">
        
        {/* Video Screen Area */}
        <div className="flex-1 flex flex-col bg-slate-900 border-r border-slate-800 relative">
          <div className="absolute top-4 left-4 z-10 flex items-center gap-3 bg-slate-950/80 backdrop-blur-md px-4 py-2 rounded-2xl border border-slate-800 shadow-lg">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-bold text-white">{patient.name}</span>
            <span className="text-xs text-slate-400 border-l border-slate-700 pl-3">ID: {patient.id}</span>
          </div>

          <div className="flex-1 flex items-center justify-center p-4 sm:p-6 relative">
            <div className="w-full h-full max-h-[75vh] bg-slate-950 rounded-3xl border border-slate-800 relative overflow-hidden flex items-center justify-center shadow-2xl">
              {isVideoOn ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-slate-900 to-slate-950">
                  <div className="w-28 h-28 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center mb-4 text-blue-400 text-3xl font-black shadow-inner">
                    {patient.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <h3 className="text-lg font-bold text-white">{patient.name}</h3>
                  <p className="text-xs text-slate-400 mt-1">Connected via Telemedicine Client</p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-slate-500">
                  {/* Video Off Icon SVG */}
                  <svg className="w-12 h-12 mb-2 text-slate-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth="2" />
                  </svg>
                  <p className="text-sm font-semibold">Camera is turned off</p>
                </div>
              )}

              <div className="absolute bottom-6 right-6 w-36 sm:w-48 h-24 sm:h-32 bg-slate-900 rounded-2xl border border-slate-700 shadow-2xl overflow-hidden flex items-center justify-center">
                {isVideoOn ? (
                  <div className="flex flex-col items-center justify-center text-slate-400">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-xs font-bold mb-1">
                      DR
                    </div>
                    <span className="text-[10px] font-medium">You</span>
                  </div>
                ) : (
                  <span className="text-[10px] text-slate-500 font-bold">Camera Off</span>
                )}
              </div>
            </div>
          </div>

          {/* Control Bar */}
          <div className="h-20 bg-slate-950/90 backdrop-blur-md border-t border-slate-800 px-6 flex items-center justify-between z-10">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsMicOn(!isMicOn)}
                className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all cursor-pointer ${
                  isMicOn ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-rose-600 text-white shadow-lg'
                }`}
                title={isMicOn ? "Mute Mic" : "Unmute Mic"}
              >
                {isMicOn ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/></svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="1" y1="1" x2="23" y2="23"/><path strokeLinecap="round" strokeLinejoin="round" d="M9 9v3a3 3 0 005.12 2.12M15 9.34V4a3 3 0 10-5.94-.6M17 16.95A7 7 0 015 11v-1m14 1v1a7 7 0 01-.36 2.15M12 19v4m-4 0h8"/></svg>
                )}
              </button>

              <button 
                onClick={() => setIsVideoOn(!isVideoOn)}
                className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all cursor-pointer ${
                  isVideoOn ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-rose-600 text-white shadow-lg'
                }`}
                title={isVideoOn ? "Turn Camera Off" : "Turn Camera On"}
              >
                {isVideoOn ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 16v1a2 2 0 01-2 2H3a2 2 0 01-2-2V7a2 2 0 012-2h2m5.66 2H14a2 2 0 012 2v3.34l1.553-1.276A1 1 0 0119 12.618v2.764m-4-6.382L4 16m15-10l-4 4"/></svg>
                )}
              </button>

              <button 
                onClick={() => setIsScreenSharing(!isScreenSharing)}
                className={`hidden sm:flex items-center gap-2 px-4 h-12 rounded-2xl text-xs font-bold transition-all cursor-pointer border ${
                  isScreenSharing ? 'bg-blue-600 text-white border-blue-500' : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                <span>{isScreenSharing ? 'Stop Sharing' : 'Share Screen'}</span>
              </button>
            </div>

            <button 
              onClick={endCall}
              className="flex items-center gap-2 px-6 h-12 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-lg transition-all cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 8l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M5 3a2 2 0 00-2 2v1c0 8.284 6.716 15 15 15h1a2 2 0 002-2v-3.28a1 1 0 00-.684-.948l-4.493-1.498a1 1 0 00-1.21.502l-1.13 2.257a11.042 11.042 0 01-5.516-5.517l2.257-1.128a1 1 0 00.502-1.21L9.228 3.683A1 1 0 008.28 3H5z"/></svg>
              <span>End Consultation</span>
            </button>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-full lg:w-[420px] bg-slate-900 flex flex-col border-t lg:border-t-0 border-slate-800">
          <div className="grid grid-cols-4 p-2 bg-slate-950 border-b border-slate-800 gap-1">
            <button onClick={() => setActivePanel('notes')} className={`py-2 px-2 rounded-xl text-xs font-bold flex flex-col items-center gap-1 cursor-pointer ${activePanel === 'notes' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
              <span className="text-[10px]">Notes</span>
            </button>
            <button onClick={() => setActivePanel('chat')} className={`py-2 px-2 rounded-xl text-xs font-bold flex flex-col items-center gap-1 cursor-pointer ${activePanel === 'chat' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>
              <span className="text-[10px]">Chat</span>
            </button>
            <button onClick={() => setActivePanel('records')} className={`py-2 px-2 rounded-xl text-xs font-bold flex flex-col items-center gap-1 cursor-pointer ${activePanel === 'records' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
              <span className="text-[10px]">Vitals</span>
            </button>
            <button onClick={() => setActivePanel('ai')} className={`py-2 px-2 rounded-xl text-xs font-bold flex flex-col items-center gap-1 cursor-pointer ${activePanel === 'ai' ? 'bg-purple-600 text-white' : 'text-purple-400 hover:text-white'}`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/></svg>
              <span className="text-[10px]">AI</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
            {activePanel === 'notes' && (
              <div className="flex flex-col gap-4 flex-1">
                <textarea 
                  value={clinicalNotes}
                  onChange={(e) => setClinicalNotes(e.target.value)}
                  className="w-full h-48 bg-slate-950 border border-slate-800 rounded-2xl p-3 text-xs text-slate-200 focus:outline-none resize-none font-mono"
                />
                <button onClick={() => alert('Prescription sent.')} className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold cursor-pointer">
                  Issue Digital Prescription
                </button>
              </div>
            )}

            {activePanel === 'chat' && (
              <div className="flex flex-col flex-1 h-[400px]">
                <div className="flex-1 overflow-y-auto space-y-3 pr-2 mb-3">
                  {messages.map((msg, index) => (
                    <div key={index} className={`flex flex-col ${msg.sender === 'doctor' ? 'items-end' : 'items-start'}`}>
                      <div className={`max-w-[85%] p-3 rounded-2xl text-xs ${msg.sender === 'doctor' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-200 border border-slate-700'}`}>
                        {msg.text}
                      </div>
                      <span className="text-[10px] text-slate-500 mt-1">{msg.time}</span>
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>
                <form onSubmit={handleSendMessage} className="flex items-center gap-2 mt-auto">
                  <input 
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Type message..."
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
                  />
                  <button type="submit" className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center cursor-pointer">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>
                  </button>
                </form>
              </div>
            )}

            {activePanel === 'records' && (
              <div className="flex flex-col gap-4">
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4">
                  <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                    Vitals
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-900 p-3 rounded-xl border border-slate-800"><span className="text-[10px] text-slate-400">BP</span><p className="text-sm font-black text-white">{patient.vitals.bp}</p></div>
                    <div className="bg-slate-900 p-3 rounded-xl border border-slate-800"><span className="text-[10px] text-slate-400">HR</span><p className="text-sm font-black text-white">{patient.vitals.hr}</p></div>
                  </div>
                </div>
              </div>
            )}

            {activePanel === 'ai' && (
              <div className="flex flex-col gap-3">
                <div className="p-3 bg-purple-950/40 border border-purple-500/30 rounded-2xl flex items-center gap-3">
                  <div><h4 className="text-xs font-bold text-purple-300">Clinical AI Active</h4></div>
                </div>
                {aiSuggestions.map((s, idx) => (
                  <div key={idx} className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300">{s}</div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}