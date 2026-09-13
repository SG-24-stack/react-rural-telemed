import React, { useState, useEffect } from 'react';


const ROLES = [
  {
    key: 'patient',
    icon: '🧑‍🤝‍🧑',
    title: 'Patient / User',
    desc: "Book consultations, order medicine, manage your family's care",
    accent: 'from-green-600 to-emerald-700',
    page: 'login',
  },
  {
    key: 'doctor',
    icon: '🩺',
    title: 'Doctor',
    desc: 'Manage patient queues, consultations, and your practice',
    accent: 'from-indigo-600 to-blue-700',
    page: 'login-doctor',
  },
  {
    key: 'hospital',
    icon: '🏥',
    title: 'Hospital',
    desc: 'Staff & administrative access to the hospital portal',
    accent: 'from-emerald-800 to-teal-800',
    page: 'hospital-login',
  },
];

export default function RoleSelect({ setCurrentPage }) {
  const [slideIn, setSlideIn] = useState(false);

  useEffect(() => {
    // Mount off-screen first, then flip the class a tick later so the
    // transition actually animates instead of snapping into place.
    const t = setTimeout(() => setSlideIn(true), 30);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-start overflow-hidden font-sans">
      {/* Background — same treatment as Login.jsx so the two screens feel
          like one continuous flow rather than a jump cut. */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0 filter brightness-75 scale-105"
        style={{
          backgroundImage: `linear-gradient(rgba(6, 78, 59, 0.85), rgba(15, 23, 42, 0.90)), url('https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1920&q=80')`,
        }}
      />

      {/* Sliding panel: identical transform/transition classes to
          Dashboard's account drawer, just used as a full-height entry
          panel instead of a dismissible overlay. */}
      <div
        className={`relative z-10 h-screen w-full max-w-md bg-white/95 backdrop-blur-xl shadow-2xl px-6 py-10 flex flex-col justify-center transform transition-transform duration-300 ease-in-out ${
          slideIn ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-emerald-700 text-white rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
            <span className="text-3xl">🩺</span>
          </div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">Rural Telemedicine</h2>
          <p className="text-xs text-gray-600 mt-1 font-semibold">Choose how you'd like to sign in</p>
        </div>

        <div className="space-y-4">
          {ROLES.map((role) => (
            <button
              key={role.key}
              onClick={() => setCurrentPage(role.page)}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl text-left text-white shadow-lg bg-gradient-to-br ${role.accent} transition-transform active:scale-95 hover:brightness-110 cursor-pointer`}
            >
              <span className="flex items-center justify-center h-12 w-12 rounded-full bg-white/15 text-2xl shrink-0">
                {role.icon}
              </span>
              <span>
                <p className="font-black text-sm">{role.title}</p>
                <p className="text-white/80 text-xs mt-0.5">{role.desc}</p>
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
