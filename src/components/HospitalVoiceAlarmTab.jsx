import React, { useState, useCallback } from 'react';
import useVoiceAlerts from '../hooks/useVoiceAlerts';

/**
 * Hospital Portal — Voice Alarm tab
 * ------------------------------------------------
 * Bedside "sensor" listens for what an admitted patient says (Web Speech
 * API, or the test phrases when no mic is available), classifies
 * severity, and files the alert against that patient's real record —
 * name, bed, and assigned doctor — via the shared useVoiceAlerts hook.
 * That's what lets Overview, Patient Dossiers, and Available Doctors
 * surface the same alarm for that specific patient/doctor.
 *
 * MOCK AI: `localClassify()` is a keyword stand-in for a real NLP triage
 * call — see the `// TODO: connect to backend` marker.
 *
 * USAGE (already wired into HospitalPortal.jsx):
 *   <HospitalVoiceAlarmTab patients={patients} />
 */

const SEVERITY_STYLES = {
  critical: { badge: 'bg-red-600 text-white', card: 'bg-red-50 border-red-300' },
  urgent: { badge: 'bg-amber-500 text-white', card: 'bg-amber-50 border-amber-300' },
  info: { badge: 'bg-emerald-600 text-white', card: 'bg-white border-gray-200' },
};

const TEST_PHRASES = [
  { label: "🔴 \"My chest hurts, I can't breathe\"", text: "My chest hurts and I can't breathe properly" },
  { label: '🟠 "Can I get some water, nurse"', text: 'Nurse, can I get a glass of water please' },
  { label: '🟢 "What time is dinner tonight"', text: 'Just checking, what time is dinner tonight' },
];

// TODO: connect to backend — replace this keyword heuristic with a real
// call to your AI triage endpoint, e.g.:
//   const res = await fetch('/api/voice-triage/classify', {
//     method: 'POST', headers: {'Content-Type':'application/json'},
//     body: JSON.stringify({ transcript })
//   });
//   return await res.json();
function localClassify(transcript) {
  const s = transcript.toLowerCase();
  const critical = [
    "can't breathe", 'cant breathe', 'chest hurt', 'chest pain', 'not breathing',
    'unconscious', 'collapsed', 'seizure', 'severe bleeding', 'bleeding a lot',
    'stroke', 'heart attack', 'allergic', 'choking',
  ];
  const urgent = [
    'nurse', 'water', 'medicine', 'pain', 'hurts', 'help me', 'bathroom',
    'dizzy', 'nauseous', 'uncomfortable', 'cold', 'blanket',
  ];
  if (critical.some((w) => s.includes(w))) {
    return { severity: 'critical', label: 'Possible emergency', note: 'Respond immediately — patient reporting chest pain and breathing difficulty, possible cardiac or respiratory emergency.' };
  }
  if (urgent.some((w) => s.includes(w))) {
    return { severity: 'urgent', label: 'Nursing request', note: 'Send a nurse to assist when available.' };
  }
  if (s.trim().length === 0) return null;
  return { severity: 'info', label: 'General remark', note: 'No clinical action needed.' };
}

function fmtClock(iso) {
  return new Date(iso).toLocaleTimeString([], { hour12: false });
}

function EcgStrip({ state }) {
  const stroke = state === 'critical' ? '#FFD3D3' : state === 'urgent' ? '#FFE1B8' : 'rgba(255,255,255,.55)';
  const dur = state === 'critical' ? '2.4s' : state === 'urgent' ? '3.6s' : '6s';
  return (
    <div className="relative h-11 overflow-hidden">
      <svg viewBox="0 0 1200 46" preserveAspectRatio="none" className="w-full h-full block">
        <path
          d="M0,23 L60,23 L68,23 L74,7 L80,39 L86,19 L92,23 L152,23 L160,23 L166,7 L172,39 L178,19 L184,23 L244,23 L252,23 L258,7 L264,39 L270,19 L276,23 L336,23 L1200,23"
          fill="none" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
          style={{ animation: `wp-scroll ${dur} linear infinite` }}
        />
      </svg>
      <style>{`@keyframes wp-scroll { from { transform: translateX(0); } to { transform: translateX(-336px); } }`}</style>
    </div>
  );
}

export default function HospitalVoiceAlarmTab({ patients = [] }) {
  const { alerts, pushAlert, ackAlert, activeCritical, activeUrgent } = useVoiceAlerts();

  const [selectedPatientId, setSelectedPatientId] = useState(patients[0]?.id ?? null);
  const selectedPatient = patients.find((p) => p.id === selectedPatientId) || patients[0] || null;

  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [thinking, setThinking] = useState(false);
  const [micSupported, setMicSupported] = useState(true);
  const recognitionRef = React.useRef(null);

  const handleTranscript = useCallback(async (text) => {
    setTranscript(text);
    setThinking(true);
    await new Promise((r) => setTimeout(r, 400));
    const result = localClassify(text);
    setThinking(false);
    if (!result || !selectedPatient) return;
    pushAlert({
      patientId: selectedPatient.id,
      patientName: selectedPatient.name,
      bed: selectedPatient.bed,
      doctor: selectedPatient.doctor,
      transcript: text,
      severity: result.severity,
      label: result.label,
      note: result.note,
    });
  }, [pushAlert, selectedPatient]);

  const startListening = () => {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) { setMicSupported(false); return; }
    const r = new SpeechRec();
    r.continuous = true;
    r.interimResults = true;
    r.lang = 'en-US';
    r.onresult = (e) => {
      let finalText = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const res = e.results[i];
        setTranscript(res[0].transcript);
        if (res.isFinal) finalText = res[0].transcript;
      }
      if (finalText.trim()) handleTranscript(finalText.trim());
    };
    r.onerror = () => setMicSupported(false);
    r.onend = () => { if (recognitionRef.current === r) { try { r.start(); } catch (e) {} } };
    recognitionRef.current = r;
    try { r.start(); setListening(true); } catch (e) {}
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      const r = recognitionRef.current;
      recognitionRef.current = null;
      try { r.stop(); } catch (e) {}
    }
    setListening(false);
  };

  const feed = alerts.slice(0, 20);
  const ecgState = activeCritical.length ? 'critical' : activeUrgent.length ? 'urgent' : 'normal';
  const serif = { fontFamily: "'Fraunces', Georgia, serif" };
  const mono = { fontFamily: "'IBM Plex Mono', ui-monospace, monospace" };

  return (
    <div className="space-y-6">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=IBM+Plex+Mono:wght@500;600&display=swap');`}</style>

      <div className="rounded-2xl overflow-hidden shadow-md">
        <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-800 px-6 pt-5 pb-0 text-white">
          <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-white/15 flex items-center justify-center text-xl">🩺</div>
              <div>
                <h2 className="text-2xl font-semibold leading-tight" style={serif}>Voice Alarm</h2>
                <p className="text-[12px] text-emerald-100/80 leading-tight">AI voice-triage — bedside listening, doctor-side response</p>
              </div>
            </div>
            <span className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-emerald-100/85" style={mono}>
              <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
              AI engine online
            </span>
          </div>
          <EcgStrip state={ecgState} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <p className="text-3xl font-semibold text-gray-800" style={serif}>{activeCritical.length}</p>
          <p className="text-[11px] uppercase tracking-wide text-gray-400 mt-1" style={mono}>Critical, unacknowledged</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <p className="text-3xl font-semibold text-gray-800" style={serif}>{activeUrgent.length}</p>
          <p className="text-[11px] uppercase tracking-wide text-gray-400 mt-1" style={mono}>Urgent, unacknowledged</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <p className="text-3xl font-semibold text-gray-800" style={serif}>{alerts.length}</p>
          <p className="text-[11px] uppercase tracking-wide text-gray-400 mt-1" style={mono}>Total heard today</p>
        </div>
      </div>

      {activeCritical[0] && (
        <div className="bg-red-600 text-white rounded-xl p-4 flex items-center justify-between gap-4 shadow-md">
          <div>
            <p className="font-bold text-sm">⚠ Life-threatening alert — {activeCritical[0].patientName}</p>
            <p className="text-red-100 text-xs mt-0.5">{activeCritical[0].bed} · Dr. {activeCritical[0].doctor} — "{activeCritical[0].transcript}"</p>
          </div>
          <button onClick={() => ackAlert(activeCritical[0].id)} className="bg-white/20 border border-white/50 text-white text-xs font-bold px-3.5 py-2 rounded-lg shrink-0 hover:bg-white/30 transition-colors">
            Acknowledge
          </button>
        </div>
      )}
      {!activeCritical[0] && activeUrgent[0] && (
        <div className="bg-amber-500 text-white rounded-xl p-4 flex items-center justify-between gap-4 shadow-md">
          <div>
            <p className="font-bold text-sm">Urgent nursing request — {activeUrgent[0].patientName}</p>
            <p className="text-amber-50 text-xs mt-0.5">{activeUrgent[0].bed} · Dr. {activeUrgent[0].doctor} — "{activeUrgent[0].transcript}"</p>
          </div>
          <button onClick={() => ackAlert(activeUrgent[0].id)} className="bg-white/20 border border-white/50 text-white text-xs font-bold px-3.5 py-2 rounded-lg shrink-0 hover:bg-white/30 transition-colors">
            Acknowledge
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <p className="text-[10.5px] uppercase tracking-[1.5px] text-amber-700/80 mb-1" style={mono}>Bedside device</p>
          <h3 className="text-lg font-semibold text-gray-800 mb-4" style={serif}>Voice sensor</h3>

          <label className="text-[11px] font-bold text-gray-500 uppercase">Admitted patient</label>
          <select
            value={selectedPatientId ?? ''}
            onChange={(e) => setSelectedPatientId(Number(e.target.value))}
            className="w-full mt-1 px-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 mb-2"
          >
            {patients.map((p) => (
              <option key={p.id} value={p.id}>{p.name} — {p.bed}</option>
            ))}
          </select>
          {selectedPatient && (
            <p className="text-[11px] text-gray-400 mb-2">Attending: Dr. {selectedPatient.doctor}</p>
          )}

          <div className="flex flex-col items-center py-6">
            <button
              onClick={listening ? stopListening : startListening}
              className={`h-24 w-24 rounded-full text-4xl text-white shadow-lg transition-transform active:scale-95 ${listening ? 'bg-red-600 animate-pulse' : 'bg-emerald-700 hover:bg-emerald-800'}`}
            >
              🎙️
            </button>
            <p className="text-xs text-gray-500 mt-3">
              {listening ? 'Listening…' : micSupported ? 'Tap to start listening' : 'Mic unavailable — use a test phrase below'}
            </p>
          </div>

          <div className={`min-h-[60px] rounded-lg border border-dashed border-gray-200 bg-gray-50 p-3.5 text-sm ${transcript ? 'text-gray-800' : 'text-gray-400 italic'}`}>
            {transcript || 'Nothing heard yet — the sensor is idle.'}
          </div>
          {thinking && <p className="text-[11px] text-emerald-700 font-bold mt-2" style={mono}>AI is reading the sentence for severity…</p>}

          <div className="mt-5 space-y-2">
            {TEST_PHRASES.map((p) => (
              <button
                key={p.text}
                onClick={() => handleTranscript(p.text)}
                className="w-full text-left text-xs px-3.5 py-2.5 rounded-lg border border-gray-200 hover:border-emerald-400 hover:bg-emerald-50 transition-colors"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div className={`bg-white rounded-xl shadow-sm border p-6 transition-colors ${ecgState === 'critical' ? 'border-red-300' : ecgState === 'urgent' ? 'border-amber-300' : 'border-gray-200'}`}>
          <p className="text-[10.5px] uppercase tracking-[1.5px] text-amber-700/80 mb-1" style={mono}>Live feed — all wards</p>
          <h3 className="text-lg font-semibold text-gray-800 mb-4" style={serif}>Incoming alerts</h3>

          {feed.length === 0 && (
            <div className="text-center py-10 text-gray-400 text-sm">
              <div className="text-2xl mb-2">🕊️</div>
              No alerts yet. Trigger one from the Bedside Sensor panel.
            </div>
          )}

          <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
            {feed.map((a) => {
              const style = SEVERITY_STYLES[a.severity] || SEVERITY_STYLES.info;
              return (
                <div key={a.id} className={`rounded-lg border p-3.5 ${a.acked ? 'bg-gray-50 border-gray-200 opacity-70' : style.card}`}>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-bold text-gray-800">{a.patientName}</p>
                      <p className="text-[11px] text-gray-500">{a.bed} · Dr. {a.doctor}</p>
                    </div>
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full shrink-0 ${a.acked ? 'bg-gray-200 text-gray-600' : style.badge}`}>
                      {a.acked ? 'acknowledged' : a.severity}
                    </span>
                  </div>
                  <p className="text-xs text-gray-700 mt-1.5">{a.note || a.label}</p>
                  <p className="text-[11px] text-gray-400 italic mt-1">"{a.transcript}"</p>
                  <div className="flex items-center justify-between mt-2.5">
                    <span className="text-[10px] text-gray-400" style={mono}>{fmtClock(a.time)}</span>
                    {!a.acked && (
                      <button onClick={() => ackAlert(a.id)} className="text-[11px] font-bold px-2.5 py-1 rounded-md border border-gray-200 hover:bg-gray-100">
                        Acknowledge
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}