import React, { useState } from 'react';

export default function AdminAnalyticsDashboard({ setCurrentPage }) {
  const [metrics] = useState({
    totalConsultationsToday: 142,
    activeDoctorsOnline: 8,
    emergencyDispatches: 3,
    avgWaitTime: '11 mins',
    ruralCentersActive: 5
  });

  const [regionalHubs] = useState([
    { id: 1, name: 'Bolpur Rural Health Centre', doctors: 3, load: 'High (85%)', status: 'Optimal' },
    { id: 2, name: 'Sub-Divisional Hospital Ward 2', doctors: 2, load: 'Moderate (60%)', status: 'Stable' },
    { id: 3, name: 'Burdwan Medical College Annex', doctors: 3, load: 'Normal (40%)', status: 'Optimal' }
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6 animate-fade-in font-sans">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-900 to-emerald-900 text-white p-6 rounded-3xl shadow-xl flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-black flex items-center gap-2">
            <span>📊</span> Admin Analytics & Rural Health Camp Metrics
          </h1>
          <p className="text-emerald-100 text-sm mt-1">
            District-wide overview of telemedicine consultations, active doctor load, and rural sub-center responsiveness.
          </p>
        </div>
        <button 
          onClick={() => setCurrentPage('dashboard')}
          className="bg-white text-slate-900 px-4 py-2 rounded-xl font-bold hover:bg-emerald-50 transition-all shadow cursor-pointer whitespace-nowrap"
        >
          ← Back to Dashboard
        </button>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-3xl shadow-md border border-gray-100 space-y-1">
          <p className="text-[10px] font-black text-emerald-800 uppercase tracking-wider">Consultations Today</p>
          <p className="text-2xl font-black text-gray-900">{metrics.totalConsultationsToday}</p>
          <p className="text-[11px] text-emerald-600 font-bold">+18% vs yesterday</p>
        </div>

        <div className="bg-white p-5 rounded-3xl shadow-md border border-gray-100 space-y-1">
          <p className="text-[10px] font-black text-teal-800 uppercase tracking-wider">Doctors Online</p>
          <p className="text-2xl font-black text-gray-900">{metrics.activeDoctorsOnline}</p>
          <p className="text-[11px] text-teal-600 font-bold">All hubs fully staffed</p>
        </div>

        <div className="bg-white p-5 rounded-3xl shadow-md border border-gray-100 space-y-1">
          <p className="text-[10px] font-black text-red-800 uppercase tracking-wider">Emergency Dispatches</p>
          <p className="text-2xl font-black text-gray-900">{metrics.emergencyDispatches}</p>
          <p className="text-[11px] text-red-600 font-bold">Ambulance units deployed</p>
        </div>

        <div className="bg-white p-5 rounded-3xl shadow-md border border-gray-100 space-y-1">
          <p className="text-[10px] font-black text-amber-800 uppercase tracking-wider">Average Wait Time</p>
          <p className="text-2xl font-black text-gray-900">{metrics.avgWaitTime}</p>
          <p className="text-[11px] text-amber-600 font-bold">Optimized queue routing</p>
        </div>

        <div className="bg-white p-5 rounded-3xl shadow-md border border-gray-100 space-y-1">
          <p className="text-[10px] font-black text-indigo-800 uppercase tracking-wider">Rural Hubs Active</p>
          <p className="text-2xl font-black text-gray-900">{metrics.ruralCentersActive}</p>
          <p className="text-[11px] text-indigo-600 font-bold">Connected via secure nodes</p>
        </div>
      </div>

      {/* Regional Hubs Breakdown */}
      <div className="bg-white rounded-3xl p-6 shadow-md border border-gray-100 space-y-4">
        <div className="flex justify-between items-center border-b border-gray-100 pb-3">
          <h2 className="font-black text-gray-900 text-base">Regional Rural Health Sub-Centres</h2>
          <span className="bg-emerald-100 text-emerald-900 text-xs font-black px-3 py-1 rounded-full">
            Live Database Sync Active
          </span>
        </div>

        <div className="space-y-3">
          {regionalHubs.map((hub) => (
            <div 
              key={hub.id}
              className="bg-gray-50 border border-gray-200/80 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-black text-gray-900 text-sm">{hub.name}</span>
                  <span className="bg-teal-100 text-teal-800 text-[10px] font-black px-2.5 py-0.5 rounded-md">
                    {hub.doctors} Doctors on Duty
                  </span>
                </div>
                <p className="text-xs text-gray-600 font-medium">Queue Load Status: {hub.load}</p>
              </div>

              <span className="bg-emerald-100 text-emerald-900 text-[11px] font-black px-3 py-1 rounded-full">
                {hub.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}