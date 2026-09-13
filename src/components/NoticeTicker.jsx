import { useState } from 'react';

export default function NoticeTicker() {
  const [isOpen, setIsOpen] = useState(false);

  const notices = [
    "ADVISORY: Seasonal viral fever alert. Drink boiled water, use ORS packets, and consult local health workers if symptoms persist > 48 hours.",
    "EMERGENCY NOTICE: Bolpur Sub-Divisional Hospital blood bank reports high availability of O+ and B+ units.",
    "HEALTH CAMP: Free eye checkup and cataract registration camp active at Block B Community Center today.",
    "BLOOD & ORGANS: Burdwan Medical College emergency organ transplant transport cell is fully active 24/7."
  ];

  return (
    <>
      {/* Small tap icon — replaces the old scrolling bar */}
      <button
        onClick={() => setIsOpen(true)}
        aria-label="View live notices"
        title="Live Notice"
        className="relative bg-amber-500 hover:bg-amber-400 text-emerald-950 h-9 w-9 rounded-full flex items-center justify-center shadow-md shrink-0 animate-pulse text-base"
      >
        📢
      </button>

      {/* Notice panel — only exists while open, so it can never overlap the drawer at rest */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[9990] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="bg-emerald-950 border-2 border-emerald-600 rounded-3xl shadow-2xl w-full max-w-lg p-5 space-y-4 text-white relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center border-b border-emerald-800 pb-3">
              <div className="flex items-center space-x-2">
                <span className="bg-amber-500 text-emerald-950 font-black text-xs px-2.5 py-1 rounded-lg">
                  📢 LIVE BULLETIN
                </span>
                <span className="text-sm font-bold text-emerald-200">
                  Active Regional Notices ({notices.length})
                </span>
              </div>
              <button
                className="bg-emerald-900 hover:bg-emerald-800 text-emerald-200 hover:text-white px-3 py-1 rounded-xl text-xs font-bold transition-colors cursor-pointer border border-emerald-700"
                onClick={() => setIsOpen(false)}
              >
                ✕ Close
              </button>
            </div>

            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
              {notices.map((notice, idx) => (
                <div
                  key={idx}
                  className="text-xs sm:text-sm bg-emerald-900/90 hover:bg-emerald-800 p-3.5 rounded-2xl border border-emerald-700/60 text-emerald-100 font-medium transition-colors flex items-start space-x-3 shadow-md"
                >
                  <span className="text-amber-400 font-bold shrink-0 mt-0.5 text-base">•</span>
                  <span className="leading-relaxed">{notice}</span>
                </div>
              ))}
            </div>

            <div className="pt-2 text-center">
              <button
                onClick={() => setIsOpen(false)}
                className="w-full bg-emerald-700 hover:bg-emerald-600 text-white font-bold py-2.5 rounded-xl text-xs transition-all shadow-md cursor-pointer"
              >
                Got It, Close Notices
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}