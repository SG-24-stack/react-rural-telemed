import React, { useState } from 'react';

export default function EmergencyDonationDashboard({ setCurrentPage }) {
  // Filter States
  const [selectedOrgan, setSelectedOrgan] = useState('All');
  const [selectedBloodGroup, setSelectedBloodGroup] = useState('All');
  const [searchLocation, setSearchLocation] = useState('Kandi Rural Grid');
  
  // Simulation State for Request Submission
  const [requestSubmitted, setRequestSubmitted] = useState(false);
  const [acceptorForm, setAcceptorForm] = useState({ name: '', organNeeded: 'Kidney', bloodGroup: 'O+', phone: '' });

  // Database of Donors & Pledged Organs (Living & Deceased Registry)
  const [donors, setDonors] = useState([
    {
      id: 1,
      name: 'Amitava Mukherjee',
      donorType: 'Living Donor',
      organs: ['Blood'],
      bloodGroup: 'O+',
      location: 'Kandi Sub-Divisional Area (1.2 km away)',
      contact: '+91 98321 54321',
      govSupportBadge: 'Eligible for State Health Insurance Waiver',
      status: 'Available Now'
    },
    {
      id: 2,
      name: 'Pledged Deceased Registry (Unit #4)',
      donorType: 'Deceased / Post-Mortem Pledge',
      organs: ['Kidney', 'Liver', 'Eye'],
      bloodGroup: 'B+',
      location: 'Murshidabad Regional Organ Bank (24 km away)',
      contact: 'Helpline: 03482-270022',
      govSupportBadge: 'Government Funeral & Family Honor Grant Active',
      status: 'Preserved & Ready'
    },
    {
      id: 3,
      name: 'Subhashish Roy',
      donorType: 'Living Donor / Eye Pledge',
      organs: ['Eye', 'Blood'],
      bloodGroup: 'A+',
      location: 'Kandi Eye Care Bank (2.0 km away)',
      contact: '+91 94331 12345',
      govSupportBadge: 'State Donor Card Holder',
      status: 'Verified'
    }
  ]);

  // Nearest Organ Donation Centers & Hospitals
  const donationCenters = [
    {
      id: 1,
      name: 'Kandi Sub-Divisional Hospital & Organ Cell',
      distance: '1.2 km',
      supportedOrgans: ['Blood', 'Eye', 'Kidney (Collection Only)'],
      bloodInventory: 'O+ (12 units), B+ (8 units), A+ (5 units)',
      govStatus: 'Authorized Government Retrieval Center'
    },
    {
      id: 2,
      name: 'Murshidabad Medical College & Hospital (Regional Transplant Hub)',
      distance: '24.5 km',
      supportedOrgans: ['Heart', 'Kidney', 'Liver', 'Eye', 'Blood'],
      bloodInventory: 'Full Spectrum Blood & Organ Bank',
      govStatus: 'State Apex Transplant Center (Govt. Subsidized)'
    }
  ];

  // Handle Acceptor Request Submission (When organ/blood is not currently present)
  const handleRegisterRequest = (e) => {
    e.preventDefault();
    if (!acceptorForm.name || !acceptorForm.phone) return;
    setRequestSubmitted(true);
    setTimeout(() => {
      // Simulating automated matching background ping
    }, 1500);
  };

  // Filter logic for donors
  const filteredDonors = donors.filter(donor => {
    const matchesOrgan = selectedOrgan === 'All' || donor.organs.includes(selectedOrgan);
    const matchesBlood = selectedBloodGroup === 'All' || donor.bloodGroup === selectedBloodGroup;
    return matchesOrgan && matchesBlood;
  });

  return (
    <div className="p-6 max-w-6xl mx-auto mt-2 space-y-6">
      
      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-center bg-white/90 backdrop-blur p-4 rounded-xl shadow-sm border border-gray-200 gap-4">
        <div>
          <h1 className="text-2xl font-black text-red-700">🏥 Emergency Organ & Blood Donation Network</h1>
          <p className="text-xs text-gray-600">Matching living and deceased donor registries with patient requirements, blood groups, and hospital hubs.</p>
        </div>
        <button 
          onClick={() => setCurrentPage('dashboard')} 
          className="text-sm font-bold text-gray-600 hover:text-gray-900 underline"
        >
          &larr; Back to Dashboard
        </button>
      </header>

      {/* GOVERNMENT SUPPORT BANNER */}
      <div className="bg-gradient-to-r from-red-600 to-rose-800 text-white p-4 rounded-xl shadow-md flex flex-col md:flex-row justify-between items-center gap-3">
        <div>
          <h3 className="text-sm font-black uppercase tracking-wide">🛡️ Special Government Donor Support Scheme</h3>
          <p className="text-xs text-red-100 mt-0.5">Registered living donors and families of pledged deceased donors receive priority medical care, transport vouchers, and state insurance coverage.</p>
        </div>
        <span className="bg-white text-red-800 text-xs font-black px-3 py-1.5 rounded-lg whitespace-nowrap shadow-sm">
          National Health Mission Verified
        </span>
      </div>

      {/* SEARCH & FILTER CONTROLS */}
      <div className="bg-white/90 backdrop-blur p-4 rounded-xl shadow-sm border border-gray-200 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">Filter by Organ / Tissue</label>
          <select 
            value={selectedOrgan}
            onChange={(e) => setSelectedOrgan(e.target.value)}
            className="w-full p-2.5 border rounded-lg text-xs bg-gray-50 font-bold"
          >
            <option value="All">All Organs & Blood</option>
            <option value="Heart">❤️ Heart</option>
            <option value="Kidney">🫘 Kidney</option>
            <option value="Liver">🩺 Liver</option>
            <option value="Eye">👁️ Eye (Cornea)</option>
            <option value="Blood">🩸 Blood Donation</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">Filter by Blood Group</label>
          <select 
            value={selectedBloodGroup}
            onChange={(e) => setSelectedBloodGroup(e.target.value)}
            className="w-full p-2.5 border rounded-lg text-xs bg-gray-50 font-bold"
          >
            <option value="All">All Blood Groups</option>
            <option value="O+">O+</option>
            <option value="B+">B+</option>
            <option value="A+">A+</option>
            <option value="AB+">AB+</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">Search Location Grid</label>
          <input 
            type="text" 
            value={searchLocation}
            onChange={(e) => setSearchLocation(e.target.value)}
            className="w-full p-2.5 border rounded-lg text-xs bg-gray-50 font-bold"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT 2 COLUMNS: Matching Donors & Nearest Centers */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Donors & Deceased Registries */}
          <div className="space-y-4">
            <h3 className="text-md font-bold text-gray-800 flex items-center gap-2">
              <span>🧑‍🤝‍🧑</span> Available Donors & Pledged Registries (Living & Deceased)
            </h3>

            {filteredDonors.length > 0 ? (
              filteredDonors.map((donor) => (
                <div key={donor.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-black text-gray-900 text-sm">{donor.name}</h4>
                      <p className="text-xs text-gray-500">{donor.location}</p>
                      <span className="inline-block mt-1 bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold px-2 py-0.5 rounded">
                        {donor.govSupportBadge}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="bg-red-100 text-red-800 text-xs font-black px-2.5 py-1 rounded-full">
                        {donor.bloodGroup}
                      </span>
                      <p className="text-[10px] font-bold text-gray-500 mt-1">{donor.donorType}</p>
                    </div>
                  </div>

                  {/* Organs Listed */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {donor.organs.map((org, i) => (
                      <span key={i} className="bg-gray-100 text-gray-800 text-[10px] font-bold px-2 py-0.5 rounded">
                        {org === 'Blood' ? '🩸 Blood' : org === 'Eye' ? '👁️ Eye' : org === 'Kidney' ? '🫘 Kidney' : org === 'Liver' ? '🩺 Liver' : '❤️ Heart'}
                      </span>
                    ))}
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="text-xs font-bold text-green-700">● {donor.status}</span>
                    <a 
                      href={`tel:${donor.contact}`}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded-lg text-xs font-bold shadow transition-transform active:scale-95"
                    >
                      📞 Contact: {donor.contact}
                    </a>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 bg-gray-50 rounded-xl border border-dashed text-center text-gray-500 text-xs">
                No active donors found for this specific organ/blood group combination. Register your requirement below to get automated alerts!
              </div>
            )}
          </div>

          {/* Nearest Donation Centers & Hospitals */}
          <div className="space-y-4">
            <h3 className="text-md font-bold text-gray-800 flex items-center gap-2">
              <span>🏥 Nearest Organ Donation Centers & Hospitals</span>
            </h3>

            <div className="space-y-4">
              {donationCenters.map((center) => (
                <div key={center.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 space-y-2">
                  <div className="flex justify-between items-start">
                    <h4 className="font-black text-gray-900 text-sm">{center.name}</h4>
                    <span className="text-xs font-black text-blue-700 bg-blue-100 px-2.5 py-1 rounded-full">
                      {center.distance}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-emerald-800 bg-emerald-50 p-2 rounded border border-emerald-100">
                    <strong>Inventory / Support:</strong> {center.bloodInventory}
                  </p>
                  <p className="text-[11px] text-gray-600">
                    <strong>Supported Organs:</strong> {center.supportedOrgans.join(', ')}
                  </p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">{center.govStatus}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Automated Acceptor Waiting List & Alert Trigger */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 sticky top-6">
            <h3 className="text-md font-black text-gray-900 border-b pb-3 mb-3">
              🔔 Acceptor Waiting List & Auto-Alert
            </h3>
            <p className="text-xs text-gray-600 mb-4">
              If an exact organ or blood group match is not currently present, register here. Our system will <strong>automatically send an SMS/WhatsApp reminder</strong> to you the moment a donor matches your requirement!
            </p>

            {!requestSubmitted ? (
              <form onSubmit={handleRegisterRequest} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Patient / Acceptor Name</label>
                  <input 
                    type="text" 
                    required
                    value={acceptorForm.name}
                    onChange={(e) => setAcceptorForm({...acceptorForm, name: e.target.value})}
                    placeholder="e.g. sukimar Das"
                    className="w-full p-2.5 border rounded-lg text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Organ / Blood Needed</label>
                    <select 
                      value={acceptorForm.organNeeded}
                      onChange={(e) => setAcceptorForm({...acceptorForm, organNeeded: e.target.value})}
                      className="w-full p-2.5 border rounded-lg text-xs bg-white font-bold"
                    >
                      <option value="Kidney">Kidney</option>
                      <option value="Liver">Liver</option>
                      <option value="Heart">Heart</option>
                      <option value="Eye">Eye (Cornea)</option>
                      <option value="Blood">Blood</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Blood Group</label>
                    <select 
                      value={acceptorForm.bloodGroup}
                      onChange={(e) => setAcceptorForm({...acceptorForm, bloodGroup: e.target.value})}
                      className="w-full p-2.5 border rounded-lg text-xs bg-white font-bold"
                    >
                      <option value="O+">O+</option>
                      <option value="B+">B+</option>
                      <option value="A+">A+</option>
                      <option value="AB+">AB+</option>
                      <option value="O-">O-</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Contact Phone (For SMS Alerts)</label>
                  <input 
                    type="tel" 
                    required
                    value={acceptorForm.phone}
                    onChange={(e) => setAcceptorForm({...acceptorForm, phone: e.target.value})}
                    placeholder="+91 98765 43210"
                    className="w-full p-2.5 border rounded-lg text-xs"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full mt-2 bg-red-600 hover:bg-red-700 text-white font-black py-2.5 rounded-lg text-xs shadow transition-transform active:scale-95"
                >
                  Register & Enable Auto-Alerts 📲
                </button>
              </form>
            ) : (
              <div className="p-4 bg-green-50 rounded-lg border border-green-200 text-center space-y-2 animate-fade-in">
                <span className="text-2xl">✅</span>
                <h4 className="font-bold text-green-900 text-sm">Successfully Registered!</h4>
                <p className="text-xs text-green-700">
                  We have logged your requirement for <strong>{acceptorForm.organNeeded} ({acceptorForm.bloodGroup})</strong>. You will receive an automated SMS/WhatsApp ping at <strong>{acceptorForm.phone}</strong> the moment a matching donor or hospital inventory becomes available.
                </p>
                <button 
                  onClick={() => setRequestSubmitted(false)}
                  className="mt-2 text-xs font-bold text-blue-600 underline"
                >
                  Register Another Request
                </button>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}