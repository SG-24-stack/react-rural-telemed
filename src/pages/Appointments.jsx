
import React from 'react';

export default function Appointments({ setCurrentPage }) {
  return (
    <div className="p-6 max-w-4xl mx-auto mt-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">My Appointments</h2>
        <button onClick={() => setCurrentPage && setCurrentPage('dashboard')} className="text-sm bg-gray-200 text-gray-700 font-medium px-4 py-1.5 rounded hover:bg-gray-300 transition-colors">Back</button>
      </div>
      <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
        <ul className="divide-y divide-gray-200">
          <li className="p-4 hover:bg-gray-50 flex justify-between items-center transition-colors">
            <div>
              <p className="font-bold text-gray-800">Dr. Sharma - General Checkup</p>
              <p className="text-sm text-gray-500 mt-1">Today, 2:00 PM</p>
            </div>
            <span className="bg-green-100 text-green-800 text-xs px-2.5 py-1 rounded-full font-semibold">Upcoming</span>
          </li>
          <li className="p-4 hover:bg-gray-50 flex justify-between items-center transition-colors">
            <div>
              <p className="font-bold text-gray-800">Dr. Patel - Pediatrics</p>
              <p className="text-sm text-gray-500 mt-1">Aug 12, 2026</p>
            </div>
            <span className="bg-gray-100 text-gray-600 text-xs px-2.5 py-1 rounded-full font-semibold border border-gray-200">Completed</span>
          </li>
        </ul>
      </div>
    </div>
  );
}