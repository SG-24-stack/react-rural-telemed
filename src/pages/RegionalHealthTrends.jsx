import React, { useState } from 'react';
import DoctorPortalBackground from '../components/DoctorPortalBackground';

export default function RegionalHealthTrends({ setCurrentPage }) {
  const [selectedRegion, setSelectedRegion] = useState('South Kolkata');
  const [timeframe, setTimeframe] = useState('This Month');

  // Regional health data metrics
  const regionsData = {
    'South Kolkata': {
      riskLevel: 'Moderate',
      dominantIssue: 'Viral Fever & Seasonal Allergies',
      activeCases: 342,
      trendPercentage: '+12% vs last month',
      outbreakChart: [
        { week: 'W1', cases: 80 },
        { week: 'W2', cases: 95 },
        { week: 'W3', cases: 110 },
        { week: 'W4', cases: 142 },
      ],
      recommendations: [
        'Advise hydration and proactive screening for persistent low-grade fevers.',
        'Monitor elderly patients with chronic respiratory conditions.',
      ],
    },
    'Central Kolkata': {
      riskLevel: 'High',
      dominantIssue: 'Waterborne / Gastrointestinal Infections',
      activeCases: 512,
      trendPercentage: '+28% vs last month',
      outbreakChart: [
        { week: 'W1', cases: 100 },
        { week: 'W2', cases: 130 },
        { week: 'W3', cases: 155 },
        { week: 'W4', cases: 210 },
      ],
      recommendations: [
        'Issue community alerts regarding water boiling advisories.',
        'Stock up oral rehydration salts and anti-emetics in local clinics.',
      ],
    },
    'Salt Lake & Sector V': {
      riskLevel: 'Low',
      dominantIssue: 'Hypertension & Lifestyle Strain',
      activeCases: 145,
      trendPercentage: '-4% vs last month',
      outbreakChart: [
        { week: 'W1', cases: 45 },
        { week: 'W2', cases: 40 },
        { week: 'W3', cases: 35 },
        { week: 'W4', cases: 30 },
      ],
      recommendations: [
        'Continue regular corporate health checkups and blood pressure screenings.',
      ],
    },
    'Jadavpur & South Suburbs': {
      riskLevel: 'Moderate',
      dominantIssue: 'Vector-Borne (Dengue/Malaria)',
      activeCases: 230,
      trendPercentage: '+5% vs last month',
      outbreakChart: [
        { week: 'W1', cases: 50 },
        { week: 'W2', cases: 60 },
        { week: 'W3', cases: 70 },
        { week: 'W4', cases: 85 },
      ],
      recommendations: [
        'Promote mosquito net usage and stagnant water clearance drives.',
        'Watch out for sudden platelet count drops in recurring fevers.',
      ],
    },
  };

  const currentData = regionsData[selectedRegion];

  return (
    <DoctorPortalBackground>
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Top Header & Navigation */}
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <button 
            onClick={() => setCurrentPage('doctor-dashboard')}
            className="text-sm text-emerald-600 font-medium hover:underline mb-1 inline-block"
          >
            &larr; Back to Doctor Command Portal
          </button>
          <h1 className="text-2xl font-bold text-slate-800">Regional Health Trends & Outbreak Intelligence</h1>
          <p className="text-slate-600 text-sm">Monitor epidemiological shifts, disease spikes, and geographic health risks in real time.</p>
        </div>

        {/* Timeframe Selector */}
        <div className="flex bg-slate-100 p-1 rounded-xl">
          {['This Week', 'This Month', 'Quarterly'].map((t) => (
            <button
              key={t}
              onClick={() => setTimeframe(t)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                timeframe === t ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Region Selector Pills */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {Object.keys(regionsData).map((region) => (
          <div
            key={region}
            onClick={() => setSelectedRegion(region)}
            className={`p-4 rounded-xl border transition cursor-pointer flex flex-col justify-between ${
              selectedRegion === region 
                ? 'bg-emerald-900 text-white border-emerald-900 shadow-md' 
                : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-500'
            }`}
          >
            <span className="text-xs uppercase tracking-wider font-semibold opacity-80">Zone</span>
            <span className="font-bold text-base mt-1">{region}</span>
            <span className={`text-[10px] mt-2 inline-block px-2 py-0.5 rounded font-bold w-max ${
              regionsData[region].riskLevel === 'High' ? 'bg-red-500 text-white' :
              regionsData[region].riskLevel === 'Moderate' ? 'bg-amber-400 text-slate-900' :
              'bg-emerald-500 text-white'
            }`}>
              {regionsData[region].riskLevel} Risk
            </span>
          </div>
        ))}
      </div>

      {/* Main Analytics Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Visual Chart & Summary */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Key Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
              <span className="text-xs text-slate-500 font-semibold uppercase">Primary Concern</span>
              <h3 className="text-base font-bold text-slate-800 mt-1">{currentData.dominantIssue}</h3>
            </div>
            <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
              <span className="text-xs text-slate-500 font-semibold uppercase">Active Cases Tracked</span>
              <h3 className="text-xl font-bold text-emerald-600 mt-1">{currentData.activeCases}</h3>
            </div>
            <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
              <span className="text-xs text-slate-500 font-semibold uppercase">Velocity Trend</span>
              <h3 className="text-base font-bold text-amber-600 mt-1">{currentData.trendPercentage}</h3>
            </div>
          </div>

          {/* Visual Trend Chart Container */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-slate-800 text-base">Outbreak Progression Curve ({selectedRegion})</h3>
              <span className="text-xs text-slate-400">Cases per week</span>
            </div>

            {/* Simulated Bar Chart UI */}
            <div className="h-48 flex items-end justify-between gap-6 pt-6 px-4 border-b border-slate-200 pb-2">
              {currentData.outbreakChart.map((bar, idx) => {
                // Calculate height percentage relative to max scale (approx 250 max)
                const heightPercent = Math.min(Math.round((bar.cases / 250) * 100), 100);
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                    <span className="text-xs font-bold text-emerald-700 opacity-0 group-hover:opacity-100 transition">{bar.cases}</span>
                    <div 
                      style={{ height: `${heightPercent}%` }} 
                      className="w-full bg-emerald-600 rounded-t-lg transition-all duration-500 hover:bg-emerald-500"
                    ></div>
                    <span className="text-xs font-semibold text-slate-600 mt-1">{bar.week}</span>
                  </div>
                );
              })}
            </div>
            <p className="text-xs text-slate-500 mt-4 italic">
              * Chart reflects anonymized teleconsultation diagnostics and symptom-checker telemetry aggregated across the region.
            </p>
          </div>

        </div>

        {/* Right Col: Clinical Recommendations & Action Items */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <h3 className="font-bold text-slate-800 mb-4 text-base">Recommended Clinical Focus</h3>
            <div className="space-y-3">
              {currentData.recommendations.map((rec, idx) => (
                <div key={idx} className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100 text-xs text-slate-700 leading-relaxed flex items-start gap-2.5">
                  <span className="text-emerald-600 font-bold mt-0.5">&bull;</span>
                  <span>{rec}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-900 to-teal-900 rounded-xl p-6 text-white shadow-md">
            <h3 className="font-bold text-base mb-2">Broadcast Advisory</h3>
            <p className="text-xs text-emerald-100 leading-relaxed mb-4">
              Need to publish a public safety notice or update treatment protocols for {selectedRegion}?
            </p>
            <button 
              onClick={() => alert(`Advisory broadcasted successfully for ${selectedRegion}!`)}
              className="w-full bg-white text-emerald-900 hover:bg-emerald-50 py-2.5 rounded-lg text-xs font-bold transition shadow-sm"
            >
              Push Advisory to Patients &rarr;
            </button>
          </div>
        </div>

      </div>
    </div>
    </DoctorPortalBackground>
  );
}