import React, { useState, useEffect } from 'react';
import api from '../constants/api';
export default function DoctorRegister({ setCurrentPage }) {

  const [hospitals, setHospitals] = useState([]);
  const [loadingHospitals, setLoadingHospitals] = useState(true);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState(''); // ✅ Added Mobile Number State
  const [password, setPassword] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [council, setCouncil] = useState('');
  const [qualification, setQualification] = useState('');
  const [hospitalId, setHospitalId] = useState('');
  const [govtDocument, setGovtDocument] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState(false);

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const res = await api.get('/hospitals');
        setHospitals(res.data);
      } catch (err) {
        setErrorMsg('Could not load hospital list. Please refresh and try again.');
      } finally {
        setLoadingHospitals(false);
      }
    };
    fetchHospitals();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 10 * 1024 * 1024) {
      setErrorMsg('File is too large. Maximum size is 10MB.');
      e.target.value = '';
      return;
    }
    setGovtDocument(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    // ✅ Added phoneNumber to validation
    if (!fullName || !email || !phoneNumber || !password || !licenseNumber || !council || !qualification || !hospitalId || !govtDocument) {
      setErrorMsg('Please fill in all required fields and attach your government document.');
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('name', fullName);
      formData.append('email', email);
      formData.append('phone_number', phoneNumber); // ✅ Appended Mobile Number to backend request
      formData.append('password', password);
      formData.append('specialty', specialty);
      formData.append('license_number', licenseNumber);
      formData.append('council', council);
      formData.append('qualification', qualification);
      formData.append('hospital_id', hospitalId);
      formData.append('govt_document', govtDocument);

      await api.post('/doctors/register-doctor', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setSuccessMsg(true);
      setTimeout(()=>{
      setCurrentPage('login-doctor');
      },1500);
    } catch (err) {
      const backendMsg = err?.response?.data?.error;
      setErrorMsg(backendMsg || 'Doctor registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-10 overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center z-0 filter brightness-75 scale-105"
        style={{
          backgroundImage: `linear-gradient(rgba(6, 78, 59, 0.85), rgba(15, 23, 42, 0.90)), url('https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1920&q=80')`
        }}
      />

      <div className="relative z-10 bg-white/90 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/60 w-full max-w-lg my-8">

        <div className="text-center mb-5">
          <div className="w-14 h-14 bg-gradient-to-br from-green-600 to-emerald-700 text-white rounded-2xl flex items-center justify-center mx-auto mb-2 shadow-lg">
            <span className="text-2xl">🩺</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight text-gray-900">Doctor Registration</h2>
          <p className="text-xs text-gray-600 mt-0.5 font-semibold">
            Register to provide checkups for patients at your hospital
          </p>
        </div>

        {errorMsg && (
          <div className="mb-3 p-2.5 bg-red-50 text-red-700 rounded-xl border border-red-200 text-xs font-bold">
            ⚠ {errorMsg}
          </div>
        )}

        {successMsg ? (
          <p className="text-emerald-600 font-bold text-center text-sm py-4">
            ✓ Registered successfully! Redirecting...
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3 text-xs">

            <div>
              <label className="block font-bold text-gray-700 mb-1">Full Name *</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Dr. Full Name"
                className="w-full p-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-green-500 bg-white shadow-inner font-medium text-gray-800"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Email *</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="doctor@example.com"
                className="w-full p-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-green-500 bg-white shadow-inner font-medium text-gray-800"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Mobile Number *</label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="e.g., 9876543210"
                className="w-full p-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-green-500 bg-white shadow-inner font-medium text-gray-800"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Password *</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full p-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-green-500 bg-white shadow-inner font-medium text-gray-800"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Specialty</label>
              <input
                type="text"
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                placeholder="E.g., Cardiologist"
                className="w-full p-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-green-500 bg-white shadow-inner font-medium text-gray-800"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Medical License Number *</label>
              <input
                type="text"
                value={licenseNumber}
                onChange={(e) => setLicenseNumber(e.target.value)}
                placeholder="E.g., WB-12345"
                className="w-full p-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-green-500 bg-white shadow-inner font-medium text-gray-800"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Medical Council *</label>
              <input
                type="text"
                value={council}
                onChange={(e) => setCouncil(e.target.value)}
                placeholder="E.g., West Bengal Medical Council"
                className="w-full p-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-green-500 bg-white shadow-inner font-medium text-gray-800"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Qualification / Degree *</label>
              <input
                type="text"
                value={qualification}
                onChange={(e) => setQualification(e.target.value)}
                placeholder="E.g., MBBS, MD (Cardiology)"
                className="w-full p-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-green-500 bg-white shadow-inner font-medium text-gray-800"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Hospital *</label>
              <select
                value={hospitalId}
                onChange={(e) => setHospitalId(e.target.value)}
                className="w-full p-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-green-500 bg-white shadow-inner font-medium text-gray-800"
                required
                disabled={loadingHospitals}
              >
                <option value="">
                  {loadingHospitals ? 'Loading hospitals...' : 'Select your hospital'}
                </option>
                {hospitals.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.name}{h.location ? ` — ${h.location}` : ''}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">
                Government Agreement Document *
              </label>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                className="w-full p-2 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-green-500 bg-white shadow-inner font-medium text-gray-800 text-[11px]"
                required
              />
              <p className="text-[10px] text-gray-500 mt-1">PDF, JPG, or PNG. Max 10MB.</p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed text-white py-3 rounded-xl font-bold transition-transform active:scale-95 shadow-lg mt-2 text-sm"
            >
              {isSubmitting ? 'Submitting...' : 'Register as Doctor'}
            </button>
          </form>
        )}

        <div className="mt-5 text-center">
          <p className="text-xs text-gray-600 font-medium">
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => setCurrentPage('login-doctor')}
              className="text-green-700 font-bold underline hover:text-green-800"
            >
              Sign In here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}