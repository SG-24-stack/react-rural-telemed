import React, { useState } from 'react';

export default function FamilyProfileDashboard({ setCurrentPage }) {
  // Family members state with individual health records
  const [familyMembers, setFamilyMembers] = useState([
    {
      id: 1,
      name: 'fikon Chandra',
      relation: 'Self',
      age: 22,
      bloodGroup: 'O+',
      history: 'Mild seasonal allergies, occasional gastric issues',
      treatments: [
        { date: '2026-06-12', condition: 'High Fever & Viral Infection', mode: 'Online Tele-consultation', doctor: 'Dr. Ananya Roy' }
      ],
      prescriptions: ['Paracetamol 650mg', 'ORS Hydration Pack'],
      suggestions: 'Maintain hydration, avoid oily food, complete 5-day course.',
      nextStep: 'Follow-up consultation scheduled for Aug 25, 2026.'
    },
    {
      id: 2,
      name: 'Sandhya Chandra',
      relation: 'Mother',
      age: 48,
      bloodGroup: 'B+',
      history: 'Type 2 Diabetes, Joint pain',
      treatments: [
        { date: '2026-05-10', condition: 'Joint Arthritis Checkup', mode: 'Online Tele-consultation', doctor: 'Dr. Rajesh Ghosh' }
      ],
      prescriptions: ['Metformin 500mg', 'Calcium Supplements'],
      suggestions: 'Daily 30-minute light walking, monitor blood sugar levels bi-weekly.',
      nextStep: 'Blood sugar lab report review on Sep 02, 2026.'
    }
  ]);

  const [selectedMemberId, setSelectedMemberId] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  
  // New member form state
  const [newName, setNewName] = useState('');
  const [newRelation, setNewRelation] = useState('');
  const [newAge, setNewAge] = useState('');
  const [newHistory, setNewHistory] = useState('');

  const activeMember = familyMembers.find(m => m.id === selectedMemberId) || familyMembers[0];

  const handleAddMember = (e) => {
    e.preventDefault();
    if (!newName) return;
    const newMemberObj = {
      id: Date.now(),
      name: newName,
      relation: newRelation || 'Member',
      age: newAge || 'N/A',
      bloodGroup: 'Unknown',
      history: newHistory || 'No prior history recorded.',
      treatments: [],
      prescriptions: ['None recorded yet'],
      suggestions: 'Awaiting initial doctor evaluation.',
      nextStep: 'Book first tele-consultation.'
    };
    setFamilyMembers([...familyMembers, newMemberObj]);
    setSelectedMemberId(newMemberObj.id);
    setNewName('');
    setNewRelation('');
    setNewAge('');
    setNewHistory('');
    setShowAddModal(false);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto mt-2 space-y-6">
      
      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-center bg-white/90 backdrop-blur p-4 rounded-xl shadow-sm border border-gray-200 gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-800">👤 My Profile & Family Health Vault</h1>
          <p className="text-xs text-gray-500">Manage individual family profiles, case histories, and treatment tracking person-wise.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-bold text-xs shadow transition-transform active:scale-95"
          >
            + Add Family Member
          </button>
          <button 
            onClick={() => setCurrentPage('dashboard')} 
            className="text-sm font-bold text-gray-600 hover:text-gray-900 underline px-2"
          >
            &larr; Back to Dashboard
          </button>
        </div>
      </header>

      {/* Member Selector Bar */}
      <div className="flex gap-3 overflow-x-auto pb-2">
        {familyMembers.map((member) => (
          <button
            key={member.id}
            onClick={() => setSelectedMemberId(member.id)}
            className={`flex items-center gap-3 px-5 py-3 rounded-xl font-bold text-xs shadow-sm transition-all border whitespace-nowrap ${selectedMemberId === member.id ? 'bg-green-600 text-white border-green-700 shadow-md' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'}`}
          >
            <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm">
              {member.relation === 'Self' ? '🧑' : '👤'}
            </span>
            <div className="text-left">
              <p className="font-black text-sm">{member.name}</p>
              <p className={`text-[10px] ${selectedMemberId === member.id ? 'text-green-100' : 'text-gray-500'}`}>{member.relation} • {member.age} yrs</p>
            </div>
          </button>
        ))}
      </div>

      {/* Add Member Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-gray-200 animate-fade-in">
            <h3 className="text-lg font-black text-gray-800 mb-4">Add New Family Member Profile</h3>
            <form onSubmit={handleAddMember} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Full Name</label>
                <input 
                  type="text" 
                  value={newName} 
                  onChange={(e) => setNewName(e.target.value)} 
                  placeholder="e.g. Rahul Chandra" 
                  required
                  className="w-full p-2.5 border rounded-lg text-xs focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Relation</label>
                  <input 
                    type="text" 
                    value={newRelation} 
                    onChange={(e) => setNewRelation(e.target.value)} 
                    placeholder="e.g. Father / Brother" 
                    className="w-full p-2.5 border rounded-lg text-xs focus:ring-2 focus:ring-green-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Age</label>
                  <input 
                    type="number" 
                    value={newAge} 
                    onChange={(e) => setNewAge(e.target.value)} 
                    placeholder="e.g. 50" 
                    className="w-full p-2.5 border rounded-lg text-xs focus:ring-2 focus:ring-green-500 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Medical Background / History</label>
                <textarea 
                  value={newHistory} 
                  onChange={(e) => setNewHistory(e.target.value)} 
                  placeholder="Any chronic illness or allergies..." 
                  className="w-full p-2.5 border rounded-lg text-xs focus:ring-2 focus:ring-green-500 outline-none h-20"
                ></textarea>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 text-xs font-bold rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white text-xs font-bold rounded-lg hover:bg-green-700 shadow"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Active Member Individual Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Profile Summary & Background Record */}
        <div className="space-y-6">
          <div className="bg-white/90 backdrop-blur p-6 rounded-xl shadow-sm border border-gray-200 text-center relative overflow-hidden">
            <div className="w-20 h-20 bg-green-100 text-green-700 text-3xl rounded-full flex items-center justify-center mx-auto mb-3 shadow-inner border-2 border-green-300">
              👤
            </div>
            <h2 className="text-xl font-black text-gray-900">{activeMember.name}</h2>
            <p className="text-xs font-bold text-green-600 uppercase tracking-wide mt-0.5">{activeMember.relation} • Age: {activeMember.age}</p>
            
            <div className="mt-4 pt-4 border-t text-left space-y-2 text-xs">
              <p><strong className="text-gray-700">Blood Group:</strong> {activeMember.bloodGroup}</p>
              <p><strong className="text-gray-700">Medical Background:</strong> {activeMember.history}</p>
            </div>
          </div>

          {/* Next Treatment Step Card */}
          <div className="bg-gradient-to-br from-emerald-600 to-green-800 p-6 rounded-xl shadow-md text-white">
            <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-200 mb-1">⚡ Next Treatment Step</h3>
            <p className="text-sm font-medium mt-2 bg-white/10 p-3 rounded-lg border border-emerald-400/30">
              {activeMember.nextStep}
            </p>
          </div>
        </div>

        {/* Right Column: Case History, Online Treatments, Prescriptions & Suggestions */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Online Treatments & Case History */}
          <div className="bg-white/90 backdrop-blur p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-md font-bold text-gray-800 border-b pb-3 mb-4 flex items-center gap-2">
              📋 Online Treatment & Case History
            </h3>
            {activeMember.treatments.length > 0 ? (
              <div className="space-y-3">
                {activeMember.treatments.map((tr, idx) => (
                  <div key={idx} className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-xs space-y-1">
                    <div className="flex justify-between items-center font-bold text-gray-900">
                      <span>{tr.condition}</span>
                      <span className="text-green-700 bg-green-100 px-2.5 py-0.5 rounded-full text-[10px]">{tr.mode}</span>
                    </div>
                    <p className="text-gray-600">Attending Physician: <strong>{tr.doctor}</strong></p>
                    <p className="text-gray-400 text-[10px]">Date Recorded: {tr.date}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-500 italic py-4">No online treatment records found for this member yet.</p>
            )}
          </div>

          {/* Prescribed Medicines & Doctor Suggestions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Prescriptions */}
            <div className="bg-white/90 backdrop-blur p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col justify-between">
              <div>
                <h3 className="text-md font-bold text-gray-800 border-b pb-3 mb-3 flex items-center gap-2">
                  💊 Prescribed Medicines
                </h3>
                <ul className="space-y-2">
                  {activeMember.prescriptions.map((med, idx) => (
                    <li key={idx} className="text-xs bg-green-50 text-green-900 p-2.5 rounded-lg border border-green-200 font-semibold flex items-center gap-2">
                      <span>•</span> {med}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Doctor Suggestions */}
            <div className="bg-white/90 backdrop-blur p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col justify-between">
              <div>
                <h3 className="text-md font-bold text-gray-800 border-b pb-3 mb-3 flex items-center gap-2">
                  💡 Doctor Suggestions & Care Guidelines
                </h3>
                <p className="text-xs text-gray-700 bg-blue-50/50 p-3 rounded-lg border border-blue-100 leading-relaxed font-medium">
                  "{activeMember.suggestions}"
                </p>
              </div>
            </div>

          </div>

        </div>

      </div><h1></h1>
    </div>
  );
}