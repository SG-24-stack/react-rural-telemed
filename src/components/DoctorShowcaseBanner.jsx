import React from 'react';

export default function DoctorShowcaseBanner() {
  const doctorScenes = [
    {
      id: 1,
      title: "Rural Tele-Consultation",
      role: "Connecting Remote Villages",
      desc: "Doctors diagnosing patients across blocks in real-time video feeds.",
      icon: "💻",
      bg: "from-emerald-500 to-green-700"
    },
    {
      id: 2,
      title: "Mobile Health Camps",
      role: "Field Operations",
      desc: "Physicians and health workers conducting checkups directly in rural sectors.",
      icon: "🏕️",
      bg: "from-blue-500 to-indigo-700"
    },
    {
      id: 3,
      title: "Emergency Trauma Hub",
      role: "Sub-Divisional Hospital",
      desc: "Critical care management, organ transport, and rapid emergency response.",
      icon: "🏥",
      bg: "from-teal-600 to-emerald-800"
    },
    {
      id: 4,
      title: "Community Pharmacy Routing",
      role: "Seamless Medication",
      desc: "Coordinating e-prescriptions with local mobile medical supply units.",
      icon: "🛵",
      bg: "from-green-600 to-teal-700"
    }
  ];

  return (
    <div className="bg-white/90 backdrop-blur p-6 rounded-xl shadow-sm border border-gray-200 mt-6 space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-3 gap-2">
        <div>
          <h3 className="text-lg font-bold text-gray-800">🌟 Rural Healthcare in Action</h3>
          <p className="text-xs text-gray-500">Dedicated medical professionals operating across telehealth grids and community hubs.</p>
        </div>
        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider animate-pulse">
          24/7 Active Network
        </span>
      </div>

      {/* Animated Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
        {doctorScenes.map((scene) => (
          <div 
            key={scene.id} 
            className="group relative bg-gradient-to-br p-5 rounded-xl text-white shadow-md transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl overflow-hidden flex flex-col justify-between"
            style={{ backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))` }}
          >
            {/* Background absolute subtle icon watermark */}
            <div className="absolute -right-4 -bottom-4 text-7xl opacity-10 group-hover:scale-110 transition-transform">
              {scene.icon}
            </div>

            <div className="relative z-10 space-y-2">
              <span className="text-3xl p-2 bg-white/20 rounded-lg inline-block backdrop-blur-sm shadow-inner">
                {scene.icon}
              </span>
              <h4 className="font-black text-sm text-white">{scene.title}</h4>
              <p className="text-[10px] font-bold text-emerald-200 uppercase tracking-wide">{scene.role}</p>
              <p className="text-xs text-gray-100 font-medium leading-relaxed pt-1">
                {scene.desc}
              </p>
            </div>

            <div className="relative z-10 pt-4 mt-4 border-t border-white/20 flex items-center justify-between text-[10px] font-bold text-emerald-100">
              <span>Status: Active</span>
              <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}