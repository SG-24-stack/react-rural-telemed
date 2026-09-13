import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../constants/api';

export default function ProfileFamily({ setCurrentPage }) {
  const { user } = useContext(AuthContext);

  const [familyMembers, setFamilyMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
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

  const isEditing = editingMemberId !== null;

  // Fetch the real roster from Postgres on load
  useEffect(() => {
    const fetchRoster = async () => {
      if (!user?.id) {
        setLoadError('Please log in again to view your family roster.');
        setIsLoading(false);
        return;
      }
      try {
        const res = await api.get(`/family/${user.id}`);
        setFamilyMembers(res.data);
        if (res.data.length > 0) {
          setSelectedMember(res.data[0]);
        }
      } catch (err) {
        setLoadError('Could not load your family roster. Please refresh and try again.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchRoster();
  }, [user?.id]);

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!newName || !user?.id) return;

    setIsAdding(true);
    try {
      const res = await api.post('/family', {
        owner_user_id: user.id,
        name: newName,
        relation: newRelation || 'Dependent'
      });

      const addedMember = res.data.member;
      setFamilyMembers((prev) => [...prev, addedMember]);
      setSelectedMember(addedMember);
      setNewName('');
      setNewRelation('');
    } catch (err) {
      setLoadError('Could not add family member. Please try again.');
      setTimeout(() => setLoadError(''), 3500);
    } finally {
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
      const res = await api.put(`/family/${editingMemberId}`, {
        name: editName,
        relation: editRelation,
        dob: editDob || null,
        scheme: editScheme
      });

      const updatedMember = res.data.member;

      setFamilyMembers((prev) =>
        prev.map((m) =>
          m.id === editingMemberId ? { ...updatedMember, medicalHistory: m.medicalHistory } : m
        )
      );
      setSelectedMember((prev) => ({ ...updatedMember, medicalHistory: prev.medicalHistory }));

      setEditMsg('Member details updated!');
      setTimeout(() => {
        setEditMsg('');
        setEditingMemberId(null);
      }, 1200);
    } catch (err) {
      setEditMsg('⚠ Could not save changes. Please try again.');
    } finally {
      setIsSavingEdit(false);
    }
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
          className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow"
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
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none font-medium"
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
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none font-medium"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isAdding}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 disabled:cursor-not-allowed text-white py-2.5 rounded-xl font-bold shadow"
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
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none font-medium"
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
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none font-medium"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Date of Birth</label>
                    <input
                      type="date"
                      value={editDob}
                      onChange={(e) => setEditDob(e.target.value)}
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none font-medium"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Scheme / Identifier</label>
                    <input
                      type="text"
                      value={editScheme}
                      onChange={(e) => setEditScheme(e.target.value)}
                      placeholder="e.g. PM-JAY Linked"
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none font-medium"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-xl font-bold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSavingEdit}
                      className="flex-[2] bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 disabled:cursor-not-allowed text-white py-2.5 rounded-xl font-bold shadow"
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
                      onClick={() => setSelectedMember(member)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all text-xs flex justify-between items-center gap-2 ${selectedMember?.id === member.id ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-100' : 'bg-gray-50 border-gray-200 hover:border-gray-300'}`}
                    >
                      <div className="min-w-0">
                        <p className="font-black text-gray-900 truncate">{member.name}</p>
                        <p className="text-[10px] text-gray-500 truncate">{member.relation} &bull; {member.scheme}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={(e) => handleStartEdit(member, e)}
                          title="Edit member details"
                          className="text-[10px] font-bold text-emerald-700 bg-emerald-100 hover:bg-emerald-200 px-2.5 py-1 rounded-lg"
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
                      DOB: {selectedMember.dob ? selectedMember.dob.split('T')[0] : 'Not set'} | Identifier: {selectedMember.scheme}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => handleStartEdit(selectedMember, e)}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-black px-3 py-1.5 rounded-full"
                    >
                      ✏️ Edit
                    </button>
                    <span className="bg-emerald-100 text-emerald-800 text-xs font-black px-3 py-1 rounded-full">
                      Active Roster
                    </span>
                  </div>
                </div>

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
                              <p className="font-bold text-gray-700 mb-1">💊 Prescribed Medicines:</p>
                              <p className="text-gray-900 font-medium">{record.medicines}</p>
                            </div>
                            <div className="p-3 bg-white rounded-xl border border-gray-100 shadow-sm">
                              <p className="font-bold text-gray-700 mb-1">💡 Doctor Suggestions:</p>
                              <p className="text-gray-900 font-medium">{record.suggestions}</p>
                            </div>
                          </div>

                          <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100 flex justify-between items-center">
                            <span className="font-bold text-emerald-900">⏭️ Next Step of Treatment:</span>
                            <span className="font-black text-emerald-700">{record.nextSteps}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-gray-400 py-4 text-center">No medical history recorded yet.</p>
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
