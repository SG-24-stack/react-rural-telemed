import { useState, useEffect, useCallback } from 'react';

/**
 * useVoiceAlerts
 * ------------------------------------------------
 * Single source of truth for AI voice-triage alarms, shared across every
 * tab in the hospital portal (and, if the patient-facing app writes to
 * the same origin's localStorage, across apps too).
 *
 * An alert is tied to a real patient record, not just a bed string:
 *   { id, patientId, patientName, bed, doctor, severity, label, note,
 *     transcript, time, acked }
 *
 * Any component can call this hook to:
 *  - read the live list (`alerts`)
 *  - push a new one (`pushAlert`)
 *  - acknowledge one (`ackAlert`)
 *  - check a specific patient or doctor (`getAlertsForPatient`,
 *    `getAlertsForDoctor`)
 *
 * TODO: connect to backend — this currently persists to localStorage and
 * polls/listens for the `storage` event. Swap `load`/`save` for real API
 * calls (and consider a websocket for push instead of polling) once a
 * backend is in place.
 */

const STORE_KEY = 'medonext_voice_alerts';
const POLL_MS = 1500;

function load() {
  try { return JSON.parse(localStorage.getItem(STORE_KEY)) || []; } catch (e) { return []; }
}
function save(list) {
  localStorage.setItem(STORE_KEY, JSON.stringify(list));
}

export default function useVoiceAlerts() {
  const [alerts, setAlerts] = useState(() => load());

  useEffect(() => {
    const onStorage = (e) => { if (e.key === STORE_KEY) setAlerts(load()); };
    window.addEventListener('storage', onStorage);
    const interval = setInterval(() => setAlerts(load()), POLL_MS);
    return () => { window.removeEventListener('storage', onStorage); clearInterval(interval); };
  }, []);

  const pushAlert = useCallback((partial) => {
    const alert = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      time: new Date().toISOString(),
      acked: false,
      ...partial,
    };
    setAlerts((prev) => {
      const next = [alert, ...prev].slice(0, 60);
      save(next);
      return next;
    });
    return alert;
  }, []);

  const ackAlert = useCallback((id) => {
    setAlerts((prev) => {
      const next = prev.map((a) => (a.id === id ? { ...a, acked: true } : a));
      save(next);
      return next;
    });
    // TODO: connect to backend — record who acknowledged and when.
  }, []);

  const getAlertsForPatient = useCallback(
    (patientId) => alerts.filter((a) => a.patientId === patientId && !a.acked),
    [alerts]
  );
  const getAlertsForDoctor = useCallback(
    (doctorName) => alerts.filter((a) => a.doctor === doctorName && !a.acked),
    [alerts]
  );

  const activeCritical = alerts.filter((a) => !a.acked && a.severity === 'critical');
  const activeUrgent = alerts.filter((a) => !a.acked && a.severity === 'urgent');

  return { alerts, pushAlert, ackAlert, getAlertsForPatient, getAlertsForDoctor, activeCritical, activeUrgent };
}