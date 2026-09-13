import React, { useState, useEffect } from 'react';

const API_BASE = '';

export default function AdminDashboard({ setCurrentPage }) {
  const [pendingDoctors, setPendingDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [rejectingId, setRejectingId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [toast, setToast] = useState(null);

  const fetchPendingDoctors = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/api/admin/doctors/pending`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to load pending verifications');
      const data = await response.json();
      setPendingDoctors(data);
    } catch (err) {
      console.error(err);
      setError('Could not load pending doctor verifications. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingDoctors();
  }, []);

  const showToast = (type, text) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 3000);
  };

  const updateDoctorStatus = async (doctorId, status, reason = null) => {
    setActionLoadingId(doctorId);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/api/admin/doctors/${doctorId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status, rejection_reason: reason })
      });
      if (!response.ok) throw new Error('Failed to update status');

      setPendingDoctors((prev) => prev.filter((d) => d.id !== doctorId));
      showToast('success', status === 'active' ? '✓ Doctor approved and activated.' : '✓ Registration rejected.');
    } catch (err) {
      console.error(err);
      showToast('error', 'Something went wrong updating this doctor\u2019s status.');
    } finally {
      setActionLoadingId(null);
      setRejectingId(null);
      setRejectionReason('');
    }
  };

  const handleApprove = (doctorId) => updateDoctorStatus(doctorId, 'active');

  const handleStartReject = (doctorId) => {
    setRejectingId(doctorId);
    setRejectionReason('');
  };

  const handleConfirmReject = (doctorId) => {
    updateDoctorStatus(doctorId, 'rejected', rejectionReason);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto mt-4 space-y-6 animate-fade-in font-sans">

      {/* Header */}
      <div className="bg-slate-800 text-white p-6 rounded-2xl shadow-lg flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black">🛡️ Admin Verification Portal</h1>
          <p className="text-xs text-slate-300 mt-1">Review and approve doctor registrations before they go live on the platform.</p>
        </div>
        <button
          onClick={() => setCurrentPage('dashboard')}
          className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow"
        >
          ← Back to Dashboard
        </button>
      </div>

      {/* Toast */}
      {toast && (
        <div className={`p-3 rounded-xl text-xs font-bold text-center shadow ${toast.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}`}>
          {toast.text}
        </div>
      )}

      {/* Pending Count Summary */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200 flex justify-between items-center">
        <p className="text-sm font-bold text-gray-700">
          {loading ? 'Loading pending verifications…' : `${pendingDoctors.length} doctor${pendingDoctors.length === 1 ? '' : 's'} awaiting verification`}
        </p>
        <button
          onClick={fetchPendingDoctors}
          className="bg-gray-50 hover:bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg text-xs font-bold border border-gray-200 transition-colors"
        >
          🔄 Refresh
        </button>
      </div>

      {/* Error state */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-sm text-red-700 font-medium">
          {error}
        </div>
      )}

      {/* Loading state */}
      {loading && !error && (
        <div className="py-16 text-center text-gray-400 text-sm">Loading…</div>
      )}

      {/* Empty state */}
      {!loading && !error && pendingDoctors.length === 0 && (
        <div className="py-16 text-center text-gray-400 bg-white rounded-2xl border border-gray-200 shadow-sm">
          <p className="text-4xl mb-2">✅</p>
          <p className="text-sm font-medium">No pending doctor verifications right now.</p>
        </div>
      )}

      {/* Pending Doctor Cards */}
      <div className="space-y-4">
        {pendingDoctors.map((doctor) => (
          <div key={doctor.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 space-y-4">

            <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-3 border-b border-gray-100 pb-4">
              <div>
                <span className="text-[10px] font-black text-amber-600 uppercase tracking-wider bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                  Pending Verification
                </span>
                <h2 className="text-lg font-black text-gray-900 mt-1.5">{doctor.full_name || 'Unnamed Doctor'}</h2>
                <p className="text-xs text-gray-500 mt-0.5">{doctor.email} {doctor.phone_number ? `\u2022 ${doctor.phone_number}` : ''}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                <p className="font-bold text-gray-500 uppercase text-[10px] mb-1">Specialty</p>
                <p className="text-gray-900 font-semibold">{doctor.specialty || '—'}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                <p className="font-bold text-gray-500 uppercase text-[10px] mb-1">Qualification</p>
                <p className="text-gray-900 font-semibold">{doctor.qualification || '—'}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                <p className="font-bold text-gray-500 uppercase text-[10px] mb-1">License Number</p>
                <p className="text-gray-900 font-semibold">{doctor.license_number || '—'}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                <p className="font-bold text-gray-500 uppercase text-[10px] mb-1">Medical Council</p>
                <p className="text-gray-900 font-semibold">{doctor.council || doctor.medical_council || '—'}</p>
              </div>
            </div>

            {(doctor.document_path || doctor.govt_document_url) && (
              <a
                href={doctor.govt_document_url || `${API_BASE}/${doctor.document_path}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 underline"
              >
                📄 View Submitted Government Document
              </a>
            )}

            {rejectingId === doctor.id ? (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl space-y-2">
                <label className="block text-xs font-bold text-red-700">Reason for rejection (optional, shown to the applicant)</label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  rows="2"
                  placeholder="e.g. License number could not be verified with the state council."
                  className="w-full p-2.5 bg-white border border-red-200 rounded-lg text-xs outline-none"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => handleConfirmReject(doctor.id)}
                    disabled={actionLoadingId === doctor.id}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-bold text-xs shadow disabled:opacity-50"
                  >
                    {actionLoadingId === doctor.id ? 'Rejecting...' : 'Confirm Rejection'}
                  </button>
                  <button
                    onClick={() => setRejectingId(null)}
                    className="flex-1 bg-white hover:bg-gray-100 text-gray-700 py-2 rounded-lg font-bold text-xs border border-gray-200"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => handleApprove(doctor.id)}
                  disabled={actionLoadingId === doctor.id}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl font-bold text-xs shadow transition-transform active:scale-95 disabled:opacity-50"
                >
                  {actionLoadingId === doctor.id ? 'Approving...' : '✓ Approve & Activate'}
                </button>
                <button
                  onClick={() => handleStartReject(doctor.id)}
                  disabled={actionLoadingId === doctor.id}
                  className="flex-1 bg-red-50 hover:bg-red-100 text-red-700 py-2.5 rounded-xl font-bold text-xs border border-red-200 transition-colors disabled:opacity-50"
                >
                  ✕ Reject
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}