import React, { useState } from 'react';

const SUB_FEATURES = [
  { id: 'emr', icon: '🧠', label: 'Clinical Records (AI EMR)' },
  { id: 'rx', icon: '💉', label: 'Rapid Prescription Tool' },
  { id: 'scheduling', icon: '🗓️', label: 'Intelligent Scheduling' },
  { id: 'inventory', icon: '📦', label: 'Smart Inventory' },
];

export default function AIEngineTab({ patients }) {
  const [active, setActive] = useState('emr');

  return (
    <div>
      <h2 className="text-lg font-extrabold text-gray-800 mb-1">⚡ Rural Telemedicine AI Engine</h2>
      <p className="text-sm text-gray-500 mb-4">Core AI-driven clinical and operational tools.</p>

      <div className="flex gap-2 flex-wrap mb-5">
        {SUB_FEATURES.map((f) => (
          <button
            key={f.id}
            onClick={() => setActive(f.id)}
            className={`flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-xl transition-all ${
              active === f.id
                ? 'bg-teal-800 text-white shadow-md'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-teal-300'
            }`}
          >
            <span>{f.icon}</span>
            {f.label}
          </button>
        ))}
      </div>

      {active === 'emr' && <ClinicalRecordsEMR patients={patients} />}
      {active === 'rx' && <RapidPrescriptionTool patients={patients} />}
      {active === 'scheduling' && <IntelligentScheduling />}
      {active === 'inventory' && <SmartInventory />}
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* 1. Clinical Records (AI EMR)                                      */
/* ---------------------------------------------------------------- */
function ClinicalRecordsEMR({ patients }) {
  const [selectedId, setSelectedId] = useState('');
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);

  const patient = patients.find((p) => String(p.id) === String(selectedId));

  async function generateSummary() {
    if (!patient) return;
    setLoading(true);
    setSummary(null);

    // TODO: connect to backend — replace with a real call, e.g.:
    // const res = await fetch(`/api/hospital/ai/emr-summary/${patient.id}`);
    // const data = await res.json();
    // setSummary(data);

    await new Promise((r) => setTimeout(r, 900)); // simulate AI latency
    setSummary({
      riskLevel: patient.status === 'Critical' ? 'Moderate-High' : 'Low',
      chart: [
        `Primary diagnosis: ${patient.diagnosis}`,
        `Current bed/unit: ${patient.bed}`,
        `Attending: ${patient.doctor}`,
      ],
      guidelines: [
        'Monitor vitals every 4 hours; escalate if trend worsens.',
        'Reconcile current medications against known allergies.',
        'Reassess discharge readiness at next ward round.',
      ],
    });
    setLoading(false);
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
      <div className="flex flex-wrap gap-3 items-end mb-4">
        <div className="flex-1 min-w-[220px]">
          <label className="block text-xs font-bold text-gray-600 mb-1">Select Patient</label>
          <select
            value={selectedId}
            onChange={(e) => {
              setSelectedId(e.target.value);
              setSummary(null);
            }}
            className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
          >
            <option value="">— Choose a patient —</option>
            {patients.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} · {p.bed}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={generateSummary}
          disabled={!patient || loading}
          className="bg-teal-800 hover:bg-teal-900 disabled:opacity-50 text-white text-sm font-bold px-4 py-2 rounded-xl transition-all active:scale-95"
        >
          {loading ? 'Generating…' : 'Generate AI Summary'}
        </button>
      </div>

      {summary && (
        <div className="grid sm:grid-cols-3 gap-4 mt-4">
          <div className="sm:col-span-1">
            <div className="text-xs font-bold text-gray-500 mb-1">Risk Level</div>
            <span
              className={`inline-block text-xs font-bold px-3 py-1.5 rounded-full ${
                summary.riskLevel === 'Low'
                  ? 'bg-teal-50 text-teal-700'
                  : 'bg-amber-50 text-amber-700'
              }`}
            >
              {summary.riskLevel}
            </span>
          </div>
          <div className="sm:col-span-1">
            <div className="text-xs font-bold text-gray-500 mb-1">Summary Chart</div>
            <ul className="text-xs text-gray-700 space-y-1 list-disc list-inside">
              {summary.chart.map((line, i) => (
                <li key={i}>{line}</li>
              ))}
            </ul>
          </div>
          <div className="sm:col-span-1">
            <div className="text-xs font-bold text-gray-500 mb-1">Clinical Guidelines</div>
            <ul className="text-xs text-gray-700 space-y-1 list-disc list-inside">
              {summary.guidelines.map((line, i) => (
                <li key={i}>{line}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* 2. Rapid Prescription Tool                                        */
/* ---------------------------------------------------------------- */
function RapidPrescriptionTool({ patients }) {
  const [patientId, setPatientId] = useState('');
  const [drugInput, setDrugInput] = useState('');
  const [drugs, setDrugs] = useState([]);
  const [dispatched, setDispatched] = useState(false);

  function addDrug() {
    if (!drugInput.trim()) return;
    setDrugs([...drugs, drugInput.trim()]);
    setDrugInput('');
  }

  async function dispatchToPharmacy() {
    // TODO: connect to backend — POST { patientId, drugs } to your
    // pharmacy dispatch endpoint, e.g. /api/hospital/prescriptions
    await new Promise((r) => setTimeout(r, 400));
    setDispatched(true);
    setTimeout(() => setDispatched(false), 3000);
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
      <div className="grid sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-xs font-bold text-gray-600 mb-1">Patient</label>
          <select
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
          >
            <option value="">— Choose a patient —</option>
            {patients.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} · {p.bed}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-600 mb-1">Add Drug</label>
          <div className="flex gap-2">
            <input
              value={drugInput}
              onChange={(e) => setDrugInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addDrug()}
              placeholder="e.g. Amoxicillin 500mg TID"
              className="flex-1 px-3 py-2 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
            />
            <button
              onClick={addDrug}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-bold px-3 rounded-xl"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {drugs.length > 0 && (
        <ul className="mb-4 space-y-1.5">
          {drugs.map((d, i) => (
            <li
              key={i}
              className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2 text-sm text-gray-700"
            >
              {d}
              <button
                onClick={() => setDrugs(drugs.filter((_, idx) => idx !== i))}
                className="text-gray-400 hover:text-red-600 text-xs"
              >
                remove
              </button>
            </li>
          ))}
        </ul>
      )}

      <button
        onClick={dispatchToPharmacy}
        disabled={!patientId || drugs.length === 0}
        className="bg-teal-800 hover:bg-teal-900 disabled:opacity-50 text-white text-sm font-bold px-4 py-2 rounded-xl transition-all active:scale-95"
      >
        Dispatch to Pharmacy
      </button>

      {dispatched && (
        <div className="mt-3 text-sm text-teal-700 bg-teal-50 border border-teal-200 rounded-xl px-3 py-2">
          ✅ Prescription dispatched to pharmacy in under 30 seconds.
        </div>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* 3. Intelligent Scheduling (OT & Wards)                            */
/* ---------------------------------------------------------------- */
const OT_SUITES = ['Cardiac', 'General Surgery', 'Emergency Trauma'];

function IntelligentScheduling() {
  const [suite, setSuite] = useState(OT_SUITES[0]);
  const [surgeon, setSurgeon] = useState('');
  const [time, setTime] = useState('');
  const [bookings, setBookings] = useState([]);

  function lockSlot() {
    if (!surgeon || !time) return;
    // TODO: connect to backend — POST booking to /api/hospital/ot-schedule
    setBookings([...bookings, { suite, surgeon, time, id: Date.now() }]);
    setSurgeon('');
    setTime('');
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
      <div className="grid sm:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-xs font-bold text-gray-600 mb-1">Theater Suite</label>
          <select
            value={suite}
            onChange={(e) => setSuite(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
          >
            {OT_SUITES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-600 mb-1">Lead Surgeon</label>
          <input
            value={surgeon}
            onChange={(e) => setSurgeon(e.target.value)}
            placeholder="Dr. Name"
            className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-600 mb-1">Time Slot</label>
          <input
            type="datetime-local"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
          />
        </div>
      </div>

      <button
        onClick={lockSlot}
        disabled={!surgeon || !time}
        className="bg-teal-800 hover:bg-teal-900 disabled:opacity-50 text-white text-sm font-bold px-4 py-2 rounded-xl transition-all active:scale-95"
      >
        Lock Slot & Auto-Prep Nursing Station
      </button>

      {bookings.length > 0 && (
        <div className="mt-5 space-y-2">
          {bookings.map((b) => (
            <div
              key={b.id}
              className="flex flex-wrap items-center justify-between gap-2 bg-gray-50 rounded-xl px-4 py-3 text-sm"
            >
              <div>
                <span className="font-bold text-gray-800">{b.suite}</span>
                <span className="text-gray-500"> · {b.surgeon}</span>
              </div>
              <div className="text-xs text-gray-500">{new Date(b.time).toLocaleString()}</div>
              <span className="text-[10px] font-bold bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full">
                Nursing prep automated
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* 4. Smart Inventory & Auto-Reordering                              */
/* ---------------------------------------------------------------- */
// TODO: connect to backend — replace with a real inventory fetch
const INVENTORY_ITEMS = [
  { name: 'Amoxicillin 500mg', stock: 420, status: 'Optimal' },
  { name: 'IV Saline 0.9% (1L)', stock: 38, status: 'Auto-Reordering Triggered' },
  { name: 'Surgical Gloves (M)', stock: 12, status: 'Low Stock Alert' },
  { name: 'Insulin (Rapid-Acting)', stock: 96, status: 'Optimal' },
  { name: 'N95 Masks', stock: 20, status: 'Auto-Reordering Triggered' },
];

const STATUS_STYLE = {
  Optimal: 'bg-teal-50 text-teal-700',
  'Auto-Reordering Triggered': 'bg-blue-50 text-blue-700',
  'Low Stock Alert': 'bg-red-50 text-red-700',
};

function SmartInventory() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold">
          <tr>
            <th className="text-left px-5 py-3">Item</th>
            <th className="text-left px-5 py-3">Stock</th>
            <th className="text-left px-5 py-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {INVENTORY_ITEMS.map((item) => (
            <tr key={item.name} className="border-t border-gray-100">
              <td className="px-5 py-3 font-medium text-gray-800">{item.name}</td>
              <td className="px-5 py-3 text-gray-600">{item.stock} units</td>
              <td className="px-5 py-3">
                <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${STATUS_STYLE[item.status]}`}>
                  {item.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}