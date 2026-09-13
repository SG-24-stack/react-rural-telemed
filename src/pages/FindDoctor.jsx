import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../constants/api';

export default function FindDoctor({ setCurrentPage }) {
  const { user } = useContext(AuthContext);

  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [appointmentType, setAppointmentType] = useState('video');
  const [reason, setReason] = useState('');

  const [isBooking, setIsBooking] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await api.get('/doctors');

      console.log('DOCTORS RESPONSE:', res.data);

      setDoctors(res.data || []);
    } catch (err) {
      console.error('Failed to fetch doctors:', err);

      const backendMsg = err?.response?.data?.error;

      setError(
        backendMsg ||
        'Could not load the doctor list. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const openBooking = (doctor) => {
    setSelectedDoctor(doctor);

    setAppointmentDate('');
    setAppointmentTime('');
    setAppointmentType('video');
    setReason('');

    setBookingError('');
    setBookingSuccess(false);
  };

  const closeBooking = () => {
    setSelectedDoctor(null);
    setBookingError('');
    setBookingSuccess(false);
  };

  const handleConfirmBooking = async (e) => {
    e.preventDefault();

    setBookingError('');

    if (!appointmentDate || !appointmentTime) {
      setBookingError('Please select both a date and a time.');
      return;
    }

    if (!selectedDoctor?._id) {
      setBookingError('Doctor information is missing.');
      return;
    }

    setIsBooking(true);

    try {
      const response = await api.post('/appointments', {
        doctor_id: selectedDoctor._id,
        appointment_date: appointmentDate,
        appointment_time: appointmentTime,
        appointment_type: appointmentType,
        reason: reason
      });

      console.log('APPOINTMENT BOOKED:', response.data);

      setBookingSuccess(true);
    } catch (err) {
      console.error('Booking error:', err);

      const backendMsg = err?.response?.data?.error;

      setBookingError(
        backendMsg ||
        'Failed to book the appointment. Please try again.'
      );
    } finally {
      setIsBooking(false);
    }
  };

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="p-6 max-w-6xl mx-auto mt-4 space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">

        <div>
          <h2 className="text-2xl font-black text-gray-800">
            🔎 Find a Doctor
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Browse doctors and book a consultation.
          </p>
        </div>

        <button
          onClick={() =>
            setCurrentPage && setCurrentPage('dashboard')
          }
          className="text-sm bg-gray-200 text-gray-700 font-bold px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
        >
          ← Back
        </button>

      </div>

      {/* LOADING */}
      {loading && (
        <p className="text-sm text-gray-500 text-center py-12 animate-pulse">
          Loading doctors...
        </p>
      )}

      {/* ERROR */}
      {!loading && error && (
        <div className="text-center py-12">

          <p className="text-sm text-red-600 font-bold mb-4">
            {error}
          </p>

          <button
            onClick={fetchDoctors}
            className="bg-emerald-600 text-white px-5 py-2 rounded-lg font-bold text-sm"
          >
            Refresh
          </button>

        </div>
      )}
      {!loading && !error && doctors.length === 0 && (
        <p className="text-sm text-gray-400 text-center py-12">
          No doctors are currently registered.
        </p>
      )}
      {!loading && !error && doctors.length > 0 && (

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

          {doctors.map((doctor) => (

            <div
              key={doctor._id}
              className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow"
            >

              {/* Doctor heading */}
              <div className="flex items-center gap-3 mb-4">

                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xl font-black">
                  {doctor.name?.charAt(0)?.toUpperCase() || 'D'}
                </div>

                <div>

                  <h3 className="font-black text-gray-900">
                    {doctor.name}
                  </h3>

                  <p className="text-xs text-gray-500">
                    {doctor.specialty}
                  </p>

                </div>

              </div>

              {/* Qualification */}
              {doctor.qualification && (
                <p className="text-xs text-gray-500 mb-3">
                  🎓 {doctor.qualification}
                </p>
              )}

              {/* Council */}
              {doctor.council && (
                <p className="text-xs text-gray-500 mb-3">
                  🏛️ {doctor.council}
                </p>
              )}

              {/* License */}
              {doctor.license_number && (
                <p className="text-xs text-gray-500 mb-4">
                  📋 License: {doctor.license_number}
                </p>
              )}

              {/* Hospital */}
              {doctor.hospital_id && (
                <div className="border-t border-gray-100 pt-3 mb-4">

                  <p className="text-xs font-bold text-gray-700">
                    🏥 Hospital
                  </p>

                  <p className="text-xs text-gray-500 mt-1">
                    {doctor.hospital_id?.name || 'Hospital'}
                  </p>

                </div>
              )}

              {/* Book */}
              <button
                onClick={() => openBooking(doctor)}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-lg text-sm shadow-sm transition-transform active:scale-95"
              >
                Book Appointment
              </button>

            </div>

          ))}

        </div>

      )}

      {/* BOOKING MODAL */}
      {selectedDoctor && (

        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">

          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative">

            {/* Close */}
            <button
              onClick={closeBooking}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 font-bold"
            >
              ✕
            </button>

            {/* SUCCESS */}
            {bookingSuccess ? (

              <div className="text-center py-8">

                <div className="text-4xl mb-3">
                  ✅
                </div>

                <h3 className="text-lg font-black text-emerald-700">
                  Appointment Booked!
                </h3>

                <p className="text-sm text-gray-500 mt-2">
                  Your appointment has been confirmed.
                </p>

              </div>

            ) : (

              <>

                <h3 className="text-lg font-black text-gray-900 mb-1">
                  Book with Dr. {selectedDoctor.name}
                </h3>

                <p className="text-xs text-gray-500 mb-5">
                  {selectedDoctor.specialty || 'General Physician'}
                </p>

                {/* ERROR */}
                {bookingError && (

                  <div className="mb-4 p-2.5 bg-red-50 text-red-700 rounded-lg border border-red-200 text-xs font-bold">
                    ⚠ {bookingError}
                  </div>

                )}

                <form
                  onSubmit={handleConfirmBooking}
                  className="space-y-4"
                >

                  {/* TYPE */}
                  <div>

                    <label className="block text-xs font-bold text-gray-700 mb-2">
                      Consultation Type
                    </label>

                    <div className="grid grid-cols-2 gap-2">

                      <button
                        type="button"
                        onClick={() => setAppointmentType('video')}
                        className={`py-2.5 rounded-lg text-xs font-bold border-2 ${
                          appointmentType === 'video'
                            ? 'bg-blue-50 text-blue-700 border-blue-500'
                            : 'bg-white text-gray-500 border-gray-200'
                        }`}
                      >
                        📹 Video
                      </button>

                      <button
                        type="button"
                        onClick={() => setAppointmentType('in-person')}
                        className={`py-2.5 rounded-lg text-xs font-bold border-2 ${
                          appointmentType === 'in-person'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-500'
                            : 'bg-white text-gray-500 border-gray-200'
                        }`}
                      >
                        🏥 In-Person
                      </button>

                    </div>

                  </div>

                  {/* DATE */}
                  <div>

                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Appointment Date
                    </label>

                    <input
                      type="date"
                      min={todayStr}
                      value={appointmentDate}
                      onChange={(e) =>
                        setAppointmentDate(e.target.value)
                      }
                      className="w-full p-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                      required
                    />

                  </div>

                  {/* TIME */}
                  <div>

                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Appointment Time
                    </label>

                    <input
                      type="time"
                      value={appointmentTime}
                      onChange={(e) =>
                        setAppointmentTime(e.target.value)
                      }
                      className="w-full p-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                      required
                    />

                  </div>

                  {/* REASON */}
                  <div>

                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Reason for Visit
                    </label>

                    <textarea
                      value={reason}
                      onChange={(e) =>
                        setReason(e.target.value)
                      }
                      placeholder="Describe your problem..."
                      rows="3"
                      className="w-full p-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                    />

                  </div>

                  {/* CONFIRM */}
                  <button
                    type="submit"
                    disabled={isBooking}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-black py-3 rounded-lg text-sm shadow-md transition-transform active:scale-95"
                  >
                    {isBooking
                      ? 'Booking...'
                      : 'Confirm Appointment'}
                  </button>

                </form>

              </>

            )}

          </div>

        </div>

      )}

    </div>
  );
}