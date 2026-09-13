import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { LanguageContext } from '../context/LanguageContext';
import api from '../constants/api';

export default function Register({ setCurrentPage }) {
  const { login } = useContext(AuthContext);
  const { language, setLanguage } = useContext(LanguageContext);

  // Registration Form States
  const [fullName, setFullName] = useState('');
  const [details, setDetails] = useState('');
  const [dob, setDob] = useState('');
  const [gender,setGender]=useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState(''); // Now required — backend needs a unique email
  const [password, setPassword] = useState('');

  // OTP States
  const [otpSent, setOtpSent] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const [successMsg, setSuccessMsg] = useState(false);

  // New: loading + error state for real API calls
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Simple multi-lingual dictionary for registration page
  const regDict = {
    'English': {
      title: 'Create Account',
      subtitle: 'Register for Rural Telemedicine Portal',
      nameLabel: 'Full Name *',
      detailsLabel: 'Personal Details / Medical Bio *',
      dobLabel: 'Date of Birth (DOB) *',
      mobileLabel: 'Mobile Number (for OTP) *',
      emailLabel: 'Gmail Address *',
      passLabel: 'Password *',
      sendOtp: 'Send OTP to Mobile',
      verifyOtp: 'Verify OTP & Complete Registration',
      successText: '✓ Account registered successfully! Redirecting...',
      hasAccount: 'Already have an account?',
      signIn: 'Sign In here'
    },
    'Bengali (বাংলা)': {
      title: 'অ্যাকাউন্ট তৈরি করুন',
      subtitle: 'গ্রামীণ টেলিমেডিসিন পোর্টালে নিবন্ধন করুন',
      nameLabel: 'পুরো নাম *',
      detailsLabel: 'ব্যক্তিগত বিবরণ / চিকিৎসা সংক্রান্ত তথ্য *',
      dobLabel: 'জন্ম তারিখ (DOB) *',
      mobileLabel: 'মোবাইল নম্বর (ওটিপির জন্য) *',
      emailLabel: 'জিমেইল ঠিকানা *',
      passLabel: 'পাসওয়ার্ড *',
      sendOtp: 'মোবাইলে ওটিপি পাঠান',
      verifyOtp: 'ওটিপি যাচাই করুন এবং নিবন্ধন সম্পূর্ণ করুন',
      successText: '✓ সফলভাবে অ্যাকাউন্ট নিবন্ধিত হয়েছে! পুনর্নির্দেশ করা হচ্ছে...',
      hasAccount: 'ইতিমধ্যে একটি অ্যাকাউন্ট আছে?',
      signIn: 'এখানে সাইন ইন করুন'
    },
    'Hindi (हिन्दी)': {
      title: 'खाता बनाएं',
      subtitle: 'ग्रामीण टेलीमेडिसिन पोर्टल के लिए पंजीकरण करें',
      nameLabel: 'पूरा नाम *',
      detailsLabel: 'व्यक्तिगत विवरण / चिकित्सा बायो *',
      dobLabel: 'जन्म तिथि (DOB) *',
      mobileLabel: 'मोबाइल नंबर (OTP के लिए) *',
      emailLabel: 'जीमेल पता *',
      passLabel: 'पासवर्ड *',
      sendOtp: 'मोबाइल पर OTP भेजें',
      verifyOtp: 'OTP सत्यापित करें और पंजीकरण पूरा करें',
      successText: '✓ खाता सफलतापूर्वक पंजीकृत हो गया! रीडायरेक्ट किया जा रहा है...',
      hasAccount: 'क्या आपके पास पहले से खाता है?',
      signIn: 'यहाँ साइन इन करें'
    }
  };

  const tReg = (key) => {
    return regDict[language]?.[key] || regDict['English'][key];
  };

  const handleSendOtp = async(e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!mobile || mobile.length < 10) {
      alert('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!email) {
      alert('Please enter your email — it is required to create your account.');
      return;
    }
    setIsSubmitting(true);
    try{
      await api.post('/auth/register/otp/request',{
        phone_number:mobile
      });
    setOtpSent(true);
    }catch(err){
      const backendMsg=err?.response?.data?.error;
      setErrorMsg(
        backendMsg || 'Failed to send OTP.Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if(!otpInput || otpInput.length !==6){
      setErrorMsg('Please enter the 6-digit OTP');
      return;
    }
    //if (!fullName || !mobile || !password || !dob || !email) return;

    setIsSubmitting(true);
    //setErrorMsg('');

    try {
      const otpResponse=await api.post(
        '/auth/register/otp/verify',
        {
          phone_number:mobile,
          otp_code:otpInput
        }
      );
      if(!otpResponse.data.verified){
        setErrorMsg('OTP Verification failed');
        return;
      }
      await api.post('/patients/register', {
  name: fullName,
  details: details,
  dob: dob,
  gender:gender,
  mobile: mobile,
  email: email,
  password: password
});
      // 2. registerUser doesn't return a JWT, so log in immediately to get one
      const loginResponse = await api.post('/auth/login', {
        email: email,
        password: password
      });

      const { token, user } = loginResponse.data;

      // 3. Persist token the way api.jsx's interceptor expects it
      localStorage.setItem('user', JSON.stringify({ token, ...user }));

      // 4. Update app-level auth state
      login({
        ...user,
        details,
        dob,
        mobile,
        phone: mobile
      });

      setSuccessMsg(true);

      // 5. Force a full reload to immediately render the full header dashboard options
      setTimeout(() => {
        window.location.reload();
      }, 1000);

    } catch (err) {
      const backendMsg = err?.response?.data?.error;
      setErrorMsg(backendMsg || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
      
      {/* Background Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0 filter brightness-75 scale-105"
        style={{ 
          backgroundImage: `linear-gradient(rgba(6, 78, 59, 0.85), rgba(15, 23, 42, 0.90)), url('https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1920&q=80')` 
        }}
      />

      {/* Glassmorphism Register Card */}
      <div className="relative z-10 bg-white/90 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/60 w-full max-w-md my-8">
        
        {/* Top Language Switcher for Registration Form */}
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

        <div className="text-center mb-5">
          <div className="w-14 h-14 bg-gradient-to-br from-green-600 to-emerald-700 text-white rounded-2xl flex items-center justify-center mx-auto mb-2 shadow-lg">
            <span className="text-2xl">📝</span>
          </div>
          <h2 className="text-2xl font-black animated-colored-text tracking-tight">{tReg('title')}</h2>
          <p className="text-xs text-gray-600 mt-0.5 font-semibold">{tReg('subtitle')}</p>
        </div>

        {errorMsg && (
          <div className="mb-3 p-2.5 bg-red-50 text-red-700 rounded-xl border border-red-200 text-xs font-bold">
            ⚠ {errorMsg}
          </div>
        )}

        {!otpSent ? (
          <form onSubmit={handleSendOtp} className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-gray-700 mb-1">{tReg('nameLabel')}</label>
              <input 
                type="text" 
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="E.g., Sujit Chandra" 
                className="w-full p-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-green-500 bg-white shadow-inner font-medium text-gray-800"
                required 
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">{tReg('detailsLabel')}</label>
              <textarea 
                rows="2"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Medical conditions, background, etc." 
                className="w-full p-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-green-500 bg-white shadow-inner font-medium text-gray-800"
                required 
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">{tReg('dobLabel')}</label>
              <input 
                type="date" 
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full p-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-green-500 bg-white shadow-inner font-medium text-gray-800"
                required 
              />
            </div>
            <div>
            <label className="block font-bold text-gray-700 mb-1">
              Gender *
            </label>

           <select
           value={gender}
           onChange={(e) => setGender(e.target.value)}
          className="w-full p-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-green-500 bg-white shadow-inner font-medium text-gray-800"
           required
           >
    <option value="">Select Gender</option>
    <option value="Male">Male</option>
    <option value="Female">Female</option>
    <option value="Other">Other</option>
  </select>
</div>
            <div>
              <label className="block font-bold text-gray-700 mb-1">{tReg('mobileLabel')}</label>
              <div className="flex">
                <span className="bg-gray-100 border border-r-0 border-gray-200 px-3 rounded-l-xl flex items-center text-xs font-bold text-gray-600">+91</span>
                <input 
                  type="tel" 
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="9876543210" 
                  maxLength="10"
                  className="w-full p-2.5 border border-gray-200 rounded-r-xl outline-none focus:ring-2 focus:ring-green-500 bg-white shadow-inner font-medium text-gray-800"
                  required 
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">{tReg('emailLabel')}</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@gmail.com" 
                className="w-full p-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-green-500 bg-white shadow-inner font-medium text-gray-800"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">{tReg('passLabel')}</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                className="w-full p-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-green-500 bg-white shadow-inner font-medium text-gray-800"
                required 
              />
            </div>

            <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold transition-transform active:scale-95 shadow-lg mt-2 text-sm">
              {tReg('sendOtp')}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4 text-xs">
            <div className="p-3 bg-green-50 rounded-xl border border-green-200 text-center">
              <p className="text-xs text-green-800 font-medium">OTP sent to <strong>+91 {mobile}</strong>. Enter to complete.</p>
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Enter 6-Digit OTP</label>
              <input 
                type="text" 
                value={otpInput}
                onChange={(e) => setOtpInput(e.target.value)}
                placeholder="1 2 3 4 5 6" 
                maxLength="6"
                className="w-full p-3 border border-gray-200 rounded-xl outline-none text-center tracking-widest text-lg font-bold bg-white shadow-inner"
                required
              />
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 disabled:cursor-not-allowed text-white py-3 rounded-xl font-bold transition-transform active:scale-95 shadow-lg text-sm"
            >
              {isSubmitting ? 'Creating account...' : tReg('verifyOtp')}
            </button>

            {successMsg && (
              <p className="text-emerald-600 font-bold text-center text-xs">{tReg('successText')}</p>
            )}
          </form>
        )}

        <div className="mt-5 text-center">
          <p className="text-xs text-gray-600 font-medium">
            {tReg('hasAccount')}{' '}
            <button 
              type="button"
              onClick={() => setCurrentPage('login')} 
              className="text-green-700 font-bold underline hover:text-green-800"
            >
              {tReg('signIn')}
            </button>
          </p>
        </div>

      </div>
    </div>
  );
}