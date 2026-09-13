import React, { useState } from 'react';
import DoctorPortalBackground from '../components/DoctorPortalBackground';

export default function DoctorPatientHistory({ setCurrentPage }) {
  // Sample patient search and record database
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatient, setSelectedPatient] = useState({
    id: '#P-1042',
    name: 'Amit Roy',
    age: 42,
    gender: 'Male',
    bloodGroup: 'B+',
    contact: '+91 98765 43210',
    emergencyContact: 'Sunita Roy (+91 98765 43211)',
    allergies: 'Penicillin, Shellfish',
    chronicConditions: 'Hypertension, Type-2 Diabetes',
    vitalsHistory: [
      { date: '28 Aug 2026', bp: '142/90 mmHg', sugar: '140 mg/dL', hr: '82 bpm', status: 'Elevated' },
      { date: '15 Jul 2026', bp: '130/85 mmHg', sugar: '126 mg/dL', hr: '78 bpm', status: 'Stable' },
      { date: '02 Jun 2026', bp: '125/80 mmHg', sugar: '118 mg/dL', hr: '75 bpm', status: 'Normal' },
    ],
    pastConsultations: [
      {
        date: '28 Aug 2026',
        doctor: 'Dr. Subhankar Chatterjee',
        diagnosis: 'Mild hypertensive urgency triggered by dietary salt intake.',
        prescription: 'Amlodipine 5mg (1-0-0), Telmisartan 40mg (0-0-1)',
        notes: 'Advised regular home BP monitoring for 7 days.',
      },
      {
        date: '15 Jul 2026',
        doctor: 'Dr. Ananya Sengupta',
        diagnosis: 'Routine diabetes quarterly review.',
        prescription: 'Metformin 500mg (1-0-1)',
        notes: 'HbA1c levels well-controlled at 6.8%.',
      },
    ],
  });

  // Mock search results list for lookups
  const patientDirectory = [
    { id: '#P-1042', name: 'Amit Roy', condition: 'Hypertension & Diabetes' },
    { id: '#P-1045', name: 'Sunita Devi', condition: 'Type-2 Diabetes Follow-up' },
    { id: '#P-1048', name: 'Rahul Sen', condition: 'Post-Op Knee Recovery' },
    { id: '#P-1039', name: 'Priya Mukherjee', condition: 'Acute Bronchitis' },
  ];

  const filteredPatients = patientDirectory.filter(
    p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DoctorPortalBackground>
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Top Header & Navigation */}
      <div className="mb-6">
        <button 
          onClick={() => setCurrentPage('doctor-dashboard')}
          className="text-sm text-emerald-600 font-medium hover:underline mb-1 inline-block"
        >
          &larr; Back to Doctor Command Portal
        </button>
        <h1 className="text-2xl font-bold text-slate-800">Patient Electronic Health Records (EHR) & History</h1>
        <p className="text-slate-600 text-sm">Access comprehensive past clinical histories, lab reports, vital trends, and old prescriptions.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Patient Search & Directory */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 flex flex-col h-[600px]">
          <h2 className="font-semibold text-slate-800 mb-3 text-base">Select Patient</h2>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search patient name or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {filteredPatients.map((patient) => (
              <div
                key={patient.id}
                onClick={() => {
                  setSelectedPatient(prev => ({ ...prev, name: patient.name, id: patient.id }));
                }}
                className={`p-3 rounded-lg border transition cursor-pointer ${
                  selectedPatient.id === patient.id 
                    ? 'border-emerald-500 bg-emerald-50/50 shadow-sm' 
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-slate-800 text-sm">{patient.name}</span>
                  <span className="text-xs text-slate-500">{patient.id}</span>
                </div>
                <p className="text-xs text-slate-600 mt-1">{patient.condition}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Detailed EHR View */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Patient Overview Card */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-4 border-b border-slate-100 gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold text-slate-900">{selectedPatient.name}</h2>
                  <span className="text-xs font-semibold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full">{selectedPatient.id}</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">{selectedPatient.age} yrs old • {selectedPatient.gender} • Blood Group: <span className="font-semibold text-slate-700">{selectedPatient.bloodGroup}</span></p>
              </div>

              <button
                onClick={() => setCurrentPage('consultation-room')}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium px-4 py-2 rounded-lg transition shadow-sm"
              >
                Start Consultation Session &rarr;
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-sm">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                <span className="text-xs font-semibold text-red-600 uppercase tracking-wider block mb-1">Known Allergies</span>
                <span className="text-slate-700 font-medium">{selectedPatient.allergies}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                <span className="text-xs font-semibold text-amber-600 uppercase tracking-wider block mb-1">Chronic Conditions</span>
                <span className="text-slate-700 font-medium">{selectedPatient.chronicConditions}</span>
              </div>
            </div>
          </div>

          {/* Vitals History Timeline */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <h3 className="font-bold text-slate-800 mb-4 text-base">Recorded Vitals History</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 text-slate-700 uppercase text-[11px] font-semibold">
                  <tr>
                    <th className="p-3">Date</th>
                    <th className="p-3">Blood Pressure</th>
                    <th className="p-3">Blood Sugar</th>
                    <th className="p-3">Heart Rate</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {selectedPatient.vitalsHistory.map((vital, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="p-3 font-medium text-slate-900">{vital.date}</td>
                      <td className="p-3">{vital.bp}</td>
                      <td className="p-3">{vital.sugar}</td>
                      <td className="p-3">{vital.hr}</td>
                      <td className="p-3">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          vital.status === 'Elevated' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {vital.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Past Consultations & Case Notes */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <h3 className="font-bold text-slate-800 mb-4 text-base">Past Consultation Case Notes</h3>
            <div className="space-y-4">
              {selectedPatient.pastConsultations.map((consult, idx) => (
                <div key={idx} className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-slate-800 text-sm">{consult.doctor}</span>
                    <span className="text-xs text-slate-500">{consult.date}</span>
                  </div>
                  <p className="text-xs text-slate-600 mb-1"><strong className="text-slate-700">Diagnosis:</strong> {consult.diagnosis}</p>
                  <p className="text-xs text-slate-600 mb-2"><strong className="text-slate-700">Prescription:</strong> {consult.prescription}</p>
                  <div className="bg-white p-2.5 rounded border border-slate-200 text-xs text-slate-600">
                    <em>Notes: {consult.notes}</em>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
    </DoctorPortalBackground>
  );
}