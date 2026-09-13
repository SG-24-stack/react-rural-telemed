import React, { useState, useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';
import { OfflineSyncContext } from '../context/OfflineSyncContext';

export default function DoctorDashboard({ setCurrentPage }) {
  // Contexts
  const { t } = useContext(LanguageContext);
  const { isOffline } = useContext(OfflineSyncContext);

  // States for UI and functionality
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [consultationType, setConsultationType] = useState('video'); // 'video' or 'physical'
  
  // States for Fee Management
  const [onlineFee, setOnlineFee] = useState('500');
  const [physicalFee, setPhysicalFee] = useState('800');
  const [feeStatus, setFeeStatus] = useState('');

  // Dummy Data: Doctor's Patient Roster / Queue
  const [patientQueue] = useState([
    {
      id: 1,
      name: 'Sunita Devi',
      age: 42,
      gender: 'Female',
      nextAppointment: 'Today, 2:30 PM',
      mode: 'Video Call',
      condition: 'Chronic Hypertension & Mild Fever',
      previousRecords: [
        { date: '10 Jul 2026', diagnosis: 'BP 140/90, prescribed Amlodipine 5mg', notes: 'Advised low sodium diet.' },
        { date: '15 May 2026', diagnosis: 'Routine Checkup', notes: 'Normal blood panels.' }
      ]
    },
    {
      id: 2,
      name: 'Ramesh Mondal',
      age: 58,
      gender: 'Male',
      nextAppointment: 'Today, 3:15 PM',
      mode: 'Physical Checkup',
      condition: 'Post-operative Joint Pain',
      previousRecords: [
        { date: '02 Jun 2026', diagnosis: 'Knee Surgery Follow-up', notes: 'Stitches removed, wound healing well.' }
      ]
    },
    {
      id: 3,
      name: 'Aarav Sharma',
      age: 12,
      gender: 'Male',
      nextAppointment: 'Today, 4:00 PM',
      mode: 'Video Call',
      condition: 'Seasonal Flu / Cough',
      previousRecords: [
        { date: '12 Dec 2025', diagnosis: 'Viral Fever', notes: 'Prescribed Paracetamol and rest.' }
      ]
    }
  ]);

  // Handler for Updating Fees
  const handleUpdateFees = (e) => {
    e.preventDefault();
    setFeeStatus('✅ Fees updated successfully!');
    // Hide the success message after 3 seconds
    setTimeout(() => setFeeStatus(''), 3000);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto mt-2 space-y-6">
      
      {/* 1. Navigation Drawer (Hamburger Menu) Overlay */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="bg-white w-72 h-full shadow-2xl p-6 animate-in slide-in-from-left flex flex-col">
            <button onClick={() => setDrawerOpen(false)} className="mb-6 font-bold text-gray-500 self-end hover:text-red-500">
              ✕ Close
            </button>
            <h2 className="font-black text-xl mb-6 text-indigo-900 border-b pb-2">Menu</h2>
            <nav className="space-y-2">
              <button onClick={() => { setCurrentPage('dashboard'); setDrawerOpen(false); }} className="block w-full text-left p-3 hover:bg-indigo-50 rounded-lg font-semibold text-gray-700">
                🏠 Patient Portal Home
              </button>
              <button onClick={() => { setCurrentPage('profile'); setDrawerOpen(false); }} className="block w-full text-left p-3 hover:bg-indigo-50 rounded-lg font-semibold text-gray-700">
                ⚙️ {t('settings') || 'Settings'}
              </button>
            </nav>
          </div>
          {/* Dark backdrop */}
          <div className="flex-1 bg-black/50 backdrop-blur-sm" onClick={() => setDrawerOpen(false)}></div>
        </div>
      )}

      {/* 2. Top Header */}
      <header className="flex flex-col md:flex-row justify-between items-center bg-white/95 backdrop-blur p-5 rounded-2xl shadow-sm border border-gray-200 gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setDrawerOpen(true)} 
            className="p-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors"
            aria-label="Open Menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
          <div>
            <h1 className="text-2xl font-black text-indigo-900">👨‍⚕️ Doctor Workspace</h1>
            <p className="text-sm text-gray-500 mt-0.5">Manage patient queues, clinical history, and fees.</p>
          </div>
          {isOffline && (
            <span className="bg-yellow-100 text-yellow-800 text-xs px-3 py-1 rounded-full font-bold border border-yellow-300 ml-2">
              Offline Mode
            </span>
          )}
        </div>

        <div>
          <button 
            onClick={() => setCurrentPage('dashboard')} 
            className="bg-gray-800 hover:bg-gray-900 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md transition-transform active:scale-95"
          >
            Switch to Patient View 🔄
          </button>
        </div>
      </header>

      {/* 3. Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Patient Queue (Takes up 2/3 of space on large screens) */}
        <div className="lg:col-span-2 bg-white/95 backdrop-blur p-6 rounded-2xl shadow-sm border border-gray-200">
          <div className="flex justify-between items-center border-b pb-4 mb-4">
            <h3 className="text-lg font-bold text-gray-800">📋 Today's Patient Queue</h3>
            <span className="bg-indigo-100 text-indigo-800 text-xs font-black px-3 py-1 rounded-full">
              {patientQueue.length} Waiting
            </span>
          </div>
          
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {patientQueue.map((patient) => (
              <div 
                key={patient.id} 
                onClick={() => {
                  setSelectedPatient(patient);
                  setConsultationType(patient.mode === 'Video Call' ? 'video' : 'physical');
                }}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${selectedPatient?.id === patient.id ? 'border-indigo-500 bg-indigo-50/50 shadow-md' : 'border-gray-100 bg-white hover:border-indigo-300'}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-bold text-gray-900 text-base">{patient.name}</h4>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md mt-1 inline-block">
                      {patient.gender}, {patient.age} yrs
                    </span>
                  </div>
                  <span className={`px-3 py-1 rounded-lg text-xs font-bold ${patient.mode === 'Video Call' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'}`}>
                    {patient.mode === 'Video Call' ? '📹 Video Call' : '🏥 Physical Checkup'}
                  </span>
                </div>
                
                <p className="text-sm text-gray-700 mb-3"><strong>Condition:</strong> {patient.condition}</p>
                
                <div className="flex justify-between items-center text-xs text-gray-500 pt-3 border-t border-gray-100/60">
                  <span>Scheduled: <strong className="text-gray-800">{patient.nextAppointment}</strong></span>
                  <span className="text-indigo-600 font-bold group-hover:underline flex items-center gap-1">
                    View Dossier <span className="text-lg leading-none">→</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Fee Management (Takes up 1/3 of space) */}
        <div className="bg-white/95 backdrop-blur p-6 rounded-2xl shadow-sm border border-gray-200 h-fit">
          <h3 className="text-lg font-bold text-gray-800 border-b pb-4 mb-4">💳 Manage Consultation Fees</h3>
          
          <form onSubmit={handleUpdateFees} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Online Video Consultation Fee (₹)</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-500 font-bold">₹</span>
                <input 
                  type="number" 
                  value={onlineFee} 
                  onChange={(e) => setOnlineFee(e.target.value)}
                  className="w-full pl-8 p-2.5 text-sm border-2 rounded-xl border-gray-200 focus:border-indigo-500 focus:ring-0 transition-colors" 
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Physical Clinic Checkup Fee (₹)</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-500 font-bold">₹</span>
                <input 
                  type="number" 
                  value={physicalFee} 
                  onChange={(e) => setPhysicalFee(e.target.value)}
                  className="w-full pl-8 p-2.5 text-sm border-2 rounded-xl border-gray-200 focus:border-indigo-500 focus:ring-0 transition-colors" 
                  required
                />
              </div>
            </div>

            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl text-sm shadow-md transition-transform active:scale-95">
              Update Pricing Config
            </button>
          </form>

          {/* Success Message */}
          {feeStatus && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm font-bold text-center animate-in fade-in slide-in-from-bottom-2">
              {feeStatus}
            </div>
          )}
        </div>

      </div>

      {/* 4. Detailed Patient Record & Actions (Renders ONLY when a patient is clicked) */}
      {selectedPatient && (
        <div className="bg-indigo-900 p-6 rounded-2xl shadow-xl border border-indigo-700 space-y-6 animate-in slide-in-from-bottom-4">
          
          {/* Dossier Header */}
          <div className="flex justify-between items-center border-b border-indigo-700/50 pb-4">
            <div>
              <h3 className="text-xl font-black text-white flex items-center gap-2">
                📂 Patient Dossier: {selectedPatient.name}
              </h3>
              <p className="text-sm text-indigo-200 mt-1">Reviewing historical health records & initiating consultation.</p>
            </div>
            <button 
              onClick={() => setSelectedPatient(null)} 
              className="bg-indigo-800 hover:bg-red-500 text-white p-2 rounded-lg transition-colors text-sm font-bold"
            >
              ✕ Close Panel
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Left: Previous Health Records Timeline */}
            <div className="bg-white/10 p-5 rounded-xl border border-white/10 space-y-4">
              <h4 className="font-bold text-indigo-100 text-sm uppercase tracking-wider flex items-center gap-2">
                ⏳ Historical Checkups
              </h4>
              <div className="space-y-3">
                {selectedPatient.previousRecords.map((rec, index) => (
                  <div key={index} className="bg-white rounded-xl p-4 shadow-sm relative">
                    {/* Timeline dot */}
                    <div className="absolute -left-2 top-4 w-4 h-4 bg-indigo-500 rounded-full border-2 border-white"></div>
                    <div className="ml-2">
                      <p className="font-black text-indigo-800 text-sm">{rec.date}</p>
                      <p className="text-gray-800 mt-1.5 text-sm leading-relaxed"><strong>Diagnosis:</strong> {rec.diagnosis}</p>
                      <p className="text-gray-600 mt-1 text-sm bg-gray-50 p-2 rounded-lg"><strong>Notes:</strong> {rec.notes}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Next Checkup Options & Launch */}
            <div className="bg-white p-6 rounded-xl flex flex-col justify-between space-y-4 shadow-inner">
              <div>
                <h4 className="font-black text-gray-900 text-base mb-2">Next Step: Launch Consultation</h4>
                <p className="text-sm text-gray-600 mb-5">Patient requested: <strong className="text-indigo-600">{selectedPatient.mode}</strong>. You can override the consultation mode below if needed.</p>
                
                {/* Toggle Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                  <button 
                    onClick={() => setConsultationType('video')}
                    className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold border-2 transition-all ${consultationType === 'video' ? 'bg-blue-50 text-blue-700 border-blue-500 shadow-sm' : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'}`}
                  >
                    📹 Video Call
                  </button>
                  <button 
                    onClick={() => setConsultationType('physical')}
                    className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold border-2 transition-all ${consultationType === 'physical' ? 'bg-emerald-50 text-emerald-700 border-emerald-500 shadow-sm' : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'}`}
                  >
                    🏥 Physical Checkup
                  </button>
                </div>
              </div>

              {/* Action Button */}
              <button 
                onClick={() => setCurrentPage(consultationType === 'video' ? 'video' : 'prescription')} 
                className={`w-full text-white font-black py-4 rounded-xl text-base shadow-lg transition-transform active:scale-95 ${consultationType === 'video' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-emerald-600 hover:bg-emerald-700'}`}
              >
                {consultationType === 'video' ? 'Launch Secure Video Room →' : 'Open Clinic Notes & Prescription →'}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}