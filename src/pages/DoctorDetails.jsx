import React, { useState } from 'react';

export default function DoctorDetails({ setCurrentPage }) {
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const doctorsList = [
    {
      id: 1,
      name: 'Dr. Subrata Sharma',
      specialization: 'General Physician & Routine Care',
      experience: '12 Years Experience',
      hospital: 'Kandi Sub-Divisional Hospital, WB, India',
      bio: 'Specializes in rural community health, seasonal fever diagnosis, and preventive primary care.',
      timeline: [
        { time: '09:00 AM - 11:00 AM', activity: 'Morning OPD Consultations' },
        { time: '11:30 AM - 01:00 PM', activity: 'Tele-Health Video Calls' },
        { time: '02:00 PM - 04:30 PM', activity: 'Community Health Camp & Checkups' }
      ]
    },
    {
      id: 2,
      name: 'Dr. Rajesh Ghosh',
      specialization: 'Chronic Care & Internal Medicine',
      experience: '15 Years Experience',
      hospital: 'Medical College & Hospital',
      bio: 'Expert in long-term management of hypertension, diabetes, and metabolic disorders.',
      timeline: [
        { time: '10:00 AM - 12:30 PM', activity: 'Chronic Patient Evaluation' },
        { time: '01:30 PM - 03:00 PM', activity: 'Digital Prescription Review' },
        { time: '03:30 PM - 05:30 PM', activity: 'Specialized Consultations' }
      ]
    },
    {
      id: 3,
      name: 'Dr. Ananya Roy',
      specialization: 'Pediatrics & Child Care',
      experience: '9 Years Experience',
      hospital: 'Beldanga Rural Hospital, WB, India',
      bio: 'Focused on pediatric immunization schedules, neonatal development, and childhood illnesses.',
      timeline: [
        { time: '08:30 AM - 11:00 AM', activity: 'Child Immunization Clinic' },
        { time: '11:30 AM - 01:30 PM', activity: 'Rural Tele-Pediatric Support' }
      ]
    }
  ];

  return (
    <div className="p-6 max-w-5xl mx-auto mt-4 space-y-6">
      
      {/* Header */}
      <div className="flex justify-between items-center bg-white p-5 rounded-xl shadow-sm border border-gray-200">
        <div>
          <h2 className="text-2xl font-black text-green-700">👨‍⚕️ Doctor Profile & Timeline Hub</h2>
          <p className="text-sm text-gray-500 font-medium">Explore professional experience, specializations, and daily schedules.</p>
        </div>
        <button 
          onClick={() => setCurrentPage('dashboard')} 
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold px-5 py-2 rounded transition-colors text-sm"
        >
          ← Back to Dashboard
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Column: Doctor Selection Cards */}
        <div className="space-y-3">
          {doctorsList.map((doc) => (
            <div 
              key={doc.id}
              onClick={() => setSelectedDoctor(doc)}
              className={`p-4 rounded-xl border cursor-pointer transition-all shadow-sm ${selectedDoctor?.id === doc.id ? 'bg-green-50 border-green-500 ring-2 ring-green-200' : 'bg-white border-gray-200 hover:border-gray-300'}`}
            >
              <h3 className="font-bold text-gray-900 text-base">{doc.name}</h3>
              <p className="text-xs font-semibold text-green-700 mt-0.5">{doc.specialization}</p>
              <span className="inline-block mt-2 bg-gray-100 text-gray-700 text-[10px] font-bold px-2 py-0.5 rounded">
                ⏱ {doc.experience}
              </span>
            </div>
          ))}
        </div>

        {/* Right Column: Detailed View & Timeline */}
        <div className="md:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          {selectedDoctor ? (
            <div className="space-y-5 animate-fade-in">
              <div>
                <span className="text-xs font-black text-emerald-600 uppercase tracking-wider">{selectedDoctor.experience}</span>
                <h3 className="text-2xl font-black text-gray-900 mt-1">{selectedDoctor.name}</h3>
                <p className="text-sm font-bold text-green-700">{selectedDoctor.specialization}</p>
                <p className="text-xs text-gray-500 mt-1">📍 {selectedDoctor.hospital}</p>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                <p className="text-xs text-gray-700 leading-relaxed font-medium"><strong>About:</strong> {selectedDoctor.bio}</p>
              </div>

              <div>
                <h4 className="text-sm font-bold text-gray-800 mb-3 border-b pb-2">📅 Daily Working Timeline & Availability</h4>
                <div className="space-y-2.5">
                  {selectedDoctor.timeline.map((slot, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-green-50/50 rounded-lg border border-green-100 text-xs">
                      <span className="font-bold text-green-800">⏰ {slot.time}</span>
                      <span className="font-medium text-gray-700">{slot.activity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center py-16">
              <span className="text-4xl mb-2">👈</span>
              <h4 className="font-bold text-gray-700 text-base">Select a doctor from the left</h4>
              <p className="text-xs text-gray-400 mt-1 max-w-xs">Click on any doctor profile to view their experience, hospital background, and schedule timeline.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}