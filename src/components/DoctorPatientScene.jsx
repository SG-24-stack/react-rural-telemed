import React from 'react';

// ── DoctorPatientScene ──────────────────────────────────────────────────────
// Reusable ambient background illustration: a doctor standing beside a
// seated patient, drawn once as a static base (head, coat, chair, patient
// body). The doctor's action cycles through three phases on a 15s loop with
// smooth crossfades:
//   1. Listening with a stethoscope on the patient's chest
//   2. Writing notes on a clipboard
//   3. Gesturing while talking (small "speech" dots)
//
// Kept at very light opacity (0.16) with a gentle slow vertical drift, so it
// reads as a soft watermark-style scene behind page content rather than
// competing with cards/UI. Respects `prefers-reduced-motion` (falls back to
// showing just the stethoscope phase, no animation). Always `absolute` +
// `pointer-events-none` so it can never be clipped oddly or block clicks —
// wrap it in a `relative` positioned parent wherever it's used.
//
// Usage (inside any page component):
//
//   <div className="relative">
//     <div className="absolute inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">
//       <span className="absolute bottom-2 right-2 sm:right-8 bg-scene-float">
//         <DoctorPatientScene />
//       </span>
//     </div>
//     ...page content with relative z-10...
//   </div>
//
// NOTE: the animation CSS (.bg-scene-float, .scene-phase, keyframes, and the
// prefers-reduced-motion fallback) now lives globally in src/index.css, so
// it loads once for the whole app instead of being re-injected per page.
// ─────────────────────────────────────────────────────────────────────────

export default function DoctorPatientScene() {
  return (
    <svg viewBox="0 0 220 150" width="360" height="246">
      {/* Chair */}
      <path d="M158 128V96M158 96h34v32M186 96v32" fill="none" stroke="#94A3B8" strokeWidth="1.6" strokeLinecap="round" />

      {/* Patient (seated, static across all phases) */}
      <circle cx="172" cy="70" r="11" fill="#FDE0C4" stroke="#C2793D" strokeWidth="1.2" />
      <path d="M158 96c0-9 6-15 14-15s14 6 14 15v28h-28z" fill="#DBEAFE" stroke="#3B82F6" strokeWidth="1.4" />

      {/* Doctor (standing, static body across all phases) */}
      <circle cx="64" cy="52" r="11" fill="#FBCFA1" stroke="#B5713A" strokeWidth="1.2" />
      <path d="M44 138V96c0-15 9-26 20-26s20 11 20 26v42z" fill="#FFFFFF" stroke="#4F46E5" strokeWidth="1.6" />
      <line x1="64" y1="70" x2="64" y2="120" stroke="#4F46E5" strokeWidth="1" />
      <line x1="44" y1="138" x2="41" y2="150" stroke="#1F2937" strokeWidth="2" strokeLinecap="round" />
      <line x1="84" y1="138" x2="87" y2="150" stroke="#1F2937" strokeWidth="2" strokeLinecap="round" />

      {/* Phase 1: listening with stethoscope */}
      <g className="scene-phase scene-phase-1">
        <path d="M60 78c-3 3-3 9 0 12" fill="none" stroke="#374151" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M60 90c0 5 4 9 9 9h20c5 0 9 4 9 9" fill="none" stroke="#374151" strokeWidth="1.4" strokeLinecap="round" />
        <circle cx="167" cy="92" r="3" fill="#E5E7EB" stroke="#374151" strokeWidth="1.2" />
      </g>

      {/* Phase 2: writing notes on a clipboard */}
      <g className="scene-phase scene-phase-2">
        <rect x="86" y="82" width="18" height="24" rx="2" fill="#F8FAFC" stroke="#4B5563" strokeWidth="1.3" />
        <line x1="90" y1="88" x2="100" y2="88" stroke="#94A3B8" strokeWidth="1.1" />
        <line x1="90" y1="93" x2="100" y2="93" stroke="#94A3B8" strokeWidth="1.1" />
        <line x1="90" y1="98" x2="97" y2="98" stroke="#94A3B8" strokeWidth="1.1" />
        <line x1="80" y1="86" x2="92" y2="94" stroke="#374151" strokeWidth="1.4" strokeLinecap="round" />
      </g>

      {/* Phase 3: talking with an open hand gesture */}
      <g className="scene-phase scene-phase-3">
        <path d="M80 86c6-2 12-1 16 3" fill="none" stroke="#374151" strokeWidth="1.4" strokeLinecap="round" />
        <circle cx="184" cy="46" r="2" fill="#94A3B8" />
        <circle cx="192" cy="40" r="1.4" fill="#CBD5E1" />
        <circle cx="198" cy="35" r="1" fill="#E2E8F0" />
      </g>
    </svg>
  );
}
