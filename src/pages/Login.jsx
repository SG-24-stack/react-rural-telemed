import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { LanguageContext } from '../context/LanguageContext';
import api from '../constants/api';
import { encryptPatientData } from '../utils/security';

export default function Login({ setCurrentPage, onLoginSuccess,roleHint='patient'}) {
  const { login } = useContext(AuthContext);
  const { language, setLanguage } = useContext(LanguageContext);

  const [loginMethod, setLoginMethod] = useState('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const [isScanning, setIsScanning] = useState(false);
  const [scanSuccess, setScanSuccess] = useState(false);

  // loading + error state for the API calls
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Forgot Password Modal State
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotRole, setForgotRole] = useState('patient');
  const [forgotSent, setForgotSent] = useState(false);

  const [biometricEnabled, setBiometricEnabled] = useState(false);
  useEffect(() => {
    const isBiometricOn = localStorage.getItem('biometricEnabled') === 'true';
    setBiometricEnabled(isBiometricOn);
  }, []);

  const loginDict = {
    'English': {
      title: 'Rural Telemedicine',
      subtitle: 'Secure Regional & Global Healthcare Portal',
      emailTab: '📧 Gmail & Password',
      mobileTab: '📱 Mobile & OTP',
      emailLabel: 'Gmail Address',
      passLabel: 'Password',
      forgotPass: 'Forgot Password?',
      emailBtn: 'Sign In with Gmail',
      mobileLabel: 'Mobile Number',
      sendOtpBtn: 'Send OTP Code',
      otpLabel: 'Enter 6-Digit OTP',
      verifyOtpBtn: 'Verify & Login',
      orDivider: 'Or Biometric Scan',
      scanText: 'Tap sensor for Quick Login',
      scanningText: 'Scanning fingerprint...',
      scanSuccessText: 'Identity Verified!',
      noAccount: 'New user?',
      registerLink: 'Register new account',
      doctorPrompt: 'Are you a doctor?',
      doctorLink: 'Register here',
      forgotTitle: '🔑 Recover Password',
      forgotRoleLabel: 'I am a:',
      patientRole: 'Patient / Citizen',
      doctorRole: 'Medical Doctor / Practitioner',
      forgotEmailLabel: 'Registered Email Address',
      cancelBtn: 'Cancel',
      sendResetBtn: 'Send Reset Link',
      resetSuccess: 'Reset link dispatched securely!'
    },
    'Bengali (বাংলা)': {
      title: 'গ্রামীণ টেলিমেডিসিন',
      subtitle: 'নিরাপদ আঞ্চলিক ও বৈশ্বিক স্বাস্থ্যসেবা পোর্টাল',
      emailTab: '📧 জিমেইল ও পাসওয়ার্ড',
      mobileTab: '📱 মোবাইল ও ওটিপি',
      emailLabel: 'জিমেইল ঠিকানা',
      passLabel: 'পাসওয়ার্ড',
      forgotPass: 'পাসওয়ার্ড ভুলে গেছেন?',
      emailBtn: 'জিমেইল দিয়ে সাইন ইন করুন',
      mobileLabel: 'মোবাইল নম্বর',
      sendOtpBtn: 'ওটিপি কোড পাঠান',
      otpLabel: '৬-সংখ্যার ওটিপি লিখুন',
      verifyOtpBtn: 'যাচাই করুন এবং লগইন করুন',
      orDivider: 'অথবা বায়োমেট্রিক স্ক্যান',
      scanText: 'দ্রুত লগইন করতে সেন্সরে ট্যাপ করুন',
      scanningText: 'আঙুলের ছাপ স্ক্যান করা হচ্ছে...',
      scanSuccessText: 'পরিচয় নিশ্চিত করা হয়েছে!',
      noAccount: 'নতুন ব্যবহারকারী?',
      registerLink: 'নতুন অ্যাকাউন্ট নিবন্ধন করুন',
      doctorPrompt: 'আপনি কি একজন ডাক্তার?',
      doctorLink: 'এখানে নিবন্ধন করুন',
      forgotTitle: '🔑 পাসওয়ার্ড পুনরুদ্ধার',
      forgotRoleLabel: 'আমি একজন:',
      patientRole: 'রোগী / নাগরিক',
      doctorRole: 'চিকিৎসক / ডাক্তার',
      forgotEmailLabel: 'নিবন্ধিত জিমেইল ঠিকানা',
      cancelBtn: 'বাতিল',
      sendResetBtn: 'রিসেট লিঙ্ক পাঠান',
      resetSuccess: 'নিরাপদে পাসওয়ার্ড রিসেট লিঙ্ক পাঠানো হয়েছে!'
    },
    'Hindi (हिन्दी)': {
      title: 'ग्रामीण टेलीमेडिसिन',
      subtitle: 'सुरक्षित क्षेत्रीय और वैश्विक स्वास्थ्य सेवा पोर्टल',
      emailTab: '📧 जीमेल और पासवर्ड',
      mobileTab: '📱 मोबाइल और ओटीपी',
      emailLabel: ' जीमेल पता',
      passLabel: 'पासवर्ड',
      forgotPass: 'पासवर्ड भूल गए?',
      emailBtn: 'जीमेल से साइन इन करें',
      mobileLabel: 'मोबाइल नंबर',
      sendOtpBtn: 'ओटीपी कोड भेजें',
      otpLabel: '6-अंकों का ओटीपी दर्ज करें',
      verifyOtpBtn: 'सत्यापित करें और लॉगिन करें',
      orDivider: 'या बायोमेट्रिक स्कैन',
      scanText: 'त्वरित लॉगिन के लिए सेंसर टैप करें',
      scanningText: 'फिंगरप्रिंट स्कैन हो रहा है...',
      scanSuccessText: 'पहचान सत्यापित!',
      noAccount: 'नया उपयोगकर्ता?',
      registerLink: 'नया खाता पंजीकृत करें',
      doctorPrompt: 'क्या आप डॉक्टर हैं?',
      doctorLink: 'यहां पंजीकरण करें',
      forgotTitle: '🔑 पासवर्ड पुनर्प्राप्त करें',
      forgotRoleLabel: 'मैं एक हूँ:',
      patientRole: 'रोगी / नागरिक',
      doctorRole: 'चिकित्सक / डॉक्टर',
      forgotEmailLabel: 'पंजीकृत जीमेल पता',
      cancelBtn: 'रद्द करें',
      sendResetBtn: 'रीसेट लिंक भेजें',
      resetSuccess: 'रीसेट लिंक सुरक्षित रूप से भेजा गया!'
    }
  };

  const tLogin = (key) => loginDict[language]?.[key] || loginDict['English'][key];

  const completeLogin = (token, user) => {
  // Clear any previous user's session
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('secure_med_session');

  // Store the NEW authenticated session
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));

  // Also keep encrypted session if your app needs it
  const securePayload = encryptPatientData({
    token,
    user,
    loggedInAt: new Date().toISOString()
  });

  localStorage.setItem('secure_med_session', securePayload);

  console.log("LOGIN SUCCESS");
  console.log("Logged in role:", user.role);
  console.log("Token exists:", !!token);

  if (onLoginSuccess) {
    onLoginSuccess();
  } else {
    setCurrentPage('dashboard');
  }
};

  // ✅ REAL API: Email Login
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    try {
      const res = await api.post(roleHint === 'doctor'?'/auth/doctor-login':'/auth/login', { email, password });
      const { token, user } = res.data;

      console.log("LOGIN RESPONSE:",res.data);
      console.log("USER ROLE:",user.role);
      console.log("TOKEN RECEIVED:",!!
        token);
      if(!token){
        throw new Error("No authentication token received");
      }
      if(!user){
        throw new Error("No user information received");
      }
      login(user,token);
      localStorage.setItem('token',token);
      localStorage.setItem('user',JSON.stringify(user));
      console.log(
        "FINAL TOKEN CHECK:",
        !!localStorage.getItem('token')
      );
      if(onLoginSuccess){
        onLoginSuccess();
      }else{
        setCurrentPage('dashboard');
      }
    } catch (err) {
      console.error("Login error:",err);
      const backendMsg = err?.response?.data?.error;
      setErrorMsg(backendMsg || 'Login failed. Please check your email and password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ✅ REAL API: Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    
    if (!mobileNumber || mobileNumber.length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post('/auth/login/otp/request', { phone_number: mobileNumber });
      setOtpSent(true);
      alert('OTP sent! Check your backend terminal for the 6-digit code.');
    } catch (err) {
      const backendMsg = err?.response?.data?.error;
      setErrorMsg(backendMsg || 'Failed to send OTP. Please check your number.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ✅ REAL API: Verify OTP & Login
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    try {
      const res = await api.post('/auth/login/otp/verify', { phone_number: mobileNumber, otp_code: otp });
      const { token, user } = res.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify({ token, ...user }));

      login(user);
      completeLogin(token, user);
    } catch (err) {
      const backendMsg = err?.response?.data?.error;
      setErrorMsg(backendMsg || 'Invalid or expired OTP.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFingerprintScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setScanSuccess(true);
      setTimeout(() => {
        const mockUser = { email: 'biometric_user@ruraltelemed.in', name: 'Biometric Verified Patient', phone: '+91 9876543210' };
        login(mockUser);
        completeLogin('bio-token-secure', mockUser);
      }, 600);
    }, 1500);
  };

  const handleForgotPasswordSubmit = (e) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setForgotSent(true);
    setTimeout(() => {
      setForgotSent(false);
      setShowForgotModal(false);
      setForgotEmail('');
      alert(`Encrypted recovery instructions dispatched for ${forgotRole}: ${forgotEmail}`);
    }, 1500);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden font-sans">

      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0 filter brightness-75 scale-105 transition-transform duration-1000"
        style={{
          backgroundImage: `linear-gradient(rgba(6, 78, 59, 0.85), rgba(15, 23, 42, 0.90)), url('https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1920&q=80')`
        }}
      />

      {/* Glassmorphism Login Card */}
      <div className="relative z-10 bg-white/90 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/60 w-full max-w-md my-8">

        {/* Back to role picker (Patient / Doctor / Hospital) */}
        <button
          type="button"
          onClick={() => setCurrentPage('role-select')}
          className="flex items-center gap-1 text-[11px] font-bold text-gray-500 hover:text-gray-700 mb-3 cursor-pointer"
        >
          ← Back to role selection
        </button>

        {/* Top Language Switcher */}
        <div className="flex justify-between items-center mb-4 border-b pb-2">
          <span className="text-[11px] font-bold text-gray-500">🌐 Language:</span>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-gray-100 text-gray-800 text-xs py-1 px-2 rounded font-bold outline-none cursor-pointer"
          >
            <option value="English">English</option>
            <option value="Bengali (বাংলা)">Bengali (বাংলা)</option>
            <option value="Hindi (हिन्दी)">Hindi (हिन्दी)</option>
          </select>
        </div>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-emerald-700 text-white rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg transform hover:rotate-6 transition-transform">
            <span className="text-3xl">🩺</span>
          </div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">{tLogin('title')}</h2>
          <p className="text-xs text-gray-600 mt-1 font-semibold">{tLogin('subtitle')}</p>
        </div>

        {/* Method Switcher Tabs */}
        <div className="flex bg-gray-200/80 p-1 rounded-xl mb-5 border border-gray-300">
          <button
            type="button"
            onClick={() => { setLoginMethod('email'); setErrorMsg(''); }}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${loginMethod === 'email' ? 'bg-green-600 text-white shadow' : 'text-gray-700 hover:text-black'}`}
          >
            {tLogin('emailTab')}
          </button>
          <button
            type="button"
            onClick={() => { setLoginMethod('mobile'); setErrorMsg(''); }}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${loginMethod === 'mobile' ? 'bg-green-600 text-white shadow' : 'text-gray-700 hover:text-black'}`}
          >
            {tLogin('mobileTab')}
          </button>
        </div>

        {errorMsg && (
          <div className="mb-3 p-2.5 bg-red-50 text-red-700 rounded-xl border border-red-200 text-xs font-bold">
            ⚠ {errorMsg}
          </div>
        )}

        {/* Option A: Gmail & Password */}
        {loginMethod === 'email' && (
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">{tLogin('emailLabel')}</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@gmail.com"
                className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-green-500 bg-white shadow-inner text-sm font-medium text-gray-800"
                required
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold text-gray-700">{tLogin('passLabel')}</label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-[11px] text-emerald-700 font-bold hover:underline cursor-pointer"
                >
                  {tLogin('forgotPass')}
                </button>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-green-500 bg-white shadow-inner text-sm font-medium text-gray-800"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed text-white py-3 rounded-xl font-bold transition-transform active:scale-95 shadow-lg shadow-green-600/30 cursor-pointer text-xs uppercase tracking-wider"
            >
              {isSubmitting ? 'Signing in Securely...' : `${tLogin('emailBtn')} 🔒`}
            </button>
          </form>
        )}

        {/* Option B: Mobile Number & OTP */}
        {loginMethod === 'mobile' && (
          <div>
            {!otpSent ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">{tLogin('mobileLabel')}</label>
                  <div className="flex">
                    <span className="bg-gray-100 border border-r-0 border-gray-200 px-3 rounded-l-xl flex items-center text-xs font-bold text-gray-600">+91</span>
                    <input
                      type="tel"
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      placeholder="98765 43210"
                      maxLength="10"
                      className="w-full p-3 border border-gray-200 rounded-r-xl outline-none focus:ring-2 focus:ring-green-500 bg-white shadow-inner text-sm font-medium text-gray-800"
                      required
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed text-white py-3 rounded-xl font-bold transition-transform active:scale-95 shadow-lg shadow-green-600/30 cursor-pointer text-xs"
                >
                  {isSubmitting ? 'Sending...' : tLogin('sendOtpBtn')}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="p-3 bg-green-50 rounded-xl border border-green-200 text-center relative">
                  <p className="text-xs text-green-800 font-medium">OTP sent successfully to <strong>+91 {mobileNumber}</strong></p>
                  <button 
                    type="button" 
                    onClick={() => { setOtpSent(false); setOtp(''); setErrorMsg(''); }}
                    className="absolute right-2 top-2 text-[10px] underline text-green-700 hover:text-green-900 font-bold cursor-pointer"
                  >
                    Edit
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">{tLogin('otpLabel')}</label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="1 2 3 4 5 6"
                    maxLength="6"
                    className="w-full p-3 border border-gray-200 rounded-xl outline-none text-center tracking-widest text-lg font-bold bg-white shadow-inner"
                    required
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 disabled:cursor-not-allowed text-white py-3 rounded-xl font-bold transition-transform active:scale-95 shadow-lg cursor-pointer text-xs"
                >
                  {isSubmitting ? 'Verifying...' : tLogin('verifyOtpBtn')}
                </button>
              </form>
            )}
          </div>
        )}

        {/* Biometric section */}
        {biometricEnabled && (
          <>
            <div className="my-5 flex items-center">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="px-3 text-[10px] text-gray-500 font-bold uppercase tracking-widest">{tLogin('orDivider')}</span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>

            <div className="flex flex-col items-center justify-center space-y-2">
              <button
                type="button"
                onClick={handleFingerprintScan}
                disabled={isScanning || scanSuccess}
                className={`w-16 h-16 rounded-full flex items-center justify-center border-4 transition-all duration-300 shadow-md bg-white cursor-pointer
                  ${isScanning ? 'border-green-500 text-green-600 animate-pulse scale-105' :
                    scanSuccess ? 'border-emerald-500 text-emerald-600' :
                    'border-gray-300 text-gray-500 hover:border-green-400 hover:text-green-600'}`}
              >
                {scanSuccess ? (
                  <span className="text-3xl font-black">✓</span>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                  </svg>
                )}
              </button>

              <p className={`text-[11px] font-bold transition-colors ${isScanning ? 'text-green-700' : scanSuccess ? 'text-emerald-700' : 'text-gray-600'}`}>
                {isScanning ? tLogin('scanningText') : scanSuccess ? tLogin('scanSuccessText') : tLogin('scanText')}
              </p>
            </div>
          </>
        )}

        {/* Register Link Switcher */}
        <div className="mt-5 text-center border-t pt-4 space-y-1 text-xs">
          <p className="text-gray-600 font-medium">
            {tLogin('noAccount')}{' '}
            <button
              type="button"
              onClick={() => setCurrentPage(roleHint === 'doctor' ? 'doctor-register' : 'register')}
              className="text-green-700 font-bold underline hover:text-green-800 cursor-pointer"
            >
              {tLogin('registerLink')}
            </button>
          </p>
          <p className="text-gray-600 font-medium">
            {tLogin('doctorPrompt')}{' '}
            <button
              type="button"
              onClick={() => setCurrentPage('doctor-register')}
              className="text-indigo-700 font-bold underline hover:text-indigo-800 cursor-pointer"
            >
              {tLogin('doctorLink')}
            </button>
          </p>
          <p className="text-gray-600 font-medium">
            Hospital staff?{' '}
            <button
              type="button"
              onClick={() => setCurrentPage('hospital-login')}
              className="text-emerald-800 font-bold underline hover:text-emerald-900 cursor-pointer"
            >
              Hospital portal login
            </button>
          </p>
        </div>

      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl animate-fade-in text-xs font-sans">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-black text-gray-900 text-sm">{tLogin('forgotTitle')}</h3>
              <button onClick={() => setShowForgotModal(false)} className="font-bold text-gray-400 hover:text-gray-700 cursor-pointer text-sm">✕</button>
            </div>

            {forgotSent ? (
              <div className="py-6 text-center space-y-2">
                <p className="text-2xl">✉️</p>
                <p className="font-bold text-emerald-700 text-sm">{tLogin('resetSuccess')}</p>
                <p className="text-gray-500 text-[11px]">Check your inbox for the encrypted token link.</p>
              </div>
            ) : (
              <form onSubmit={handleForgotPasswordSubmit} className="space-y-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">{tLogin('forgotRoleLabel')}</label>
                  <select 
                    value={forgotRole} 
                    onChange={(e) => setForgotRole(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-medium outline-none text-xs"
                  >
                    <option value="patient">{tLogin('patientRole')}</option>
                    <option value="doctor">{tLogin('doctorRole')}</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">{tLogin('forgotEmailLabel')}</label>
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="name@gmail.com"
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-medium outline-none text-xs"
                    required
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-xl font-bold cursor-pointer"
                  >
                    {tLogin('cancelBtn')}
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl font-bold cursor-pointer shadow"
                  >
                    {tLogin('sendResetBtn')}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}