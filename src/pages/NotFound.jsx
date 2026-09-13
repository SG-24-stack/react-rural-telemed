import React from 'react';
import { PAGES } from '../constants/pages';

export default function NotFound({ setCurrentPage }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <h1 className="text-6xl font-black text-green-700 mb-2">404</h1>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Page Not Found</h2>
      <p className="text-sm text-gray-500 mb-6 max-w-md">
        The view you are looking for doesn't exist or has been moved.
      </p>
      <button
        onClick={() => setCurrentPage(PAGES.DASHBOARD)}
        className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-3 rounded-xl shadow transition-transform active:scale-95 text-sm"
      >
        Return to Dashboard
      </button>
    </div>
  );
}