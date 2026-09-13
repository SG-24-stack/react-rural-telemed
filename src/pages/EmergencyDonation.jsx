import React, { useState } from 'react';

export default function EmergencyDonation({ setCurrentPage }) {
  const [bloodNeeded, setBloodNeeded] = useState('O+');
  const [organNeeded, setOrganNeeded] = useState('Kidney');
  const [patientName, setPatientName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [dispatched, setDispatched] = useState(false);

  const handleRegisterAlert = (e) => {
    e.preventDefault();
    if (!patientName || !contactPhone) {
      alert('Please fill in all acceptor details.');
      return;
    }
    setDispatched(true);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="bg-red-600 text-white p-6 rounded-2xl shadow-lg flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black">🚨 Emergency Organ & Blood Donation Network</h1>
          <p className="text-xs text-red-100 mt-1">Matching living and deceased donor registries with patient requirements, blood groups, and hospital hubs.</p>
        </div>
        <button 
          onClick={() => setCurrentPage('dashboard')} 
          className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow"
        >
          ← Back to Dashboard
        </button>
      </div>

      {/* Special Government Scheme Banner */}
      <div className="bg-gradient-to-r from-red-700 to-rose-800 text-white p-4 rounded-2xl shadow-sm flex flex-col sm:flex-row justify-between items-center gap-3">
        <div>
          <h3 className="font-bold text-sm">🏛️ SPECIAL GOVERNMENT DONOR SUPPORT SCHEME</h3>
          <p className="text-[11px] text-red-100 mt-0.5">Registered living donors and families of pledged deceased donors receive priority medical care, transport vouchers, and state insurance coverage.</p>
        </div>
        <span className="bg-white text-red-800 font-black text-[10px] px-3 py-1.5 rounded-full uppercase tracking-wider shrink-0 shadow">
          National Health Mission Verified
        </span>
      </div>

      {/* Filters & Grid Search */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-[11px] font-black text-gray-600 uppercase mb-1">Filter by Organ / Tissue</label>
          <select className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold outline-none">
            <option>All Organs & Blood</option>
            <option>Kidney</option>
            <option>Liver</option>
            <option>Heart</option>
            <option>Eye / Cornea</option>
          </select>
        </div>
        <div>
          <label className="block text-[11px] font-black text-gray-600 uppercase mb-1">Filter by Blood Group</label>
          <select className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold outline-none">
            <option>All Blood Groups</option>
            <option>O-Negative (Universal)</option>
            <option>O-Positive</option>
            <option>B-Positive</option>
            <option>A-Negative</option>
          </select>
        </div>
        <div>
          <label className="block text-[11px] font-black text-gray-600 uppercase mb-1">Search Location Grid</label>
          <select className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold outline-none">
            <option>Kandi Rural Grid</option>
            <option>Murshidabad Regional Center</option>
            <option>Kolkata Apex Hub</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: Available Donors List */}
        <div className="md:col-span-2 space-y-4">
          <h3 className="font-black text-gray-800 text-sm">👥 Available Donors & Pledged Registries (Living & Deceased)</h3>

          {/* Donor Card 1 */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-black text-gray-900 text-base">Amitava Mukherjee</h4>
                <p className="text-xs text-gray-500 font-medium">Kandi Sub-Divisional Area (1.2 km away)</p>
                <span className="inline-block mt-1 bg-amber-50 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded border border-amber-200">
                  Eligible for State Health Insurance Waiver
                </span>
              </div>
              <span className="bg-red-100 text-red-700 font-black text-xs px-2.5 py-1 rounded-xl">
                O+ <br /><span className="text-[9px] font-normal">Living Donor</span>
              </span>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <span className="bg-red-50 text-red-700 text-[11px] font-bold px-2.5 py-1 rounded-lg">🩸 Blood</span>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-gray-100 text-xs">
              <span className="text-green-700 font-black flex items-center gap-1">🟢 Available Now</span>
              <a href="tel:+919832154321" className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded-xl shadow transition-transform active:scale-95">
                📞 Contact: +91 98321 54321
              </a>
            </div>
          </div>

          {/* Donor Card 2 */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-black text-gray-900 text-base">Pledged Deceased Registry (Unit #4)</h4>
                <p className="text-xs text-gray-500 font-medium">Murshidabad Regional Organ Bank (24 km away)</p>
                <span className="inline-block mt-1 bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-200">
                  Government Funeral & Family Honor Grant Active
                </span>
              </div>
              <span className="bg-red-100 text-red-700 font-black text-xs px-2.5 py-1 rounded-xl">
                B+ <br /><span className="text-[9px] font-normal">Deceased / Post-Mortem Pledge</span>
              </span>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <span className="bg-blue-50 text-blue-700 text-[11px] font-bold px-2.5 py-1 rounded-lg">🫀 Kidney</span>
              <span className="bg-emerald-50 text-emerald-700 text-[11px] font-bold px-2.5 py-1 rounded-lg">🩺 Liver</span>
              <span className="bg-purple-50 text-purple-700 text-[11px] font-bold px-2.5 py-1 rounded-lg">👁️ Eye</span>
            </div>
          </div>
        </div>

        {/* Right Column: Acceptor Waiting List & Auto-Alert Form */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 space-y-4">
          <h3 className="font-black text-gray-800 text-sm">🔔 Acceptor Waiting List & Auto-Alert</h3>
          <p className="text-xs text-gray-500">If an exact organ or blood group match is not currently present, register here. Our system will automatically send an SMS/WhatsApp reminder to you the moment a donor matches your requirement!</p>

          {dispatched ? (
            <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-center space-y-2">
              <span className="text-2xl">✅</span>
              <h4 className="font-black text-green-800 text-sm">Successfully Registered!</h4>
              <p className="text-xs text-green-700">Auto-alerts activated for {patientName}. You will be notified via SMS/WhatsApp.</p>
              <button onClick={() => setDispatched(false)} className="text-xs font-bold text-green-800 underline mt-2">Register Another</button>
            </div>
          ) : (
            <form onSubmit={handleRegisterAlert} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Patient / Acceptor Name *</label>
                <input 
                  type="text" 
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="e.g. Sujit Chandra"
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none font-medium"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Organ / Blood Needed</label>
                  <select 
                    value={organNeeded}
                    onChange={(e) => setOrganNeeded(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none font-bold"
                  >
                    <option>Kidney</option>
                    <option>Liver</option>
                    <option>Heart</option>
                    <option>Blood Only</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Blood Group</label>
                  <select 
                    value={bloodNeeded}
                    onChange={(e) => setBloodNeeded(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none font-bold"
                  >
                    <option>O+</option>
                    <option>O-</option>
                    <option>A+</option>
                    <option>A-</option>
                    <option>B+</option>
                    <option>B-</option>
                    <option>AB+</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Contact Phone (For SMS Alerts) *</label>
                <input 
                  type="tel" 
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none font-medium"
                  required
                />
              </div>

              <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl shadow-md transition-transform active:scale-95 text-xs">
                Submit & Register Auto-Alert 🚀
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}