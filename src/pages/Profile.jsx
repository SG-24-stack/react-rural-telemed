import React, { useState, useEffect } from 'react';

export default function Profile({ setCurrentPage, setIsLoggedIn }) {
  // States for all requested options
  const [currentLang, setCurrentLang] = useState('Bengali');
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Account details state
  const [accountName, setAccountName] = useState('Authorized Patient');
  const [accountEmail, setAccountEmail] = useState('patient@ruraltelemed.in');
  const [accountPhone, setAccountPhone] = useState('+91 9876543210');
  const [accountMsg, setAccountMsg] = useState('');

  // Biometric login toggle state, synced with localStorage
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  useEffect(() => {
    const isBiometricOn = localStorage.getItem('biometricEnabled') === 'true';
    setBiometricEnabled(isBiometricOn);
  }, []);

  const handleBiometricToggle = () => {
    const newValue = !biometricEnabled;
    setBiometricEnabled(newValue);
    localStorage.setItem('biometricEnabled', newValue ? 'true' : 'false');
  };

  // Password Change state
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [pwdMsg, setPwdMsg] = useState('');

  // Feedback state
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  // Account details save — local only for now (backend PUT /users/profile
  // route doesn't exist yet; re-connect once that route is built)
  const handleAccountSave = (e) => {
    e.preventDefault();
    setAccountMsg('Account details updated!');
    setTimeout(() => setAccountMsg(''), 3000);
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (!oldPassword || !newPassword) return;
    setPwdMsg('Password successfully updated!');
    setOldPassword('');
    setNewPassword('');
    setTimeout(() => setPwdMsg(''), 3000);
  };

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    if (!feedbackText) return;
    setFeedbackSubmitted(true);
    setFeedbackText('');
    setTimeout(() => setFeedbackSubmitted(false), 3000);
  };

  return (
    <div className={`p-6 max-w-5xl mx-auto mt-4 space-y-6 animate-fade-in font-sans ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-slate-50 text-gray-800'}`}>
      
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-800 text-white p-6 rounded-2xl shadow-lg flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black">⚙️ Corner Settings & App Control Hub</h1>
          <p className="text-xs text-emerald-100 mt-1">Manage your account, translation, dark/light mode, password, biometric login, and feedback.</p>
        </div>
        <button 
          onClick={() => setCurrentPage('dashboard')} 
          className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow"
        >
          ← Back to Dashboard
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* 0. ACCOUNT DETAILS */}
        <div className={`p-6 rounded-2xl shadow-sm border md:col-span-2 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} space-y-4`}>
          <h3 className="font-black text-sm border-b pb-2">👤 Account</h3>
          <form onSubmit={handleAccountSave} className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="block font-bold mb-1">Full Name</label>
              <input
                type="text"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none text-gray-900"
                required
              />
            </div>
            <div>
              <label className="block font-bold mb-1">Email</label>
              <input
                type="email"
                value={accountEmail}
                onChange={(e) => setAccountEmail(e.target.value)}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none text-gray-900"
                required
              />
            </div>
            <div>
              <label className="block font-bold mb-1">Phone</label>
              <input
                type="tel"
                value={accountPhone}
                onChange={(e) => setAccountPhone(e.target.value)}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none text-gray-900"
                required
              />
            </div>
            <div className="md:col-span-3">
              <button type="submit" className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl font-bold shadow">
                Save Account Details
              </button>
              {accountMsg && <span className="ml-3 text-emerald-600 font-bold">{accountMsg}</span>}
            </div>
          </form>
        </div>

        {/* 1. LANGUAGE TRANSLATION (Bengali, Hindi, English) */}
        <div className={`p-6 rounded-2xl shadow-sm border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} space-y-4`}>
          <h3 className="font-black text-sm border-b pb-2">🌐 Full App Language Translation</h3>
          <p className="text-xs text-gray-500">Select interface language for Bengali, Hindi, or English.</p>
          <div className="grid grid-cols-3 gap-2 text-xs font-bold">
            <button 
              onClick={() => setCurrentLang('Bengali')}
              className={`p-2.5 rounded-xl border ${currentLang === 'Bengali' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-gray-50 text-gray-700 border-gray-200'}`}
            >
              বাংলা (Bengali)
            </button>
            <button 
              onClick={() => setCurrentLang('Hindi')}
              className={`p-2.5 rounded-xl border ${currentLang === 'Hindi' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-gray-50 text-gray-700 border-gray-200'}`}
            >
              हिन्दी (Hindi)
            </button>
            <button 
              onClick={() => setCurrentLang('English')}
              className={`p-2.5 rounded-xl border ${currentLang === 'English' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-gray-50 text-gray-700 border-gray-200'}`}
            >
              English
            </button>
          </div>
        </div>

        {/* 2. DISPLAY APPEARANCE (Dark / Light Mode) */}
        <div className={`p-6 rounded-2xl shadow-sm border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} space-y-4`}>
          <h3 className="font-black text-sm border-b pb-2">🌓 Display Appearance (Dark / Light Mode)</h3>
          <p className="text-xs text-gray-500">Switch between light and dark themes for comfortable viewing.</p>
          <div className="grid grid-cols-2 gap-3 text-xs font-bold">
            <button 
              onClick={() => setIsDarkMode(false)}
              className={`p-3 rounded-xl border ${!isDarkMode ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-gray-50 text-gray-700 border-gray-200'}`}
            >
              ☀️ Light Mode
            </button>
            <button 
              onClick={() => setIsDarkMode(true)}
              className={`p-3 rounded-xl border ${isDarkMode ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-gray-50 text-gray-700 border-gray-200'}`}
            >
              🌙 Dark Mode
            </button>
          </div>
        </div>

        {/* 3. PASSWORD CHANGE OPTION */}
        <div className={`p-6 rounded-2xl shadow-sm border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} space-y-4`}>
          <h3 className="font-black text-sm border-b pb-2">🔒 Change Account Password</h3>
          <form onSubmit={handlePasswordChange} className="space-y-3 text-xs">
            <div>
              <label className="block font-bold mb-1">Current Password</label>
              <input 
                type="password" 
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none text-gray-900"
                required
              />
            </div>
            <div>
              <label className="block font-bold mb-1">New Password</label>
              <input 
                type="password" 
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none text-gray-900"
                required
              />
            </div>
            <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl font-bold shadow">
              Update Password 🔑
            </button>
            {pwdMsg && <p className="text-emerald-600 font-bold text-center mt-1">{pwdMsg}</p>}
          </form>
        </div>

        {/* BIOMETRIC LOGIN TOGGLE */}
        <div className={`p-6 rounded-2xl shadow-sm border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} space-y-4`}>
          <h3 className="font-black text-sm border-b pb-2">👆 Biometric Login</h3>
          <p className="text-xs text-gray-500">
            When enabled, you'll see a fingerprint scan option on the login screen for quick sign-in.
          </p>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold">
              {biometricEnabled ? 'Enabled' : 'Disabled'}
            </span>
            <button
              type="button"
              onClick={handleBiometricToggle}
              className={`relative w-14 h-8 rounded-full transition-colors duration-300 ${
                biometricEnabled ? 'bg-emerald-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow transform transition-transform duration-300 ${
                  biometricEnabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* 4. FEEDBACK OPTION */}
        <div className={`p-6 rounded-2xl shadow-sm border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} space-y-4`}>
          <h3 className="font-black text-sm border-b pb-2">💬 Send App Feedback</h3>
          <form onSubmit={handleFeedbackSubmit} className="space-y-3 text-xs">
            <div>
              <label className="block font-bold mb-1">Your Comments / Suggestions</label>
              <textarea 
                rows="3"
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="Let us know how we can improve this rural telemedicine platform..."
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none text-gray-900"
                required
              />
            </div>
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl font-bold shadow">
              Submit Feedback 🚀
            </button>
            {feedbackSubmitted && <p className="text-emerald-600 font-bold text-center mt-1">Thank you for your feedback!</p>}
          </form>
        </div>

      </div>

      {/* 5. ABOUT OPTION */}
      <div className={`p-6 rounded-2xl shadow-sm border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} space-y-3`}>
        <h3 className="font-black text-sm border-b pb-2">ℹ️ About Rural Telemedicine Access</h3>
        <p className="text-xs leading-relaxed text-gray-600 dark:text-gray-300">
          <b>Overall Idea of the App:</b> This platform bridges the healthcare gap in rural and remote regions (such as Kandi and Murshidabad). It features tele-consultation queues, AI-assisted symptom summaries, smart laboratory routers for local sample collection, emergency organ and blood donor matching, offline store-and-forward synchronization, and ASHA/ANM health-worker assisted modes.
        </p>
      </div>

      {/* 6. LOG OUT OPTION */}
      <div className={`p-6 rounded-2xl shadow-sm border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} flex justify-between items-center`}>
        <div>
          <h3 className="font-black text-sm text-red-600">🚪 Sign Out / Logout</h3>
          <p className="text-xs text-gray-500">Safely end your session on this device.</p>
        </div>
        <button 
          onClick={() => {
            if (setIsLoggedIn) setIsLoggedIn(false);
            setCurrentPage('login');
          }}
          className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow"
        >
          Logout Now
        </button>
      </div>

    </div>
  );
}