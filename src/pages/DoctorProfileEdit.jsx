import React, { useState, useEffect } from 'react';

export default function DoctorProfileEdit({ setCurrentPage }) {
  const [formData, setFormData] = useState({
    specialty: '',
    qualification: '',
    experience_years: '',
    spoken_languages: '',
    bio: '',
    working_hours: '',
    treatments_offered: '',
    license_number: '',
    council: '',
    video_fee: 69,
    physical_fee: 150
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Load existing profile data on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('https://rural-telemedicine-backend.onrender.com/api/doctors/profile',  {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
          const data = await response.json();
          setFormData({
            specialty: data.specialty || '',
            qualification: data.qualification || '',
            experience_years: data.experience_years || '',
            spoken_languages: data.spoken_languages || '',
            bio: data.bio || '',
            working_hours: data.working_hours || '',
            treatments_offered: data.treatments_offered || '',
            license_number: data.license_number || '',
            council: data.council || '',
            video_fee: data.video_fee || 69,
            physical_fee: data.physical_fee || 150
          });
        }
      } catch (error) {
        console.error("Failed to load profile", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });
    const token = localStorage.getItem('token');

    try {
      // 1. Update general profile info
      const profileRes = await fetch('https://rural-telemedicine-backend.onrender.com/api/doctors/profile',  {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      // 2. Update fees (using the specific fee route we kept in the backend)
      const feeRes = await fetch('https://rural-telemedicine-backend.onrender.com/api/doctors/fees', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          video: formData.video_fee, 
          physical: formData.physical_fee 
        })
      });

      if (profileRes.ok && feeRes.ok) {
        setMessage({ type: 'success', text: 'Profile and fees updated successfully!' });
        window.scrollTo(0, 0);
      } else {
        throw new Error('Failed to update some profile settings.');
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-10 text-center font-bold text-gray-500 animate-pulse">Loading Profile Editor...</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto mt-4">
      <header className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-800">Edit Professional Profile</h1>
          <p className="text-sm text-gray-500">Manage how patients see you on the Rural Telemedicine portal.</p>
        </div>
        <button 
          onClick={() => setCurrentPage('doctor-dashboard')} 
          className="text-sm font-bold text-green-600 hover:text-green-800 underline"
        >
          &larr; Back to Dashboard
        </button>
      </header>

      {message.text && (
        <div className={`p-4 mb-6 rounded-lg font-bold text-sm ${message.type === 'success' ? 'bg-green-100 text-green-800 border border-green-300' : 'bg-red-100 text-red-800 border border-red-300'}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-6">
        
        {/* Section: Consultation Fees */}
        <div className="p-4 bg-green-50 rounded-lg border border-green-100">
          <h3 className="text-lg font-bold text-green-800 mb-4 border-b border-green-200 pb-2">💳 Consultation Fees (₹)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Telemedicine (Video) Fee</label>
              <input type="number" name="video_fee" value={formData.video_fee} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500" required />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Physical Visit Fee</label>
              <input type="number" name="physical_fee" value={formData.physical_fee} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500" required />
            </div>
          </div>
        </div>

        {/* Section: Professional Details */}
        <div>
          <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">⚕️ Medical Credentials</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Specialization</label>
              <input type="text" name="specialty" value={formData.specialty} onChange={handleChange} placeholder="e.g. General Medicine, Cardiologist" className="w-full p-2 border border-gray-300 rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Qualifications</label>
              <input type="text" name="qualification" value={formData.qualification} onChange={handleChange} placeholder="e.g. MBBS, MD" className="w-full p-2 border border-gray-300 rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Years of Experience</label>
              <input type="number" name="experience_years" value={formData.experience_years} onChange={handleChange} placeholder="e.g. 5" className="w-full p-2 border border-gray-300 rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Medical License Number</label>
              <input type="text" name="license_number" value={formData.license_number} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md bg-gray-50" />
            </div>
          </div>
        </div>

        {/* Section: Public Profile */}
        <div>
          <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">🌍 Public Profile Information</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Spoken Languages</label>
              <input type="text" name="spoken_languages" value={formData.spoken_languages} onChange={handleChange} placeholder="e.g. English, Bengali, Hindi" className="w-full p-2 border border-gray-300 rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Working Hours</label>
              <input type="text" name="working_hours" value={formData.working_hours} onChange={handleChange} placeholder="e.g. Mon-Fri, 9:00 AM - 2:00 PM" className="w-full p-2 border border-gray-300 rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Short Biography</label>
              <textarea name="bio" value={formData.bio} onChange={handleChange} rows="3" placeholder="Tell patients about your medical background..." className="w-full p-2 border border-gray-300 rounded-md"></textarea>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Treatments & Procedures Offered</label>
              <textarea name="treatments_offered" value={formData.treatments_offered} onChange={handleChange} rows="2" placeholder="e.g. Fever management, Diabetes care..." className="w-full p-2 border border-gray-300 rounded-md"></textarea>
            </div>
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button 
            type="submit" 
            disabled={saving}
            className="bg-green-600 text-white font-bold py-3 px-8 rounded-lg shadow-md hover:bg-green-700 transition disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Profile Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}