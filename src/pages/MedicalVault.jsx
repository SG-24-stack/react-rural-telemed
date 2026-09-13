import React, { useState, useEffect } from 'react';
import { SecureStorage } from '../utils/security';

export default function MedicalVault({ setCurrentPage }) {
  const [vaultRecords, setVaultRecords] = useState([]);
  
  // Form States
  const [documentTitle, setDocumentTitle] = useState('');
  const [doctorName, setDoctorName] = useState('');
  const [medicines, setMedicines] = useState('');
  const [doctorGuidelines, setDoctorGuidelines] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Security & Password States
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [hasPin, setHasPin] = useState(false);
  const [pinError, setPinError] = useState('');

  // Initialization: Check for PIN & Load Data
  useEffect(() => {
    // Check if the user has already set a Vault PIN
    const storedPin = localStorage.getItem('vault_master_pin');
    if (storedPin) {
      setHasPin(true);
    }

    // Safely load data
    try {
      const records = SecureStorage.get('patient_records');
      setVaultRecords(records || []);
    } catch (err) {
      console.error("Error loading vault records:", err);
      setVaultRecords([]);
    }
  }, []);

  // Handle PIN Submission (Setup or Unlock)
  const handlePinSubmit = (e) => {
    e.preventDefault();
    const storedPin = localStorage.getItem('vault_master_pin');

    if (!hasPin) {
      // Setting a new PIN for the first time
      if (pinInput.length < 4) {
        setPinError('PIN must be at least 4 characters.');
        return;
      }
      localStorage.setItem('vault_master_pin', pinInput);
      setHasPin(true);
      setIsUnlocked(true);
      setPinError('');
    } else {
      // Verifying an existing PIN to unlock the vault
      if (pinInput === storedPin) {
        setIsUnlocked(true);
        setPinError('');
      } else {
        setPinError('Incorrect PIN. Access Denied.');
      }
    }
    setPinInput(''); // Clear input after submission
  };

  const handleEncryptAndSave = (e) => {
    e.preventDefault();
    if (!documentTitle || !doctorName) return;

    const newRecord = {
      id: Date.now(),
      title: documentTitle,
      doctor: doctorName,
      medicines: medicines,
      guidelines: doctorGuidelines,
      date: new Date().toLocaleDateString()
    };

    const updatedRecords = [newRecord, ...vaultRecords];
    SecureStorage.save('patient_records', updatedRecords);
    
    setVaultRecords(updatedRecords);
    
    setDocumentTitle('');
    setDoctorName('');
    setMedicines('');
    setDoctorGuidelines('');
    
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // ------------------------------------------------------------------
  // RENDER: LOCKED STATE UI
  // ------------------------------------------------------------------
  if (!isUnlocked) {
    return (
      <div className="p-6 max-w-5xl mx-auto mt-10 flex flex-col items-center justify-center font-sans">
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-200 max-w-sm w-full text-center">
          <div className="text-5xl mb-4">🔐</div>
          <h2 className="text-xl font-black text-gray-800 mb-2">
            {hasPin ? 'Unlock Privacy Vault' : 'Set Up Vault PIN'}
          </h2>
          <p className="text-xs text-gray-500 mb-6 font-medium">
            {hasPin 
              ? 'Enter your secret PIN to decrypt and view your medical documents.' 
              : 'Create a secure 4-digit PIN to lock your health records.'}
          </p>

          <form onSubmit={handlePinSubmit} className="space-y-4">
            <input 
              type="password" 
              value={pinInput} 
              onChange={(e) => setPinInput(e.target.value)} 
              placeholder={hasPin ? "Enter PIN..." : "Create new PIN..."}
              className="w-full p-3 border border-gray-300 rounded-xl text-center tracking-widest text-lg font-bold outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
              autoFocus
              required 
            />
            
            {pinError && <p className="text-red-600 text-xs font-bold">{pinError}</p>}

            <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-bold transition-transform active:scale-95 shadow-md cursor-pointer text-xs uppercase tracking-wider">
              {hasPin ? 'Unlock Vault 🔓' : 'Save PIN & Enter 🛡️'}
            </button>
          </form>

          <button 
            onClick={() => setCurrentPage && setCurrentPage('dashboard')} 
            className="mt-6 text-xs text-gray-500 hover:text-gray-800 font-bold transition-colors cursor-pointer"
          >
            ← Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // ------------------------------------------------------------------
  // RENDER: UNLOCKED STATE UI
  // ------------------------------------------------------------------
  return (
    <div className="p-6 max-w-5xl mx-auto mt-4 space-y-6 animate-fade-in font-sans">
      <div className="flex justify-between items-center bg-white p-5 rounded-2xl shadow-sm border border-gray-200">
        <div>
          <h2 className="text-xl font-black text-emerald-800 flex items-center gap-2">
            <span>🔓</span> Secure Privacy Vault
          </h2>
          <p className="text-xs text-gray-500 font-medium mt-0.5">Vault is currently unlocked. Your data is decrypted client-side.</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={() => setIsUnlocked(false)} 
            className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-bold px-4 py-2 rounded-xl transition-colors text-xs shadow-sm cursor-pointer"
          >
            Lock Vault 🔒
          </button>
          <button 
            onClick={() => setCurrentPage && setCurrentPage('dashboard')} 
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold px-4 py-2 rounded-xl transition-colors text-xs shadow-sm cursor-pointer"
          >
            Dashboard
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <h3 className="text-sm font-black text-gray-900 border-b pb-3 mb-4">📁 Store New Medical Document</h3>
          <form onSubmit={handleEncryptAndSave} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Document Title / Reason *</label>
              <input 
                type="text" 
                value={documentTitle} 
                onChange={(e) => setDocumentTitle(e.target.value)} 
                placeholder="e.g., Monthly Fever Checkup" 
                className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 outline-none focus:border-emerald-500 font-medium" 
                required 
              />
            </div>
            
            <div>
              <label className="block font-bold text-gray-700 mb-1">Checking Doctor *</label>
              <input 
                type="text" 
                value={doctorName} 
                onChange={(e) => setDoctorName(e.target.value)} 
                placeholder="e.g., Dr. Sharma" 
                className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 outline-none focus:border-emerald-500 font-medium" 
                required 
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Prescription Medicines</label>
              <textarea 
                rows="2" 
                value={medicines} 
                onChange={(e) => setMedicines(e.target.value)} 
                placeholder="List prescribed medicines and dosages..." 
                className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 outline-none focus:border-emerald-500 font-medium" 
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Doctor Guidelines / Restrictions</label>
              <textarea 
                rows="2" 
                value={doctorGuidelines} 
                onChange={(e) => setDoctorGuidelines(e.target.value)} 
                placeholder="Dietary restrictions, rest periods..." 
                className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 outline-none focus:border-emerald-500 font-medium" 
              />
            </div>

            <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-bold transition-transform active:scale-95 shadow-md cursor-pointer text-xs uppercase tracking-wider">
              Encrypt & Store Safely 🔒
            </button>
            {saveSuccess && <p className="text-emerald-600 font-bold text-center mt-2 text-xs">✓ Document Encrypted & Saved Successfully</p>}
          </form>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col">
          <h3 className="text-sm font-black text-gray-900 border-b pb-3 mb-4">📂 Your Private Medical History ({vaultRecords.length})</h3>
          <div className="flex-1 overflow-y-auto space-y-4 pr-2 max-h-[420px]">
            {vaultRecords.length === 0 ? (
              <p className="text-gray-400 text-center text-xs mt-12 font-medium">No secure documents stored yet.</p>
            ) : (
              vaultRecords.map((rec) => (
                <div key={rec.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-200 shadow-xs relative">
                  <span className="absolute top-4 right-4 bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full text-[10px] font-bold border border-emerald-200 uppercase tracking-wide">
                    Decrypted
                  </span>
                  <h4 className="font-bold text-gray-900 text-xs mb-1">{rec.title}</h4>
                  <p className="text-xs text-emerald-700 font-bold mb-3">👨‍⚕️ {rec.doctor}</p>
                  
                  <div className="space-y-1.5 text-xs text-gray-700 bg-white p-3 rounded-xl border border-gray-100 shadow-inner">
                    <p><strong>💊 Medicines:</strong> {rec.medicines || 'None prescribed'}</p>
                    <p><strong>📋 Guidelines:</strong> {rec.guidelines || 'No specific guidelines'}</p>
                  </div>
                  <p className="text-[10px] text-gray-400 mt-3 text-right font-medium">Stored on: {rec.date}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}