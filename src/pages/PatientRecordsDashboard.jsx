import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../constants/api'; 

export default function PatientRecordsDashboard({ setCurrentPage }) {
  const { user } = useContext(AuthContext);

  const isAuthorizedDoctor = !!user && user.role === 'doctor' && !!user.id;

  if (!isAuthorizedDoctor) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white border rounded-xl shadow-sm p-8 max-w-md w-full text-center">
          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center text-2xl">🔒</div>
          <h2 className="text-lg font-black text-gray-800 mb-2">Access Restricted</h2>
          <button onClick={() => setCurrentPage && setCurrentPage('dashboard')} className="w-full bg-slate-900 text-white font-bold px-4 py-2.5 rounded-lg">← Back to Dashboard</button>
        </div>
      </div>
    );
  }

  const [activeTab, setActiveTab] = useState('today'); 
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  
  const [showAddRecord, setShowAddRecord] = useState(false);
  const [newRecord, setNewRecord] = useState({ diagnosis: '', prescription: '', mode: 'Hospital', notes: '' });
  const [saving, setSaving] = useState(false);

  const [fees, setFees] = useState({ video: '', physical: '' });
  const [feeStatus, setFeeStatus] = useState('');

  // ✅ NEW: live availability status
  const [availStatus, setAvailStatus] = useState('offline');

  useEffect(() => {
    fetchDoctorData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const fetchDoctorData = async () => {
    setLoading(true);
    setError('');
    try {
      const feeResponse = await api.get('/doctors/profile');
      if (feeResponse.data) {
        setFees({
          video: feeResponse.data.video_fee || 69,
          physical: feeResponse.data.physical_fee || 150
        });
        // ✅ NEW: pre-select the current status so the toggle reflects reality on load
        if (feeResponse.data.availability_status) {
          setAvailStatus(feeResponse.data.availability_status);
        }
      }

      const patientResponse = await api.get('/patients');
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const mapped = patientResponse.data.map(p => {
        const apptDate = p.scheduled_at ? new Date(p.scheduled_at) : new Date(); 
        apptDate.setHours(0, 0, 0, 0);

        let timeline = 'today';
        if (apptDate > today) timeline = 'upcoming';
        if (apptDate < today) timeline = 'past';

        return {
          id: p.patient_id,
          appointmentId: p.appointment_id,
          name: p.full_name,
          age: p.age ?? 'N/A',
          mode: p.mode || 'Teleconsultation',
          timeline: timeline,
          history: []
        };
      });
      
      setPatients(mapped.filter(p => p.timeline === activeTab));
    } catch (err) {
      console.error('Failed to fetch data:', err);
      setError('Could not load records. Verify your login access.');
    } finally {
      setLoading(false);
    }
  };

  // ✅ NEW: toggle live availability status
  const handleSetStatus = async (status) => {
    const previous = availStatus;
    setAvailStatus(status); // optimistic update
    try {
      await api.put('/doctors/status', { status });
    } catch (err) {
      console.error('Failed to update status:', err);
      setAvailStatus(previous); // revert on failure
    }
  };

  const handleSelectPatient = async (patient) => {
    if (selectedPatient?.id === patient.id) {
      setSelectedPatient(null);
      return;
    }
    
    try {
      const response = await api.get(`/patients/${patient.id}`);
      setSelectedPatient({ ...patient, history: response.data.history || [] });
      setShowAddRecord(false);
    } catch (err) {
      console.error("Failed to load patient history", err);
    }
  };

  const handleSaveRecord = async () => {
    if (!newRecord.diagnosis || !newRecord.prescription) {
      alert('Please fill out both the diagnosis and prescription fields.');
      return;
    }

    setSaving(true);
    try {
      await api.post('/doctors/prescription', {
        appointment_id: selectedPatient.appointmentId || undefined,
        patient_id: selectedPatient.id,
        disease: newRecord.diagnosis,
        diagnosis: newRecord.diagnosis,
        prescription: newRecord.prescription,
        medicines: newRecord.prescription,
        treatment: '',
        suggestions: '',
        next_steps: '',
        notes: newRecord.notes,
      });

      alert(`Prescription and record securely saved for ${selectedPatient.name}!`);
      handleSelectPatient(selectedPatient); 
      setShowAddRecord(false);
      setNewRecord({ diagnosis: '', prescription: '', mode: 'Hospital', notes: '' });
    } catch (err) {
      console.error('Failed to save record:', err);
      alert('Error saving record. Check console.');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateFees = async () => {
    try {
      await api.put('/doctors/fees', fees);
      setFeeStatus('✓ Fees updated permanently!');
      setTimeout(() => setFeeStatus(''), 3000);
    } catch (err) {
      console.error('Failed to update fees:', err);
      setFeeStatus('❌ Error updating fees');
      setTimeout(() => setFeeStatus(''), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-12">
      <header className="bg-emerald-800 text-white p-6 shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black flex items-center gap-2">🩺 Physician Command Center</h1>
            <p className="text-emerald-200 text-sm mt-1">Dr. {user.full_name || 'Doctor'} | Secure Encrypted Dashboard</p>
          </div>
          <button onClick={() => setCurrentPage && setCurrentPage('dashboard')} className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm font-bold transition-all border border-emerald-700">← Exit to Main</button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto mt-8 px-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        <div className="space-y-6">

          {/* ✅ NEW: Live Availability Status Toggle */}
          <div className="bg-white rounded-xl shadow-sm border p-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Your Live Status</h3>
            <div className="flex flex-col gap-2">
              {['available', 'in_consultation', 'offline'].map(s => (
                <button
                  key={s}
                  onClick={() => handleSetStatus(s)}
                  className={`py-2 rounded-lg text-xs font-bold border-2 transition-all text-left px-3 ${
                    availStatus === s ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {s === 'available' ? '🟢 Available' : s === 'in_consultation' ? '🟡 In Consultation' : '⚪ Offline'}
                </button>
              ))}
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border p-4 space-y-2">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-2">Queue Management</h3>
            {['today', 'upcoming', 'past'].map(tab => (
              <button 
                key={tab}
                onClick={() => { setActiveTab(tab); setSelectedPatient(null); }}
                className={`w-full text-left px-4 py-3 rounded-lg font-bold text-sm transition-all ${
                  activeTab === tab 
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200 shadow-sm' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {tab === 'today' ? '📍 Present Queue (Today)' : tab === 'upcoming' ? '🗓️ Future Appointments' : '📁 Past Records Archive'}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-5">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Consultation Fees</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-600">Teleconsultation (₹)</label>
                <input 
                  type="number" 
                  value={fees.video} 
                  onChange={e => setFees({...fees, video: e.target.value})} 
                  className="w-full mt-1 p-2.5 border border-gray-200 rounded-md text-sm font-semibold focus:ring-2 focus:ring-emerald-500 outline-none" 
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600">Hospital Visit (₹)</label>
                <input 
                  type="number" 
                  value={fees.physical} 
                  onChange={e => setFees({...fees, physical: e.target.value})} 
                  className="w-full mt-1 p-2.5 border border-gray-200 rounded-md text-sm font-semibold focus:ring-2 focus:ring-emerald-500 outline-none" 
                />
              </div>
              <button 
                onClick={handleUpdateFees} 
                className="w-full bg-slate-900 hover:bg-slate-800 text-white py-2.5 rounded-lg text-sm font-bold shadow-sm transition-transform active:scale-95"
              >
                Save Pricing
              </button>
              {feeStatus && (
                <p className={`text-xs font-bold text-center p-2 rounded ${feeStatus.includes('Error') ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-700'}`}>
                  {feeStatus}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border p-6 min-h-[200px]">
            <h2 className="text-lg font-black text-gray-800 mb-4 capitalize">{activeTab} Patients</h2>
            
            {loading ? (
              <p className="text-sm text-gray-500 animate-pulse text-center py-8">Loading secure records...</p>
            ) : error ? (
              <p className="text-sm text-red-600 text-center font-bold py-8">{error}</p>
            ) : patients.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">No patients found in this category.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {patients.map(p => (
                  <div 
                    key={p.appointmentId ?? p.id} 
                    onClick={() => handleSelectPatient(p)} 
                    className={`p-4 border rounded-xl cursor-pointer transition-all ${selectedPatient?.id === p.id ? 'border-emerald-500 ring-1 ring-emerald-500 bg-emerald-50 shadow-sm' : 'hover:border-gray-300 hover:shadow-sm bg-white'}`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-black text-gray-900">{p.name}</h4>
                        <p className="text-xs text-gray-500 mt-0.5">Age: {p.age}</p>
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full mt-2 inline-block ${p.mode === 'Hospital' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                          {p.mode}
                        </span>
                      </div>
                      <button className="text-xs font-bold text-emerald-700 bg-emerald-100 hover:bg-emerald-200 px-3 py-1.5 rounded-full transition-colors">Open</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {selectedPatient && (
            <div className="bg-white rounded-xl shadow-lg border-t-4 border-emerald-600 p-6 animate-fade-in">
              <div className="flex justify-between items-center border-b pb-4 mb-5">
                <div>
                  <h2 className="text-xl font-black text-gray-800">Dossier: {selectedPatient.name}</h2>
                  <p className="text-xs text-gray-500 mt-1">Select an action to view history or update clinical notes.</p>
                </div>
                <button 
                  onClick={() => setShowAddRecord(!showAddRecord)} 
                  className={`px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-colors ${showAddRecord ? 'bg-gray-200 text-gray-800 hover:bg-gray-300' : 'bg-emerald-600 text-white hover:bg-emerald-700'}`}
                >
                  {showAddRecord ? 'Cancel Entry' : '➕ Add Prescription / Record'}
                </button>
              </div>

              {showAddRecord ? (
                <div className="space-y-4 bg-slate-50 p-6 rounded-xl border border-gray-200 shadow-inner">
                  <h3 className="text-sm font-black text-gray-700 border-b pb-2">Record New Clinical Encounter</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase">Consultation Method</label>
                      <select value={newRecord.mode} onChange={e => setNewRecord({...newRecord, mode: e.target.value})} className="w-full p-2.5 border rounded-lg mt-1.5 text-sm bg-white focus:ring-2 focus:ring-emerald-500 outline-none">
                        <option>Hospital Checkup</option>
                        <option>Teleconsultation</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase">Primary Diagnosis</label>
                      <input type="text" value={newRecord.diagnosis} onChange={e => setNewRecord({...newRecord, diagnosis: e.target.value})} className="w-full p-2.5 border rounded-lg mt-1.5 text-sm bg-white focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="e.g. Viral Pharyngitis" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">Digital Prescription & Notes</label>
                    <textarea value={newRecord.prescription} onChange={e => setNewRecord({...newRecord, prescription: e.target.value})} className="w-full p-3 border rounded-lg mt-1.5 text-sm bg-white h-24 focus:ring-2 focus:ring-emerald-500 outline-none resize-none" placeholder="1. Azithromycin 500mg - 1 tab daily for 3 days&#10;2. Warm salt water gargle..." />
                  </div>
                  <button onClick={handleSaveRecord} disabled={saving} className="w-full bg-emerald-700 hover:bg-emerald-800 text-white py-3 rounded-lg font-black shadow-md transition-transform active:scale-95 disabled:opacity-50">
                    {saving ? 'Saving...' : 'Securely Save Record'}
                  </button>
                </div>
              ) : (
                <div>
                  <h3 className="text-sm font-bold text-gray-700 mb-4 uppercase tracking-wide">Past Medical History & Prescriptions</h3>
                  {selectedPatient.history.length === 0 ? (
                    <div className="bg-gray-50 border border-dashed border-gray-300 rounded-xl p-8 text-center">
                      <p className="text-sm text-gray-500 font-medium">No prior records exist for this patient.</p>
                      <p className="text-xs text-gray-400 mt-1">Click "Add Prescription / Record" to create their first entry.</p>
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                      {selectedPatient.history.map((record, i) => (
                        <div key={record.id ?? i} className="p-5 border border-gray-200 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow flex flex-col gap-3">
                          <div className="flex justify-between items-start border-b border-gray-100 pb-3">
                            <div>
                              <span className="font-black text-gray-800 text-base block">{record.diagnosis || record.disease || 'General Checkup'}</span>
                              {record.doctor_name && (
                                <span className="text-xs text-gray-500">Dr. {record.doctor_name}{record.doctor_specialty ? ` · ${record.doctor_specialty}` : ''}</span>
                              )}
                            </div>
                            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                              {new Date(record.record_date || record.created_at || Date.now()).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 border-l-4 border-emerald-500 pl-4 whitespace-pre-wrap leading-relaxed bg-gray-50 py-2 rounded-r-lg">
                            <span className="font-bold text-gray-800 block mb-1">Rx / Notes:</span>{record.prescription || record.medicines}
                            {record.notes && <><br /><span className="font-bold text-gray-800 block mt-2 mb-1">Notes:</span>{record.notes}</>}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}