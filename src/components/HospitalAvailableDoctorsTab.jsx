import React, { useState } from 'react';
import useVoiceAlerts from '../hooks/useVoiceAlerts';

/**
 * Hospital Portal — Available Doctors tab
 * ------------------------------------------------
 * Directory of on-staff physicians: specialty, shift, room, live status,
 * plus an "Add Doctor" form so new hires show up immediately (mock data,
 * same pattern as PatientDossiersTab's register form).
 *
 * Doctors whose patient has an active voice-triage alarm get a pulsing
 * badge here too, via useVoiceAlerts — so it's visible whose patient
 * needs them without switching to Voice Alarm or Patient Dossiers.
 *
 * USAGE (already wired into HospitalPortal.jsx):
 *   <AvailableDoctorsTab doctors={doctors} setDoctors={setDoctors} />
 */

const STATUS_STYLE = {
  'On Duty': 'bg-emerald-50 text-emerald-700',
  Available: 'bg-blue-50 text-blue-700',
  'In Surgery': 'bg-purple-50 text-purple-700',
  Off_Duty: 'bg-gray-100 text-gray-500',
};

const SPECIALTIES = [
  'Internal Medicine', 'Cardiology', 'Pediatrics', 'Orthopedics',
  'Neurology', 'General Surgery', 'Obstetrics & Gynecology', 'Emergency Medicine',
];

export default function AvailableDoctorsTab({ doctors, setDoctors }) {
  const [form, setForm] = useState({ name: '', specialty: '', shift: '', room: '' });
  const { getAlertsForDoctor, ackAlert } = useVoiceAlerts();

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function registerDoctor(e) {
    e.preventDefault();
    if (!form.name || !form.specialty || !form.shift || !form.room) return;

    // TODO: connect to backend — POST new doctor to /api/hospital/doctors
    const newDoctor = {
      id: Date.now(),
      name: form.name.startsWith('Dr.') ? form.name : `Dr. ${form.name}`,
      specialty: form.specialty,
      shift: form.shift,
      room: form.room,
      status: 'Available',
    };
    setDoctors([newDoctor, ...doctors]);
    setForm({ name: '', specialty: '', shift: '', room: '' });
  }

  function cycleStatus(id) {
    // TODO: connect to backend — PATCH /api/hospital/doctors/:id status
    const order = ['On Duty', 'Available', 'In Surgery', 'Off_Duty'];
    setDoctors((prev) =>
      prev.map((d) => {
        if (d.id !== id) return d;
        const next = order[(order.indexOf(d.status) + 1) % order.length];
        return { ...d, status: next };
      })
    );
  }

  return (
    <div className="grid lg:grid-cols-[340px_1fr] gap-6">
      {/* Add doctor form */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 h-fit">
        <h3 className="text-sm font-extrabold text-gray-800 mb-4">Add Doctor</h3>
        <form onSubmit={registerDoctor} className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">Full Name</label>
            <input
              value={form.name}
              onChange={(e) => update('name', e.target.value)}
              placeholder="Dr. Meera Kapoor"
              className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">Specialty</label>
            <select
              value={form.specialty}
              onChange={(e) => update('specialty', e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
            >
              <option value="">— Select specialty —</option>
              {SPECIALTIES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Shift</label>
              <input
                value={form.shift}
                onChange={(e) => update('shift', e.target.value)}
                placeholder="9:00 AM – 5:00 PM"
                className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Room</label>
              <input
                value={form.room}
                onChange={(e) => update('room', e.target.value)}
                placeholder="OPD-3"
                className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-emerald-800 hover:bg-emerald-900 text-white text-sm font-bold py-2.5 rounded-xl transition-all active:scale-95 mt-2"
          >
            Add to Roster
          </button>
        </form>
      </div>

      {/* Doctor directory */}
      <div>
        <h3 className="text-sm font-extrabold text-gray-800 mb-4">
          On Staff <span className="text-gray-400 font-medium">({doctors.length})</span>
        </h3>
        <div className="grid sm:grid-cols-2 gap-4">
          {doctors.map((d) => {
            const doctorAlerts = getAlertsForDoctor(d.name);
            const topAlert = doctorAlerts.find((a) => a.severity === 'critical') || doctorAlerts[0] || null;

            return (
              <div
                key={d.id}
                className={`bg-white rounded-2xl shadow-sm border p-4 transition-all ${
                  topAlert
                    ? topAlert.severity === 'critical'
                      ? 'border-red-400 ring-2 ring-red-200'
                      : 'border-amber-400 ring-2 ring-amber-200'
                    : 'border-gray-100'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="font-bold text-gray-800 text-sm flex items-center gap-1.5">
                      {d.name}
                      {topAlert && (
                        <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded-full animate-pulse ${
                          topAlert.severity === 'critical' ? 'bg-red-600 text-white' : 'bg-amber-500 text-white'
                        }`}>
                          🚨 patient alarm
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500">{d.specialty}</div>
                  </div>
                  <button
                    onClick={() => cycleStatus(d.id)}
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${STATUS_STYLE[d.status] || 'bg-gray-100 text-gray-600'}`}
                    title="Click to update status"
                  >
                    {d.status.replace('_', ' ')}
                  </button>
                </div>
                <div className="text-xs text-gray-600">{d.shift}</div>
                <div className="text-[11px] text-gray-400">Room: {d.room}</div>

                {topAlert && (
                  <div className={`mt-3 rounded-lg p-2.5 text-[11px] ${
                    topAlert.severity === 'critical' ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-800'
                  }`}>
                    <p className="font-bold mb-0.5">{topAlert.patientName} ({topAlert.bed}): {topAlert.note || topAlert.label}</p>
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