import React, { useState } from 'react';
import DoctorPortalBackground from '../components/DoctorPortalBackground';

export default function DoctorConsultationRoom({ setCurrentPage }) {
  const [activeTab, setActiveTab] = useState('prescription');
  const [caseNotes, setCaseNotes] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // E-Prescription Form State
  const [medicine, setMedicine] = useState('');
  const [dosage, setDosage] = useState('1-0-1 (After Food)');
  const [duration, setDuration] = useState('5 Days');
  const [instructions, setInstructions] = useState('Drink plenty of warm water and avoid oily foods.');
  
  const [prescriptionList, setPrescriptionList] = useState([
    { name: 'Amlodipine 5mg', dosage: '1-0-0', duration: '7 Days' }
  ]);

  const handleAddMedicine = (e) => {
    e.preventDefault();
    if (!medicine.trim()) return;
    setPrescriptionList(prev => [...prev, { name: medicine, dosage, duration }]);
    setMedicine('');
  };

  const handleSignAndSend = () => {
    setSuccessMsg('Digital E-Prescription successfully signed and sent to patient vault!');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  return (
    <DoctorPortalBackground>
    <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col h-[calc(100vh-80px)]">
      {/* Top Header & Navigation */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <button 
            onClick={() => setCurrentPage('doctor-dashboard')}
            className="text-xs text-emerald-600 font-semibold hover:underline mb-0.5 inline-block"
          >
            &larr; Back to Doctor Command Portal
          </button>
          <h1 className="text-xl font-bold text-slate-800">Active Teleconsultation & E-Prescription Room</h1>
        </div>

        <div className="flex items-center gap-3">
          <span className="bg-red-100 text-red-700 text-xs font-bold px-3 py-1 rounded-full animate-pulse">
            🔴 Live Session (ID: #ENC-9042)
          </span>
          <button 
            onClick={() => setCurrentPage('doctor-dashboard')}
            className="bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold px-3.5 py-2 rounded-lg transition"
          >
            End & Exit Room
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="mb-4 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-2.5 rounded-xl text-xs font-medium animate-fade-in">
          {successMsg}
        </div>
      )}

      {/* Main Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 overflow-hidden pb-4">
        
        {/* Left: Video / Audio Stream Simulation */}
        <div className="lg:col-span-2 bg-slate-900 rounded-2xl flex flex-col justify-between p-4 relative shadow-lg overflow-hidden">
          <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-2 z-10">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            Patient: Amit Roy (42 yrs / Male)
          </div>

          {/* Video Placeholder Area */}
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 gap-2">
            <span className="text-4xl">📹</span>
            <p className="text-sm font-medium">Secure Peer-to-Peer Video Stream Active</p>
            <span className="text-xs text-slate-500">Bandwidth: 4.2 Mbps • Latency: 32ms</span>
          </div>

          {/* Call Controls Bar */}
          <div className="flex justify-center gap-4 bg-slate-800/90 p-3 rounded-xl backdrop-blur">
            <button 
              onClick={() => alert('Microphone toggled')}
              className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg text-xs font-medium transition"
            >
              🎤 Mute Microphone
            </button>
            <button 
              onClick={() => alert('Camera toggled')}
              className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg text-xs font-medium transition"
            >
               Turn Off Camera
            </button>
            <button 
              onClick={() => setCurrentPage('doctor-dashboard')}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-xs font-semibold transition"
            >
              Disconnect Call
            </button>
          </div>
        </div>

        {/* Right: Interactive Doctor Toolkit (Tabs) */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
          
          {/* Workspace Tabs */}
          <div className="flex border-b border-slate-200 bg-slate-50">
            <button 
              onClick={() => setActiveTab('prescription')}
              className={`flex-1 py-3 text-xs font-semibold text-center transition ${
                activeTab === 'prescription' ? 'border-b-2 border-emerald-600 text-emerald-700 bg-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              💊 E-Prescription
            </button>
            <button 
              onClick={() => setActiveTab('notes')}
              className={`flex-1 py-3 text-xs font-semibold text-center transition ${
                activeTab === 'notes' ? 'border-b-2 border-emerald-600 text-emerald-700 bg-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              📝 Case Notes
            </button>
            <button 
              onClick={() => setActiveTab('vitals')}
              className={`flex-1 py-3 text-xs font-semibold text-center transition ${
                activeTab === 'vitals' ? 'border-b-2 border-emerald-600 text-emerald-700 bg-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              📊 Live Vitals
            </button>
          </div>

          {/* Tab Contents */}
          <div className="p-4 flex-1 overflow-y-auto space-y-4">
            
            {/* Tab 1: E-Prescription Writer */}
            {activeTab === 'prescription' && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-bold text-slate-800 text-sm mb-1">Digital Prescription Creator</h3>
                  <p className="text-xs text-slate-500">Add medicines below; they will be digitally signed and sent instantly to the patient's vault.</p>
                </div>

                {/* Added Medicines List */}
                <div className="space-y-2">
                  {prescriptionList.map((item, idx) => (
                    <div key={idx} className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 flex justify-between items-center text-xs">
                      <div>
                        <strong className="text-slate-800">{item.name}</strong>
                        <span className="text-slate-500 block">Dosage: {item.dosage} • {item.duration}</span>
                      </div>
                      <button 
                        onClick={() => setPrescriptionList(prescriptionList.filter((_, i) => i !== idx))}
                        className="text-red-500 hover:text-red-700 font-bold px-1.5"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add Medicine Form */}
                <form onSubmit={handleAddMedicine} className="space-y-3 pt-2 border-t border-slate-100">
                  <input
                    type="text"
                    placeholder="Medicine Name & Strength (e.g. Paracetamol 650mg)"
                    value={medicine}
                    onChange={(e) => setMedicine(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg p-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Frequency (1-0-1)"
                      value={dosage}
                      onChange={(e) => setDosage(e.target.value)}
                      className="border border-slate-200 rounded-lg p-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <input
                      type="text"
                      placeholder="Duration (5 Days)"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      className="border border-slate-200 rounded-lg p-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2 rounded-lg text-xs transition"
                  >
                    + Add to Prescription
                  </button>
                </form>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">General Instructions / Advice</label>
                  <textarea
                    rows="2"
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg p-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  ></textarea>
                </div>

                <button
                  type="button"
                  onClick={handleSignAndSend}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-lg text-xs transition shadow-sm"
                >
                  Sign & Send E-Prescription securely
                </button>
              </div>
            )}

            {/* Tab 2: Case Notes */}
            {activeTab === 'notes' && (
              <div className="space-y-3">
                <h3 className="font-bold text-slate-800 text-sm">Clinical Observations & Diagnosis</h3>
                <textarea
                  rows="8"
                  value={caseNotes}
                  onChange={(e) => setCaseNotes(e.target.value)}
                  placeholder="Record symptoms, provisional diagnosis, and physical examination findings..."
                  className="w-full border border-slate-200 rounded-lg p-3 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                ></textarea>
                <button
                  onClick={() => alert('Case notes saved to patient EHR history successfully!')}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 rounded-lg text-xs transition"
                >
                  Save Notes to EHR
                </button>
              </div>
            )}

            {/* Tab 3: Live Vitals */}
            {activeTab === 'vitals' && (
              <div className="space-y-3">
                <h3 className="font-bold text-slate-800 text-sm">Real-time Patient Vitals Stream</h3>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Blood Pressure:</span>
                    <strong className="text-slate-800">138/88 mmHg (Elevated)</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Heart Rate:</span>
                    <strong className="text-slate-800">78 bpm (Normal)</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Blood Glucose:</span>
                    <strong className="text-slate-800">132 mg/dL (Postprandial)</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">SpO2 Level:</span>
                    <strong className="text-emerald-700">98% Room Air</strong>
                  </div>
                </div>
                <p className="text-[11px] text-slate-400 italic">
                  * Vitals streamed securely via connected BLE smart health wearable devices paired with the patient app.
                </p>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
    </DoctorPortalBackground>
  );
}