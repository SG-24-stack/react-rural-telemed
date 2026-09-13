import React, { useState } from 'react';
import DoctorPortalBackground from '../components/DoctorPortalBackground';

export default function FeesAcceptance({ setCurrentPage }) {
  // State for consultation fee settings
  const [consultationFee, setConsultationFee] = useState('500');
  const [emergencyFee, setEmergencyFee] = useState('800');
  const [successMessage, setSuccessMessage] = useState('');

  // Sample transaction history
  const [transactions, setTransactions] = useState([
    { id: 'TXN-9842', patient: 'Amit Roy', type: 'Video Teleconsultation', amount: '₹500', date: '28 Aug 2026', status: 'Completed' },
    { id: 'TXN-9831', patient: 'Sunita Devi', type: 'Emergency Consultation', amount: '₹800', date: '26 Aug 2026', status: 'Completed' },
    { id: 'TXN-9810', patient: 'Rahul Sen', type: 'Follow-up Checkup', amount: '₹300', date: '24 Aug 2026', status: 'Completed' },
  ]);

  const handleSaveFees = (e) => {
    e.preventDefault();
    setSuccessMessage('Fee structure updated successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  return (
    <DoctorPortalBackground>
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Top Header & Navigation */}
      <div className="mb-6">
        <button 
          onClick={() => setCurrentPage('doctor-dashboard')}
          className="text-sm text-emerald-600 font-medium hover:underline mb-1 inline-block"
        >
          &larr; Back to Doctor Command Portal
        </button>
        <h1 className="text-2xl font-bold text-slate-800">Fees Acceptance & Financial Payouts</h1>
        <p className="text-slate-600 text-sm">Configure consultation charges, manage bank payout accounts, and review revenue logs.</p>
      </div>

      {successMessage && (
        <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-sm font-medium animate-fade-in">
          {successMessage}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Earnings Overview & Fee Configuration */}
        <div className="space-y-6">
          
          {/* Earnings Summary Card */}
          <div className="bg-gradient-to-br from-emerald-800 to-teal-900 rounded-2xl p-6 text-white shadow-md">
            <span className="text-xs uppercase tracking-wider text-emerald-200 font-semibold">Total Earnings (This Month)</span>
            <h2 className="text-3xl font-bold mt-1 mb-4">₹18,400</h2>
            <div className="flex justify-between items-center text-xs text-emerald-100 border-t border-emerald-700/60 pt-3">
              <span>Pending Payout: <strong>₹2,400</strong></span>
              <button 
                onClick={() => alert('Payout transfer requested successfully!')}
                className="bg-white text-emerald-900 font-bold px-3 py-1.5 rounded-lg hover:bg-emerald-50 transition shadow-sm"
              >
                Withdraw Now
              </button>
            </div>
          </div>

          {/* Fee Configuration Form */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <h3 className="font-bold text-slate-800 mb-4 text-base">Set Consultation Rates</h3>
            <form onSubmit={handleSaveFees} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Standard Teleconsultation Fee (₹)</label>
                <input
                  type="number"
                  value={consultationFee}
                  onChange={(e) => setConsultationFee(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Emergency / Priority Slot Fee (₹)</label>
                <input
                  type="number"
                  value={emergencyFee}
                  onChange={(e) => setEmergencyFee(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 rounded-lg text-sm transition shadow-sm"
              >
                Save Fee Structure
              </button>
            </form>
          </div>

        </div>

        {/* Right 2 Cols: Transaction & Payout Logs */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-slate-800 text-base">Recent Transaction History</h3>
              <span className="text-xs text-slate-400">Showing last 30 days</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 text-slate-700 uppercase text-[11px] font-semibold">
                  <tr>
                    <th className="p-3">TXN ID</th>
                    <th className="p-3">Patient</th>
                    <th className="p-3">Consultation Type</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Date</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {transactions.map((txn) => (
                    <tr key={txn.id} className="hover:bg-slate-50">
                      <td className="p-3 font-semibold text-slate-800">{txn.id}</td>
                      <td className="p-3">{txn.patient}</td>
                      <td className="p-3">{txn.type}</td>
                      <td className="p-3 font-bold text-emerald-700">{txn.amount}</td>
                      <td className="p-3 text-xs text-slate-500">{txn.date}</td>
                      <td className="p-3">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          {txn.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bank Account Verification Card */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h4 className="font-bold text-slate-800 text-sm">Payout Bank Account</h4>
              <p className="text-xs text-slate-500 mt-0.5">HDFC Bank • A/C Ending in **4092 (IFSC: HDFC0001234)</p>
            </div>
            <button 
              onClick={() => alert('Redirecting to secure bank account update portal...')}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium px-4 py-2 rounded-lg transition"
            >
              Update Bank Details
            </button>
          </div>
        </div>

      </div>
    </div>
    </DoctorPortalBackground>
  );
}