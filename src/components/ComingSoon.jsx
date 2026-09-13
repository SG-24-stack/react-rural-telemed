import React from 'react';
import { PAGES } from '../constants/pages';

export default function ComingSoon({ icon = '🚧', title = 'Coming Soon', description = 'This feature is under development.', setCurrentPage }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <div className="text-6xl mb-4">{icon}</div>
      <h2 className="text-2xl font-black text-gray-800 mb-2">{title}</h2>
      <p className="text-sm text-gray-500 mb-6 max-w-md">{description}</p>
      <button
        onClick={() => setCurrentPage(PAGES.DASHBOARD)}
        className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-3 rounded-xl shadow transition-transform active:scale-95 text-sm"
      >
        Return to Dashboard
      </button>
    </div>
  );
}