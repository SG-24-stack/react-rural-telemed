import React, { useState } from 'react';
import DoctorPortalBackground from '../components/DoctorPortalBackground';

export default function DoctorPatientQueue({ setCurrentPage }) {
  // Sample state for the doctor's patient queue
  const [queue, setQueue] = useState([
    {
      id: '#P-1042',
      name: 'Amit Roy',
      age: 42,
      gender: 'Male',
      condition: 'Sudden BP Spike & Dizziness',
      priority: 'Emergency',
      appointmentTime: '11:00 AM (Live)',
      status: 'Waiting',
    },
    {
      id: '#P-1045',
      name: 'Sunita Devi',
      age: 58,
      gender: 'Female',
      condition: 'Diabetes Follow-up & Medication Review',
      priority: 'Routine',
      appointmentTime: '11:30 AM',
      status: 'Waiting',
    },
    {
      id: '#P-1048',
      name: 'Rahul Sen',
      age: 29,
      gender: 'Male',
      condition: 'Post-Op Knee Checkup',
      priority: 'Routine',
      appointmentTime: '12:00 PM',
      status: 'Waiting',
    },
    {
      id: '#P-1039',
      name: 'Priya Mukherjee',
      age: 34,
      gender: 'Female',
      condition: 'Persistent Cough & Fever',
      priority: 'Urgent',
      appointmentTime: '10:30 AM',
      status: 'Completed',
    },
  ]);

  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Handle status update (e.g., mark as in-consultation or completed)
  const handleStatusChange = (id, newStatus) => {
    setQueue(prevQueue =>
      prevQueue.map(patient =>
        patient.id === id ? { ...patient, status: newStatus } : patient
      )
    );
  };

  // Filter logic
  const filteredQueue = queue.filter(patient => {
    const matchesFilter = filter === 'All' || patient.status === filter || patient.priority === filter;
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          patient.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          patient.condition.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <DoctorPortalBackground>
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Top Navigation & Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <button 
            onClick={() => setCurrentPage('doctor-dashboard')}
            className="text-sm text-emerald-600 font-medium hover:underline mb-1 inline-block"
          >
            &larr; Back to Doctor Command Portal
          </button>
          <h1 className="text-2xl font-bold text-slate-800">Live Patient Queue & Appointments</h1>
          <p className="text-slate-600 text-sm">Manage incoming walk-ins, scheduled teleconsultations, and emergency cases in real-time.</p>
        </div>

        <div className="flex items-center gap-3">
          <span className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-3 py-1.5 rounded-full">
            {queue.filter(p => p.status === 'Waiting').length} Patients Waiting
          </span>
        </div>
      </div>

      {/* Control Bar: Search & Status Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="w-full md:w-96">
          <input
            type="text"
            placeholder="Search by patient name, ID, or symptom..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-slate-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          {['All', 'Waiting', 'Emergency', 'Urgent', 'Completed'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                filter === tab 
                  ? 'bg-emerald-600 text-white shadow' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Patient Queue Table / Cards Grid */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {filteredQueue.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            No patients match your current filter criteria.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredQueue.map((patient) => (
              <div 
                key={patient.id} 
                className={`p-5 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 transition hover:bg-slate-50 ${
                  patient.priority === 'Emergency' ? 'bg-red-50/40 border-l-4 border-red-500' : ''
                }`}
              >
                {/* Patient Info */}
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-slate-900 text-base">{patient.name}</span>
                    <span className="text-xs text-slate-500 font-medium">({patient.id})</span>
                    <span className="text-xs text-slate-600">{patient.age} yrs / {patient.gender}</span>
                    
                    {/* Priority Badge */}
                    <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full ${
                      patient.priority === 'Emergency' ? 'bg-red-100 text-red-700 border border-red-200' :
                      patient.priority === 'Urgent' ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {patient.priority}
                    </span>
                  </div>

                  <p className="text-sm font-medium text-slate-700">Complaint: <span className="font-normal text-slate-600">{patient.condition}</span></p>
                  <p className="text-xs text-slate-400">Scheduled: {patient.appointmentTime}</p>
                </div>

                {/* Status & Action Buttons */}
                <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-end">
                  {/* Status Dropdown/Badge */}
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                    patient.status === 'Waiting' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                    patient.status === 'In-Consultation' ? 'bg-purple-50 text-purple-700 border border-purple-200' :
                    'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}>
                    {patient.status}
                  </span>

                  {/* Actions */}
                  {patient.status === 'Waiting' && (
                    <button
                      onClick={() => handleStatusChange(patient.id, 'In-Consultation')}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium px-4 py-2 rounded-lg transition"
                    >
                      Call In / Start Consultation
                    </button>
                  )}

                  {patient.status === 'In-Consultation' && (
                    <button
                      onClick={() => setCurrentPage('consultation-room')}
                      className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-medium px-4 py-2 rounded-lg transition animate-pulse"
                    >
                      Open Video Room &rarr;
                    </button>
                  )}

                  <button
                    onClick={() => setCurrentPage('doctor-patient-history')}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium px-3 py-2 rounded-lg transition"
                  >
                    View History
                  </button>

                  {patient.status !== 'Completed' && (
                    <button
                      onClick={() => handleStatusChange(patient.id, 'Completed')}
                      className="text-slate-400 hover:text-emerald-600 text-xs font-medium px-2 py-1 transition"
                      title="Mark as Done"
                    >
                      ✓ Done
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
    </DoctorPortalBackground>
  );
}