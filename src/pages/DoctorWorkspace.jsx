import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../constants/api';

export default function DoctorWorkspace({ setCurrentPage }) {
  const { user } = useContext(AuthContext);

  const [doctors, setDoctors] = useState([]);
  const [patientQueue, setPatientQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [selectedCase, setSelectedCase] = useState(null);
  const [prescriptionText, setPrescriptionText] = useState('');
  const [consultationMode, setConsultationMode] = useState('Video Consultation');
  const [successMsg, setSuccessMsg] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchWorkspaceData();
  }, []);

  const fetchWorkspaceData = async () => {
    setLoading(true);
    setError('');
    try {
      // Real doctor directory with live availability_status
      const doctorsRes = await api.get('/doctors');
      setDoctors(doctorsRes.data || []);

      // Real appointment queue for the logged-in doctor
      const patientsRes = await api.get('/patients');
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const todaysCases = (patientsRes.data || [])
        .filter(p => {
          const apptDate = p.scheduled_at ? new Date(p.scheduled_at) : new Date();
          apptDate.setHours(0, 0, 0, 0);
          return apptDate.getTime() === today.getTime();
        })
        .map((p, idx) => ({
          id: p.appointment_id,
          patientId: p.patient_id,
          name: p.full_name,
          queueNo: `#${String(idx + 1).padStart(2, '0')}`,
          symptom: p.symptom_description || 'No symptoms noted',
          mode: p.mode || 'Teleconsultation',
          scheduledAt: p.scheduled_at
        }));

      setPatientQueue(todaysCases);
      setSelectedCase(todaysCases[0] || null);
    } catch (err) {
      console.error('Failed to load workspace data:', err);
      setError('Could not load live workspace data.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'available':
        return { label: 'Available', className: 'bg-green-100 text-green-800 animate-pulse' };
      case 'in_consultation':
        return { label: 'In Consultation', className: 'bg-amber-100 text-amber-800' };
      default:
        return { label: 'Offline', className: 'bg-gray-100 text-gray-600' };
    }
  };

  const handleIssuePrescription = async (e) => {
    e.preventDefault();
    if (!prescriptionText || !selectedCase) return;

    setSaving(true);
    try {
      await api.post('/doctors/prescription', {
        appointment_id: selectedCase.id,
        patient_id: selectedCase.patientId,
        disease: selectedCase.symptom,
        diagnosis: selectedCase.symptom,
        prescription: prescriptionText,
        medicines: prescriptionText,
        treatment: '',
        suggestions: '',
        next_steps: '',
        notes: `Consultation mode: ${consultationMode}`,
      });

      setSuccessMsg(true);
      setTimeout(() => {
        setSuccessMsg(false);
        setPrescriptionText('');
        setPatientQueue(prev => prev.filter(item => item.id !== selectedCase.id));
        setSelectedCase(null);
      }, 1800);
    } catch (err) {
      console.error('Failed to save prescription:', err);
      alert('Error saving prescription. Check console.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto mt-4 space-y-6 animate-fade-in font-sans">
      
      <div className="bg-indigo-600 text-white p-6 rounded-2xl shadow-lg flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black">👨‍⚕️ Doctor Workspace & Smart Triage Dashboard</h1>
          <p className="text-xs text-indigo-100 mt-1">Live queues, real doctor availability, and consultation records — synced with your database.</p>
        </div>
        <button 
          onClick={() => setCurrentPage('dashboard')} 
          className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow"
        >
          ← Back to Dashboard
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-gray-500 text-center py-12 animate-pulse">Loading live workspace data...</p>
      ) : error ? (
        <p className="text-sm text-red-600 font-bold text-center py-12">{error}</p>
      ) : (
        <>
          {/* Real Doctor Availability Status */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 space-y-3">
            <h3 className="font-black text-gray-800 text-sm">🟢 Real-Time Doctor Availability Status</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              {doctors.map((doc) => {
                const badge = getStatusBadge(doc.availability_status);
                return (
                  <div key={doc.doctor_id} className="p-3.5 bg-gray-50 border border-gray-200 rounded-xl space-y-2">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <p className="font-black text-gray-900">{doc.full_name}</p>
                        <p className="text-[11px] text-gray-500">{doc.specialty || 'General Physician'}{doc.spoken_languages ? ` • ${doc.spoken_languages}` : ''}</p>
                      </div>
                      <span className={`shrink-0 px-2.5 py-1 rounded-full text-[10px] font-black ${badge.className}`}>
                        {badge.label}
                      </span>
                    </div>
                    {(doc.qualification || doc.experience_years) && (
                      <div className="pt-2 border-t border-gray-200 space-y-0.5">
                        {doc.qualification && <p className="text-[11px] font-bold text-gray-700">🎓 {doc.qualification}</p>}
                        {doc.experience_years && <p className="text-[11px] text-gray-500">{doc.experience_years} years experience</p>}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Real Today's Queue */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 space-y-4">
              <div className="flex justify-between items-center border-b pb-2">
                <h3 className="font-black text-gray-800 text-sm">📋 Today's Queue</h3>
                <span className="bg-indigo-100 text-indigo-800 text-[10px] font-black px-2 py-0.5 rounded-full">
                  {patientQueue.length} Active
                </span>
              </div>

              <div className="space-y-3">
                {patientQueue.length > 0 ? (
                  patientQueue.map((item) => (
                    <div 
                      key={item.id}
                      onClick={() => setSelectedCase(item)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all text-xs ${selectedCase?.id === item.id ? 'bg-indigo-50 border-indigo-500 ring-2 ring-indigo-100' : 'bg-gray-50 border-gray-200 hover:border-gray-300'}`}
                    >
                      <div className="flex justify-between items-start">
                        <p className="font-black text-gray-900 text-sm">{item.name} <span className="text-indigo-600 font-bold">{item.queueNo}</span></p>
                        <span className="text-[10px] font-bold bg-gray-200 text-gray-700 px-2 py-0.5 rounded">
                          {item.mode}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-600 mt-1 font-semibold">Symptom: {item.symptom}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-400 text-center py-12">No patients in today's queue!</p>
                )}
              </div>
            </div>

            {/* Consultation Workspace */}
            <div className="md:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-200 space-y-5">
              {selectedCase ? (
                <div className="space-y-5 animate-fade-in">
                  <div className="border-b pb-3 flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-black text-gray-900">Consultation Case: {selectedCase.name}</h3>
                      <p className="text-xs text-indigo-600 font-bold mt-0.5">Queue Number: {selectedCase.queueNo}</p>
                    </div>
                    <span className="bg-emerald-100 text-emerald-800 text-xs font-black px-3 py-1 rounded-full">
                      {selectedCase.mode}
                    </span>
                  </div>

                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-3 text-xs">
                    <p className="font-black text-gray-800">🎙️ Select Consultation & Transmission Mode:</p>
                    <div className="grid grid-cols-3 gap-2">
                      <button 
                        type="button"
                        onClick={() => setConsultationMode('Video Consultation')}
                        className={`p-2.5 rounded-xl font-bold border transition-all ${consultationMode === 'Video Consultation' ? 'bg-indigo-600 text-white border-indigo-600 shadow' : 'bg-white text-gray-700 border-gray-200'}`}
                      >
                        📹 Live Video
                      </button>
                      <button 
                        type="button"
                        onClick={() => setConsultationMode('Audio Consultation')}
                        className={`p-2.5 rounded-xl font-bold border transition-all ${consultationMode === 'Audio Consultation' ? 'bg-indigo-600 text-white border-indigo-600 shadow' : 'bg-white text-gray-700 border-gray-200'}`}
                      >
                        📞 Audio Fallback
                      </button>
                      <button 
                        type="button"
                        onClick={() => setConsultationMode('Asynchronous Store-and-Forward')}
                        className={`p-2.5 rounded-xl font-bold border transition-all ${consultationMode === 'Asynchronous Store-and-Forward' ? 'bg-indigo-600 text-white border-indigo-600 shadow' : 'bg-white text-gray-700 border-gray-200'}`}
                      >
                        📦 Async Submission
                      </button>
                    </div>
                  </div>

                  <form onSubmit={handleIssuePrescription} className="space-y-4 text-xs">
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Clinical Notes & Digital Prescription *</label>
                      <textarea 
                        rows="3"
                        value={prescriptionText}
                        onChange={(e) => setPrescriptionText(e.target.value)}
                        placeholder="E.g., Paracetamol 650mg 1-0-1 for 3 days, adequate hydration..."
                        className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 font-medium"
                        required
                      />
                    </div>

                    <button type="submit" disabled={saving} className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white py-3 rounded-xl font-bold shadow-md transition-transform active:scale-95 text-xs">
                      {saving ? 'Saving...' : 'Sign Prescription & Complete Consultation 🚀'}
                    </button>

                    {successMsg && (
                      <p className="text-emerald-600 font-bold text-center text-xs mt-2">✓ Consultation closed, prescription signed, and synced to patient profile!</p>
                    )}
                  </form>
                </div>
              ) : (
                <div className="py-24 text-center text-gray-400 text-xs">
                  Select a pending case from the left to start consultation.
                </div>
              )}
            </div>

          </div>
        </>
      )}
    </div>
  );
}