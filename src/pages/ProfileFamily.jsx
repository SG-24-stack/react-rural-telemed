import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../constants/api';

export default function ProfileFamily({ setCurrentPage }) {
  const { user } = useContext(AuthContext);

  const [familyMembers, setFamilyMembers] = useState([
    {
      id: 'mock-1',
      name: 'Ananya Sharma',
      relation: 'Self',
      dob: '1990-05-12',
      scheme: 'PM-JAY Linked',
      medicalHistory: [
        {
          id: 'mh-1',
          disease: 'Acute Bronchitis',
          date: '2026-02-10',
          medicines: 'Salbutamol Inhaler, Paracetamol',
          suggestions: 'Avoid cold beverages and dusty environments.',
          nextSteps: 'Follow-up in 7 days',
          prescriptionFile: null
        }
      ]
    }
  ]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState('');

  // Add-member form state
  const [newName, setNewName] = useState('');
  const [newRelation, setNewRelation] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  // Edit-member state
  const [editingMemberId, setEditingMemberId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editRelation, setEditRelation] = useState('');
  const [editDob, setEditDob] = useState('');
  const [editScheme, setEditScheme] = useState('');
  const [editMsg, setEditMsg] = useState('');
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  // Add Medical Record form state
  const [showAddRecord, setShowAddRecord] = useState(false);
  const [newDisease, setNewDisease] = useState('');
  const [newMedicines, setNewMedicines] = useState('');
  const [newSuggestions, setNewSuggestions] = useState('');
  const [newNextSteps, setNewNextSteps] = useState('');
  const [newPrescriptionName, setNewPrescriptionName] = useState('');

  const isEditing = editingMemberId !== null;

  useEffect(() => {
    const fetchRoster = async () => {
      setIsLoading(true);
      try {
        if (!user?.id) {
          setSelectedMember(familyMembers[0]);
          setIsLoading(false);
          return;
        }

        const res = await api.get(`/family/${user.id}`);
        if (res.data && res.data.length > 0) {
          setFamilyMembers(res.data);
          setSelectedMember(res.data[0]);
        } else {
          setSelectedMember(familyMembers[0]);
        }
      } catch (err) {
        console.warn('Backend roster fetch failed, using local fallback state.');
        if (familyMembers.length > 0 && !selectedMember) {
          setSelectedMember(familyMembers[0]);
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchRoster();
  }, [user?.id]);

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!newName) return;

    setIsAdding(true);
    const newMemberPayload = {
      id: 'fam-' + Date.now(),
      owner_user_id: user?.id || 'local-user',
      name: newName,
      relation: newRelation || 'Dependent',
      dob: '',
      scheme: 'General Roster',
      medicalHistory: []
    };

    try {
      const res = await api.post('/family', {
        owner_user_id: user?.id,
        name: newName,
        relation: newRelation || 'Dependent'
      });
      const addedMember = res.data.member || newMemberPayload;
      setFamilyMembers((prev) => [...prev, addedMember]);
      setSelectedMember(addedMember);
    } catch (err) {
      setFamilyMembers((prev) => [...prev, newMemberPayload]);
      setSelectedMember(newMemberPayload);
    } finally {
      setNewName('');
      setNewRelation('');
      setIsAdding(false);
    }
  };

  const handleStartEdit = (member, e) => {
    if (e) e.stopPropagation();
    setEditingMemberId(member.id);
    setEditName(member.name);
    setEditRelation(member.relation || '');
    setEditDob(member.dob ? member.dob.split('T')[0] : '');
    setEditScheme(member.scheme || '');
    setEditMsg('');
    setSelectedMember(member);
  };

  const handleCancelEdit = () => {
    setEditingMemberId(null);
    setEditName('');
    setEditRelation('');
    setEditDob('');
    setEditScheme('');
    setEditMsg('');
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editName) return;

    setIsSavingEdit(true);
    try {
      await api.put(`/family/${editingMemberId}`, {
        name: editName,
        relation: editRelation,
        dob: editDob || null,
        scheme: editScheme
      });
    } catch (err) {
      console.warn('Backend update failed, updating locally.');
    }

    const updatedMembers = familyMembers.map((m) =>
      m.id === editingMemberId
        ? { ...m, name: editName, relation: editRelation, dob: editDob, scheme: editScheme }
        : m
    );

    setFamilyMembers(updatedMembers);
    const updatedCurrent = updatedMembers.find((m) => m.id === editingMemberId);
    if (updatedCurrent) setSelectedMember(updatedCurrent);

    setEditMsg('Member details updated!');
    setTimeout(() => {
      setEditMsg('');
      setEditingMemberId(null);
      setIsSavingEdit(false);
    }, 1000);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewPrescriptionName(file.name);
    }
  };

  const handleAddMedicalRecord = (e) => {
    e.preventDefault();
    if (!newDisease || !selectedMember) return;

    const newRecord = {
      id: 'mh-' + Date.now(),
      disease: newDisease,
      date: new Date().toISOString().split('T')[0],
      medicines: newMedicines || 'None specified',
      suggestions: newSuggestions || 'None specified',
      nextSteps: newNextSteps || 'General monitoring',
      prescriptionFile: newPrescriptionName || null
    };

    const updatedMembers = familyMembers.map((m) => {
      if (m.id === selectedMember.id) {
        const history = m.medicalHistory ? [newRecord, ...m.medicalHistory] : [newRecord];
        return { ...m, medicalHistory: history };
      }
      return m;
    });

    setFamilyMembers(updatedMembers);
    const updatedSelected = updatedMembers.find((m) => m.id === selectedMember.id);
    setSelectedMember(updatedSelected);

    // Reset form & close modal/view
    setNewDisease('');
    setNewMedicines('');
    setNewSuggestions('');
    setNewNextSteps('');
    setNewPrescriptionName('');
    setShowAddRecord(false);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto mt-4 space-y-6 animate-fade-in font-sans">

      {/* Header */}
      <div className="bg-emerald-700 text-white p-6 rounded-2xl shadow-lg flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black">👥 My Profile & Family Health Roster</h1>
          <p className="text-xs text-emerald-100 mt-1">Person-wise medical records, case history, online treatments, doctor prescriptions, and care plans.</p>
        </div>
        <button
          onClick={() => setCurrentPage('dashboard')}
          className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow cursor-pointer"
        >
          ← Back to Dashboard
        </button>
      </div>

      {loadError && (
        <div className="p-3 bg-red-50 text-red-700 rounded-xl border border-red-200 text-xs font-bold">
          {loadError}
        </div>
      )}

      {isLoading ? (
        <div className="py-16 text-center text-gray-400 text-xs">Loading your family roster...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Left Column: Add/Edit Member & List */}
          <div className="space-y-4">

            {!isEditing ? (
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 space-y-3">
                <h3 className="font-black text-gray-800 text-sm border-b pb-2">➕ Add Household Member</h3>
                <form onSubmit={handleAddMember} className="space-y-3 text-xs">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      placeholder="Member Name"
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none font-medium text-gray-900"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Relation</label>
                    <input
                      type="text"
                      value={newRelation}
                      onChange={(e) => setNewRelation(e.target.value)}
                      placeholder="Sibling, Parent, Spouse..."
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none font-medium text-gray-900"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isAdding}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 disabled:cursor-not-allowed text-white py-2.5 rounded-xl font-bold shadow cursor-pointer"
                  >
                    {isAdding ? 'Adding...' : 'Add to Family Roster'}
                  </button>
                </form>
              </div>
            ) : (
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-emerald-300 ring-2 ring-emerald-100 space-y-3">
                <h3 className="font-black text-gray-800 text-sm border-b pb-2">✏️ Edit Household Member</h3>
                <form onSubmit={handleSaveEdit} className="space-y-3 text-xs">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder="Member Name"
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none font-medium text-gray-900"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Relation</label>
                    <input
                      type="text"
                      value={editRelation}
                      onChange={(e) => setEditRelation(e.target.value)}
                      placeholder="Sibling, Parent, Spouse..."
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none font-medium text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Date of Birth</label>
                    <input
                      type="date"
                      value={editDob}
                      onChange={(e) => setEditDob(e.target.value)}
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none font-medium text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Scheme / Identifier</label>
                    <input
                      type="text"
                      value={editScheme}
                      onChange={(e) => setEditScheme(e.target.value)}
                      placeholder="e.g. PM-JAY Linked"
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none font-medium text-gray-900"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-xl font-bold cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSavingEdit}
                      className="flex-[2] bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 disabled:cursor-not-allowed text-white py-2.5 rounded-xl font-bold shadow cursor-pointer"
                    >
                      {isSavingEdit ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                  {editMsg && <p className="text-emerald-600 font-bold text-center">{editMsg}</p>}
                </form>
              </div>
            )}

            {/* Member Selection List */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 space-y-3">
              <h3 className="font-black text-gray-800 text-sm border-b pb-2">🏡 Select Member Profile</h3>
              <div className="space-y-2">
                {familyMembers.length === 0 ? (
                  <p className="text-xs text-gray-400 py-4 text-center">
                    No family members yet. Add your first household member above.
                  </p>
                ) : (
                  familyMembers.map((member) => (
                    <div
                      key={member.id}
                      onClick={() => { setSelectedMember(member); setShowAddRecord(false); }}
                      className={`p-3 rounded-xl border cursor-pointer transition-all text-xs flex justify-between items-center gap-2 ${selectedMember?.id === member.id ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-100' : 'bg-gray-50 border-gray-200 hover:border-gray-300'}`}
                    >
                      <div className="min-w-0">
                        <p className="font-black text-gray-900 truncate">{member.name}</p>
                        <p className="text-[10px] text-gray-500 truncate">{member.relation} &bull; {member.scheme || 'General'}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={(e) => handleStartEdit(member, e)}
                          title="Edit member details"
                          className="text-[10px] font-bold text-emerald-700 bg-emerald-100 hover:bg-emerald-200 px-2.5 py-1 rounded-lg cursor-pointer"
                        >
                          ✏️ Edit
                        </button>
                        <span className="text-emerald-700 font-bold text-sm">→</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>

          {/* Right 2 Columns: Individual Case History & Medical Records */}
          <div className="md:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-200 space-y-6">
            {selectedMember ? (
              <div className="space-y-5 animate-fade-in">
                <div className="border-b pb-4 flex justify-between items-start">
                  <div>
                    <span className="text-xs font-black text-emerald-600 uppercase tracking-wider">{selectedMember.relation}</span>
                    <h2 className="text-2xl font-black text-gray-900 mt-0.5">{selectedMember.name}</h2>
                    <p className="text-xs text-gray-500 mt-0.5">
                      DOB: {selectedMember.dob ? selectedMember.dob.split('T')[0] : 'Not set'} | Identifier: {selectedMember.scheme || 'General'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowAddRecord(!showAddRecord)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow cursor-pointer transition-all"
                    >
                      {showAddRecord ? '✕ Close Form' : '+ Add Medical Record'}
                    </button>
                  </div>
                </div>

                {/* Add Medical Record Form Toggle Window */}
                {showAddRecord && (
                  <div className="p-5 bg-emerald-50/60 border border-emerald-200 rounded-2xl space-y-4 animate-fade-in">
                    <h3 className="text-xs font-black text-emerald-900 uppercase tracking-wider">📝 Add New Case & Treatment Record</h3>
                    <form onSubmit={handleAddMedicalRecord} className="space-y-3 text-xs">
                      <div>
                        <label className="block font-bold text-gray-700 mb-1">Disease / Condition Description *</label>
                        <input
                          type="text"
                          value={newDisease}
                          onChange={(e) => setNewDisease(e.target.value)}
                          placeholder="e.g. Acute Asthma Flare-up or Fever"
                          className="w-full p-2.5 bg-white border border-gray-300 rounded-xl outline-none font-medium text-gray-900"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block font-bold text-gray-700 mb-1">Medicine Dosages</label>
                          <input
                            type="text"
                            value={newMedicines}
                            onChange={(e) => setNewMedicines(e.target.value)}
                            placeholder="e.g. Paracetamol 500mg (BID)"
                            className="w-full p-2.5 bg-white border border-gray-300 rounded-xl outline-none font-medium text-gray-900"
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-gray-700 mb-1">Doctor Suggestions</label>
                          <input
                            type="text"
                            value={newSuggestions}
                            onChange={(e) => setNewSuggestions(e.target.value)}
                            placeholder="e.g. Rest, hydration, avoid cold foods"
                            className="w-full p-2.5 bg-white border border-gray-300 rounded-xl outline-none font-medium text-gray-900"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block font-bold text-gray-700 mb-1">Next Step of Treatment</label>
                          <input
                            type="text"
                            value={newNextSteps}
                            onChange={(e) => setNewNextSteps(e.target.value)}
                            placeholder="e.g. Follow-up blood test in 3 days"
                            className="w-full p-2.5 bg-white border border-gray-300 rounded-xl outline-none font-medium text-gray-900"
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-gray-700 mb-1">Upload Prescription / Report</label>
                          <div className="flex items-center gap-2">
                            <label className="flex-1 bg-white border border-dashed border-emerald-400 hover:bg-emerald-50 text-emerald-700 font-bold p-2 rounded-xl text-center cursor-pointer truncate">
                              📁 {newPrescriptionName ? newPrescriptionName : 'Choose file...'}
                              <input type="file" onChange={handleFileUpload} className="hidden" />
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setShowAddRecord(false)}
                          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-bold cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow cursor-pointer"
                        >
                          Save Record
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                <div>
                  <h3 className="text-sm font-black text-gray-800 mb-3">📋 Person-Wise Medical Case History & Treatments</h3>
                  <div className="space-y-4">
                    {selectedMember.medicalHistory && selectedMember.medicalHistory.length > 0 ? (
                      selectedMember.medicalHistory.map((record, index) => (
                        <div key={record.id || index} className="p-4 bg-gray-50 border border-gray-200 rounded-2xl space-y-3 text-xs">
                          <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                            <span className="font-black text-emerald-800">🩺 Disease Treated: {record.disease}</span>
                            <span className="text-gray-500 font-bold">📅 {record.date ? record.date.split('T')[0] : ''}</span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="p-3 bg-white rounded-xl border border-gray-100 shadow-sm">
                              <p className="font-bold text-gray-700 mb-1">💊 Prescribed Medicines & Dosages:</p>
                              <p className="text-gray-900 font-medium">{record.medicines}</p>
                            </div>
                            <div className="p-3 bg-white rounded-xl border border-gray-100 shadow-sm">
                              <p className="font-bold text-gray-700 mb-1">💡 Doctor Suggestions:</p>
                              <p className="text-gray-900 font-medium">{record.suggestions}</p>
                            </div>
                          </div>

                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 bg-emerald-50/60 rounded-xl border border-emerald-100 gap-2">
                            <span className="font-bold text-emerald-900">⏭️ Next Step of Treatment: <span className="font-black text-emerald-700">{record.nextSteps}</span></span>
                            {record.prescriptionFile && (
                              <span className="bg-emerald-200 text-emerald-900 font-bold px-3 py-1 rounded-lg text-[10px] truncate max-w-[200px]">
                                📄 {record.prescriptionFile}
                              </span>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-gray-400 py-4 text-center">No medical history recorded yet for this family member. Click "+ Add Medical Record" above to add one.</p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-20 text-center text-gray-400">Select a family member from the left to view their complete health record.</div>
            )}
          </div>

        </div>
      )}
    </div>
  );
}