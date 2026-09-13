import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { PAGES } from '../constants/pages';
import api from '../constants/api';
import { encryptPatientData } from '../utils/security';
export default function HospitalLogin({ setCurrentPage, setIsLoggedIn }) {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const res = await api.post('/hospitals/login', { email, password });
      const { token, user } = res.data;

      if (user.role !== 'hospital') {
        setError('This account is not registered as a hospital. Use the patient/doctor login instead.');
        setIsSubmitting(false);
        return;
      }

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify({ token, ...user }));

      const securePayload = encryptPatientData({ token, user, loggedInAt: new Date().toISOString() });
      localStorage.setItem('secure_med_session', securePayload);

      login(user);
      setIsLoggedIn(true);
      setCurrentPage(PAGES.HOSPITAL_PORTAL);
    } catch (err) {
      const backendMsg = err?.response?.data?.error;
      setError(backendMsg || 'Login failed. Check your credentials and try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-900 via-teal-800 to-cyan-900 px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-6">
          <div className="text-3xl mb-2">🏥</div>
          <h1 className="text-xl font-extrabold text-teal-900">Hospital Portal Login</h1>
          <p className="text-sm text-gray-500 mt-1">Rural Telemedicine AI Engine · Staff Access</p>
        </div>

        {error && (
          <div className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">Hospital Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-600 text-sm"
              placeholder="admin@yourhospital.org"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-600 text-sm"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-teal-800 hover:bg-teal-900 disabled:opacity-60 text-white font-bold py-2.5 rounded-xl transition-all active:scale-95 shadow-md"
          >
            {isSubmitting ? 'Signing in…' : 'Sign In to Rural Telemedicine'}
          </button>
        </form>

        <p className="text-center text-xs text-gray-500 mt-5">
          New hospital?{' '}
          <button
            type="button"
            onClick={() => setCurrentPage('hospital-register')}
            className="text-teal-800 font-bold underline hover:text-teal-900"
          >
            Register here
          </button>
        </p>

        {/* Goes back to the role picker (Patient/Doctor/Hospital) —
            RoleSelect is the front door to the whole login flow. */}
        <button
          onClick={() => setCurrentPage('role-select')}
          className="w-full text-center text-xs text-gray-500 hover:text-teal-800 mt-3"
        >
          ← Back to role selection
        </button>
      </div>
    </div>
  );
}