import React from 'react';

export default function NearbyCareFinder({ setCurrentPage }) {
  return (
    <div className="relative min-h-screen flex items-center justify-center px-4">
      <div className="bg-white/90 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/60 w-full max-w-md text-center">
        <div className="text-4xl mb-3">🗺️</div>
        <h2 className="text-xl font-black text-gray-900 mb-2">Nearby Care Finder</h2>
        <p className="text-sm text-gray-600 mb-6">
          This feature is coming soon — it will help you locate nearby clinics, hospitals, and pharmacies.
        </p>
        <button
          onClick={() => setCurrentPage('dashboard')}
          className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow transition-transform active:scale-95"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}