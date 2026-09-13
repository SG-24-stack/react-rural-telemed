import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { PAGES } from '../constants/pages';
import OverviewTab from '../components/HospitalOverviewTab';
import AIEngineTab from '../components/HospitalAIEngineTab';
import PatientDossiersTab from '../components/HospitalPatientDossiersTab';
import AvailableDoctorsTab from '../components/HospitalAvailableDoctorsTab';
import AIConversationTab from '../components/HospitalAIConversationTab';
import HospitalRegistrationTab from '../components/HospitalRegistrationTab';
import HospitalVoiceAlarmTab from '../components/HospitalVoiceAlarmTab';
import HospitalBrandLogo from '../components/HospitalBrandLogo';
import useVoiceAlerts from '../hooks/useVoiceAlerts';
import HospitalEmergencyBedsTab from '../pages/HospitalEmergencyBedsTab';
const TABS = [
  { id: 'overview', label: 'Overview', icon: '📊' },
  { id: 'ai-engine', label: 'Rural Telemedicine AI Engine', icon: '⚡' },
  { id: 'dossiers', label: 'Patient Dossiers', icon: '📁' },
  { id: 'doctors', label: 'Available Doctors', icon: '👨‍⚕️' },
  { id: 'ai-chat', label: 'AI Conversation', icon: '🤖' },
  { id: 'voice-alarm', label: 'Voice Alarm', icon: '🔔' },
  { id: 'registration', label: 'Registration & Licensing', icon: '📋' },
  { id: 'emergency-beds', label: 'Emergency Beds', icon:'🛏️'},
];
export default function HospitalPortal({ setCurrentPage, setIsLoggedIn }) {
  const { logout } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('overview');
  const [patients, setPatients] = useState([
    { id: 1, name: 'Rekha Devi', age: 54, bed: 'Ward B-12', diagnosis: 'Type 2 Diabetes, uncontrolled', doctor: 'Dr. Ansh Verma', status: 'Stable' },
    { id: 2, name: 'Mohit Kumar', age: 31, bed: 'ICU-3', diagnosis: 'Post-op cardiac monitoring', doctor: 'Dr. Priya Nair', status: 'Critical' },
    { id: 3, name: 'Sunita Yadav', age: 68, bed: 'Ward A-04', diagnosis: 'Community-acquired pneumonia', doctor: 'Dr. Ansh Verma', status: 'Improving' },
  ]);

  const [doctors, setDoctors] = useState([
    { id: 1, name: 'Dr. Ansh Verma', specialty: 'Internal Medicine', shift: '8:00 AM – 4:00 PM', room: 'OPD-2', status: 'On Duty' },
    { id: 2, name: 'Dr. Priya Nair', specialty: 'Cardiology', shift: '9:00 AM – 6:00 PM', room: 'ICU', status: 'In Surgery' },
    { id: 3, name: 'Dr. Faizan Sheikh', specialty: 'Pediatrics', shift: '10:00 AM – 6:00 PM', room: 'OPD-5', status: 'Available' },
  ]);

  const [aiEngineOnline] = useState(true); 
  const { activeCritical, activeUrgent, ackAlert } = useVoiceAlerts();
  const topAlert = activeCritical[0] || activeUrgent[0] || null;
  const topIsCritical = !!activeCritical[0];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Branding header */}
      <header className="bg-gradient-to-r from-teal-800 via-teal-700 to-cyan-800 text-white px-4 py-4 shadow-lg sticky top-0 z-40">
        <div className="max-w-6xl mx-auto flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <HospitalBrandLogo />
            <span
              className={`ml-1 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 ${
                aiEngineOnline ? 'bg-teal-400/20 text-teal-100 border border-teal-300/40' : 'bg-red-400/20 text-red-100 border border-red-300/40'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${aiEngineOnline ? 'bg-teal-300 animate-pulse' : 'bg-red-300'}`} />
              AI Engine {aiEngineOnline ? 'Online' : 'Offline'}
            </span>
          </div>

          <button
            onClick={() => {
              logout();
              setIsLoggedIn(false);
              setCurrentPage(PAGES.LOGIN);
            }}
            className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1.5 rounded-xl font-bold transition-all active:scale-95 shadow-md"
          >
            Logout
          </button>
        </div>

        {/* Tab nav */}
        <nav className="max-w-6xl mx-auto flex gap-1 mt-4 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 whitespace-nowrap text-xs font-bold px-3.5 py-2 rounded-t-lg transition-all ${
                activeTab === tab.id
                  ? 'bg-gray-50 text-teal-900'
                  : 'text-teal-100 hover:bg-white/10'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </header>
      {topAlert && (
        <div className={`sticky top-[88px] z-30 ${topIsCritical ? 'bg-red-600' : 'bg-amber-500'} text-white`}>
          <div className="max-w-6xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-bold">
              <span>{topIsCritical ? '⚠' : '🟠'}</span>
              <span>
                {topIsCritical ? 'Life-threatening alert' : 'Urgent nursing request'} — {topAlert.patientName} ({topAlert.bed}) · Dr. {topAlert.doctor}
              </span>
              <span className="hidden sm:inline font-normal opacity-85">— "{topAlert.transcript}"</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setActiveTab('voice-alarm')}
                className="bg-white/20 hover:bg-white/30 border border-white/50 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg transition-colors"
              >
                Respond
              </button>
              <button
                onClick={() => ackAlert(topAlert.id)}
                className="bg-white text-gray-800 text-[11px] font-bold px-3 py-1.5 rounded-lg transition-colors"
              >
                Acknowledge
              </button>
            </div>
          </div>
        </div>
      )}
      <main className="max-w-6xl mx-auto px-4 py-6">
        {activeTab === 'overview' && (
          <OverviewTab patients={patients} doctors={doctors} aiEngineOnline={aiEngineOnline} />
        )}
        {activeTab === 'ai-engine' && <AIEngineTab patients={patients} />}
        {activeTab === 'dossiers' && (
          <PatientDossiersTab patients={patients} setPatients={setPatients} doctors={doctors} />
        )}
        {activeTab === 'doctors' && <AvailableDoctorsTab doctors={doctors} setDoctors={setDoctors} />}
        {activeTab === 'ai-chat' && <AIConversationTab />}
        {activeTab === 'voice-alarm' && <HospitalVoiceAlarmTab patients={patients} />}
        {activeTab === 'registration' && <HospitalRegistrationTab />}
        {activeTab === 'emergency-beds' && <HospitalEmergencyBedsTab />}
      </main>
    </div>
  );
}