import React from 'react';

// TODO: connect to backend — replace with a real inventory summary fetch
const INVENTORY_SUMMARY = {
  totalItems: 214,
  autoReorderTriggered: 6,
  lowStock: 3,
};

function StatCard({ icon, label, value, sub, accent }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-2xl">{icon}</span>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${accent}`}>{sub}</span>
      </div>
      <div className="text-2xl font-extrabold text-gray-800">{value}</div>
      <div className="text-xs text-gray-500 mt-1">{label}</div>
    </div>
  );
}

export default function OverviewTab({ patients, doctors, aiEngineOnline }) {
  const onDutyCount = doctors.filter((d) => d.status !== 'Off Duty').length;

  return (
    <div>
      <h2 className="text-lg font-extrabold text-gray-800 mb-4">Hospital Overview</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon="🛏️"
          label="Active Patients (admitted)"
          value={patients.length}
          sub="Live"
          accent="bg-blue-50 text-blue-700"
        />
        <StatCard
          icon="👨‍⚕️"
          label="Physicians On Duty"
          value={onDutyCount}
          sub={`of ${doctors.length} total`}
          accent="bg-emerald-50 text-emerald-700"
        />
        <StatCard
          icon="💊"
          label="Inventory Items Tracked"
          value={INVENTORY_SUMMARY.totalItems}
          sub={`${INVENTORY_SUMMARY.autoReorderTriggered} auto-reordering`}
          accent="bg-amber-50 text-amber-700"
        />
        <StatCard
          icon={aiEngineOnline ? '✅' : '⚠️'}
          label="MedoNext EMR & Scheduling"
          value={aiEngineOnline ? 'Operational' : 'Degraded'}
          sub={aiEngineOnline ? 'All systems go' : 'Check status'}
          accent={aiEngineOnline ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}
        />
      </div>

      {INVENTORY_SUMMARY.lowStock > 0 && (
        <div className="mt-5 bg-amber-50 border border-amber-200 text-amber-800 text-sm rounded-xl px-4 py-3 flex items-center gap-2">
          <span>⚠️</span>
          {INVENTORY_SUMMARY.lowStock} item(s) are at low stock — check the Smart Inventory panel in the AI Engine tab.
        </div>
      )}
    </div>
  );
}