import React, { useState } from 'react';
import useVoiceAlerts from '../hooks/useVoiceAlerts';

const STATUS_STYLE = {
  Stable: 'bg-emerald-50 text-emerald-700',
  Critical: 'bg-red-50 text-red-700',
  Improving: 'bg-blue-50 text-blue-700',
};

const ALARM_STYLE = {
  critical: 'border-red-400 ring-2 ring-red-200',
  urgent: 'border-amber-400 ring-2 ring-amber-200',
};

export default function PatientDossiersTab({ patients, setPatients, doctors }) {
  const [form, setForm] = useState({ name: '', age: '', bed: '', diagnosis: '', doctor: '' });
  const { getAlertsForPatient, ackAlert } = useVoiceAlerts();

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function registerPatient(e) {
    e.preventDefault();
    if (!form.name || !form.age || !form.bed || !form.diagnosis || !form.doctor) return;

    // TODO: connect to backend — POST new patient to /api/hospital/patients
    const newPatient = {
      id: Date.now(),
      name: form.name,
      age: Number(form.age),
      bed: form.bed,
      diagnosis: form.diagnosis,
      doctor: form.doctor,
      status: 'Stable',
    };
    setPatients([newPatient, ...patients]);
    setForm({ name: '', age: '', bed: '', diagnosis: '', doctor: '' });
  }

  return (
    <div className="grid lg:grid-cols-[360px_1fr] gap-6">
      {/* Register form */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 h-fit">
        <h3 className="text-sm font-extrabold text-gray-800 mb-4">Register New Patient</h3>
        <form onSubmit={registerPatient} className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">Full Name</label>
            <input
              value={form.name}
              onChange={(e) => update('name', e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Age</label>
              <input
                type="number"
                min="0"
                value={form.age}
                onChange={(e) => update('age', e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Bed / Room</label>
              <input
                value={form.bed}
                onChange={(e) => update('bed', e.target.value)}
                placeholder="Ward B-12"
                className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">Diagnosis / Condition</label>
            <textarea
              value={form.diagnosis}
              onChange={(e) => update('diagnosis', e.target.value)}
              rows={2}
              className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">Attending Doctor</label>
            <select
              value={form.doctor}
              onChange={(e) => update('doctor', e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
            >
              <option value="">— Assign doctor —</option>
              {doctors.map((d) => (
                <option key={d.id} value={d.name}>
                  {d.name} · {d.specialty}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-emerald-800 hover:bg-emerald-900 text-white text-sm font-bold py-2.5 rounded-xl transition-all active:scale-95 mt-2"
          >
            Admit Patient
          </button>
        </form>
      </div>

      {/* Active patients list */}
      <div>
        <h3 className="text-sm font-extrabold text-gray-800 mb-4">
          Active Patients <span className="text-gray-400 font-medium">({patients.length})</span>
        </h3>
        <div className="grid sm:grid-cols-2 gap-4">
          {patients.map((p) => {
            const patientAlerts = getAlertsForPatient(p.id);
            const topAlert = patientAlerts.find((a) => a.severity === 'critical') || patientAlerts[0] || null;

            return (
              <div
                key={p.id}
                className={`bg-white rounded-2xl shadow-sm border p-4 transition-all ${
                  topAlert ? ALARM_STYLE[topAlert.severity] || 'border-gray-100' : 'border-gray-100'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="font-bold text-gray-800 text-sm flex items-center gap-1.5">
                      {p.name}
                      {topAlert && (
                        <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded-full animate-pulse ${
                          topAlert.severity === 'critical' ? 'bg-red-600 text-white' : 'bg-amber-500 text-white'
                        }`}>
                          🚨 {topAlert.severity}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500">
                      {p.age} yrs · {p.bed}
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${STATUS_STYLE[p.status] || 'bg-gray-100 text-gray-600'}`}>
                    {p.status}
                  </span>
                </div>
                <div className="text-xs text-gray-600 mb-2">{p.diagnosis}</div>
                <div className="text-[11px] text-gray-400">Attending: {p.doctor}</div>

                {topAlert && (
                  <div className={`mt-3 rounded-lg p-2.5 text-[11px] ${
                    topAlert.severity === 'critical' ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-800'
                  }`}>
                    <p className="font-bold mb-0.5">Voice alarm: {topAlert.note || topAlert.label}</p>
                    <p className="italic text-[10.5px] opacity-80">"{topAlert.transcript}"</p>
                    <button
                      onClick={() => ackAlert(topAlert.id)}
                      className="mt-1.5 text-[10.5px] font-bold underline underline-offset-2"
                    >
                      Acknowledge
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}