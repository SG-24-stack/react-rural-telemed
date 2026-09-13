import React from 'react';

// ── AnimatedMedicalBackground ───────────────────────────────────────────────
// Full-bleed photographic background: 10 real photos (medical care, rural
// medical outreach, hospital, doctor, patients — 2 each) slowly zoom
// (Ken Burns) and crossfade into each other, behind a dark gradient wash so
// dashboard content stays readable. Timing is tuned so each photo's
// fade-out overlaps the next photo's fade-in — no black flash / gap.
// Always `fixed` + `pointer-events-none` so it sits behind all page content.
// Respects `prefers-reduced-motion` (falls back to a single static image).
// ─────────────────────────────────────────────────────────────────────────

const IMAGES = [
  { src: "https://images.unsplash.com/photo-1576091160550-2173ff9e5ee5?auto=format&fit=crop&w=1920&q=80", label: "medical-1" },
  { src: "https://images.unsplash.com/photo-1584982751601-97dcc096659c?auto=format&fit=crop&w=1920&q=80", label: "medical-2" },
  { src: "https://images.unsplash.com/photo-1547347298-4074fc3086f0?auto=format&fit=crop&w=1920&q=80", label: "rural-medical-1" },
  { src: "https://images.unsplash.com/photo-1622021142947-da7dedc7c39a?auto=format&fit=crop&w=1920&q=80", label: "rural-medical-2" },
  { src: "https://images.unsplash.com/photo-1587351021355-a479a299d2f9?auto=format&fit=crop&w=1920&q=80", label: "hospital-1" },
  { src: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1920&q=80", label: "hospital-2" },
  { src: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=1920&q=80", label: "doctor-1" },
  { src: "https://images.unsplash.com/photo-1622902046580-2b47f47f5471?auto=format&fit=crop&w=1920&q=80", label: "doctor-2" },
  { src: "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?auto=format&fit=crop&w=1920&q=80", label: "patients-1" },
  { src: "https://images.unsplash.com/photo-1571772805064-207c8435df79?auto=format&fit=crop&w=1920&q=80", label: "patients-2" }
];

export default function AnimatedMedicalBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 bg-gray-950" aria-hidden="true">
      {/* Cinematic photo crossfade — stacked, staggered, overlapping */}
      {IMAGES.map((img, idx) => (
        <div
          key={img.label}
          className={`absolute inset-0 bg-cover bg-center ken-burns-bg phase-${idx + 1}`}
          style={{ backgroundImage: `url(${img.src})` }}
        />
      ))}

      {/* Dark gradient overlay so text/dashboard content stays highly readable */}
      <div className="absolute inset-0 bg-gradient-to-br from-teal-950/85 via-gray-900/85 to-blue-950/85 z-10"></div>
    </div>
  );
}