import React, { useState } from 'react';

export default function DiagnosticRouter({ setCurrentPage }) {
  const [selectedTest, setSelectedTest] = useState('Blood Sugar / CBC');
  const [patientLocation, setPatientLocation] = useState('Kandi Rural Grid');
  const [routedLabs, setRoutedLabs] = useState(null);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  // Database of regional labs & routing logic
  const labDatabase = {
    'Kandi Rural Grid': [
      { id: 1, name: 'Kandi Sub-Divisional Hospital Lab', distance: '1.2 km', type: 'Government Hub', timing: '08:00 AM - 02:00 PM', freeUnderScheme: 'Yes (PM-JAY / Swasthya Sathi)' },
      { id: 2, name: 'Rural Community Health Centre Diagnostics', distance: '3.5 km', type: 'Primary Health Center', timing: '09:00 AM - 01:00 PM', freeUnderScheme: 'Yes' },
      { id: 3, name: 'MediScan Village Collection Kiosk', distance: '2.0 km', type: 'Partner Private Lab', timing: '07:00 AM - 07:00 PM', freeUnderScheme: 'Subsidized' }
    ],
    'Murshidabad Regional Center': [
      { id: 4, name: 'Murshidabad Medical College Central Pathology', distance: '24.0 km', type: 'Apex Government Hospital', timing: '24/7 Open', freeUnderScheme: 'Yes' },
      { id: 5, name: 'Sub-Regional Diagnostic Center', distance: '18.5 km', type: 'Accredited Lab', timing: '08:00 AM - 08:00 PM', freeUnderScheme: 'Partial' }
    ]
  };

  const handleRouteLabs = (e) => {
    e.preventDefault();
    const available = labDatabase[patientLocation] || labDatabase['Kandi Rural Grid'];
    setRoutedLabs(available);
    setBookingConfirmed(false);
  };

  const handleBookCollection = (labName) => {
    setBookingConfirmed(true);
    alert(`Sample collection agent successfully dispatched from ${labName} to your address!`);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto mt-4 space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="bg-blue-600 text-white p-6 rounded-2xl shadow-lg flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black">🔬 Smart Lab Router & Diagnostics</h1>
          <p className="text-xs text-blue-100 mt-1">Automatically route test requirements to the nearest accredited laboratory or schedule home collection.</p>
        </div>
        <button 
          onClick={() => setCurrentPage('dashboard')} 
          className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow"
        >
          ← Back to Dashboard
        </button>
      </div>

      {/* Input Selection Form */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 space-y-5">
        <div>
          <h3 className="font-black text-gray-800 text-sm">📍 Step 1: Specify Test & Location Grid</h3>
          <p className="text-xs text-gray-500 mt-0.5">If prescription handwriting is unclear, select your required category below to find matching facilities.</p>
        </div>

        <form onSubmit={handleRouteLabs} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-bold text-gray-700 mb-1">Select Test / Diagnostic Requirement *</label>
            <select 
              value={selectedTest} 
              onChange={(e) => setSelectedTest(e.target.value)}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none font-bold"
            >
              <option>Blood Sugar / Complete Blood Count (CBC)</option>
              <option>Malaria & Dengue Rapid Screening</option>
              <option>Liver Function Test (LFT) / Kidney Panel</option>
              <option>X-Ray / Chest Screening</option>
              <option>General Prescription Lab Work</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">Patient Location / Rural Grid *</label>
            <select 
              value={patientLocation} 
              onChange={(e) => setPatientLocation(e.target.value)}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none font-bold"
            >
              <option>Kandi Rural Grid</option>
              <option>Murshidabad Regional Center</option>
            </select>
          </div>

          <div className="md:col-span-2 pt-2">
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold shadow-md transition-transform active:scale-95 text-xs">
              🔍 Find Nearest Labs & Recommended Route
            </button>
          </div>
        </form>
      </div>

      {/* Results & Suggestions Section */}
      {routedLabs && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 space-y-4 animate-fade-in">
          <div className="border-b pb-3">
            <h3 className="font-black text-gray-900 text-base">🏥 Recommended Laboratories for: <span className="text-blue-600">{selectedTest}</span></h3>
            <p className="text-xs text-gray-500 mt-0.5">Showing nearest verified facilities matching your location grid.</p>
          </div>

          <div className="space-y-3">
            {routedLabs.map((lab) => (
              <div key={lab.id} className="p-4 bg-gray-50 border border-gray-200 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-1">
                  <h4 className="font-black text-gray-900 text-sm">{lab.name}</h4>
                  <p className="text-xs font-semibold text-blue-700">📍 Distance: {lab.distance} &bull; ⏰ Timing: {lab.timing}</p>
                  <p className="text-[11px] text-gray-600">Facility Type: <span className="font-bold">{lab.type}</span> | Government Support: <span className="text-green-700 font-bold">{lab.freeUnderScheme}</span></p>
                </div>

                <div className="flex gap-2 w-full md:w-auto">
                  <button 
                    onClick={() => handleBookCollection(lab.name)}
                    className="flex-1 md:flex-none bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow transition-transform active:scale-95"
                  >
                    🛵 Request Home Sample Collection
                  </button>
                </div>
              </div>
            ))}
          </div>

          {bookingConfirmed && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-center text-xs text-green-800 font-bold mt-4">
              ✓ Sample collection route locked! A community health worker has been assigned to your village zone.
            </div>
          )}
        </div>
      )}

    </div>
  );
}