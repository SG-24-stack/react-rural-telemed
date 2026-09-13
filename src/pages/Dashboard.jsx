import React, { useState, useContext, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { LanguageContext } from '../context/LanguageContext';
import { OfflineSyncContext } from '../context/OfflineSyncContext';
import { AuthContext } from '../context/AuthContext';
import EmergencySOS from './EmergencySOS';
import AnimatedMedicalBackground from '../components/AnimatedMedicalBackground';
export default function Dashboard({ setCurrentPage }) {
  const { t, language, setLanguage } = useContext(LanguageContext);
  const { isOffline } = useContext(OfflineSyncContext);
  const { user } = useContext(AuthContext) || {};
  const [pharmacyStatus, setPharmacyStatus] = useState('');
  const [chwVillageName] = useState('xyz Rural Sector - Block B');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeSubPanel, setActiveSubPanel] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [prescription, setPrescription] = useState(null);
  const [loadingPrescription, setLoadingPrescription] = useState(true);
  const [prescriptionDownloaded,setPrescriptionDownloaded]=useState(()=>
    localStorage.getItem("prescriptionDownloaded")==="true"
  );
  const [villageRoster] = useState([
    {
      id: 1,
      family: 'Chandra Household',
      members: 4,
      nextVaccine: 'Polio Booster (Aug 25)',
      status: 'Pending'
    },
    {
      id: 2,
      family: 'Das Family',
      members: 5,
      nextVaccine: 'Maternal Care Checkup',
      status: 'Completed'
    }
  ]);
  useEffect(() => {
    const fetchPrescription = async () => {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          console.error('No authentication token found');
          setLoadingPrescription(false);
          return;
        }

        const res = await fetch(
          'http://localhost:5000/api/prescriptions/my-prescription',
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        const data = await res.json();

        if (res.ok) {
          setPrescription(data.prescription || null);
        } else {
          console.error(
            'Failed to fetch prescription:',
            data.error || 'Unknown error'
          );
          setPrescription(null);
        }
      } catch (error) {
        console.error('Failed to load prescription:', error);
        setPrescription(null);
      } finally {
        setLoadingPrescription(false);
      }
    };

    fetchPrescription();
  }, []);

  const handleRoutePrescription = () => {
    if (!prescription?._id) {
      setPharmacyStatus('No active prescription available.');
      return;
    }

    setPharmacyStatus(
      'Routing e-prescription securely to designated Community Mobile Pharmacy (Unit #4)...'
    );

    setTimeout(() => {
      setPharmacyStatus(
        '✓ Prescription successfully routed! Ready for village community pickup.'
      );
    }, 1500);
  };

  const handleDownloadPDF = async () => {
    if (!prescription?._id) return;

    try {
        const token = localStorage.getItem("token");

        const response = await fetch(
            `http://localhost:5000/api/prescriptions/download/${prescription._id}`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        if (!response.ok) {
            const data = await response.json().catch(() => ({}));

            throw new Error(
                data.error || "Failed to download prescription"
            );
        }

        const blob = await response.blob();

        const pdfUrl = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = pdfUrl;
        link.download = `prescription-${prescription._id}.pdf`;

        document.body.appendChild(link);
        link.click();

        link.remove();
        window.URL.revokeObjectURL(pdfUrl);

    } catch (error) {
        console.error("PDF download error:", error);
        alert(error.message || "Failed to download prescription");
    }
    localStorage.setItem("prescriptionDownloaded","true");
    setPrescriptionDownloaded(true);
};

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setActiveSubPanel(null);
  };

  

  const menuItems = [
    {
      key: 'language',
      label: 'Language',
      desc:
        language === 'english'
          ? 'English'
          : language === 'hindi'
          ? 'हिंदी (Hindi)'
          : 'বাংলা (Bengali)',
      bg: 'bg-teal-100',
      iconColor: 'text-teal-600',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
          />
        </svg>
      ),
      onClick: () => setActiveSubPanel('language')
    },

    {
      key: 'darkmode',
      label: isDarkMode ? 'Dark Mode' : 'Light Mode',
      desc: 'Tap to switch appearance',
      bg: isDarkMode ? 'bg-slate-200' : 'bg-amber-100',
      iconColor: isDarkMode ? 'text-slate-700' : 'text-amber-600',
      icon: isDarkMode ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ),
      onClick: () => setIsDarkMode((v) => !v)
    },

    {
      key: 'password',
      label: 'Change Password',
      desc: 'Update your account password',
      bg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
      ),
      onClick: () => setActiveSubPanel('password')
    },

    {
      key: 'about',
      label: 'About',
      desc: 'App info & version details',
      bg: 'bg-cyan-100',
      iconColor: 'text-cyan-600',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      onClick: () => setActiveSubPanel('about')
    },

    {
      key: 'feedback',
      label: 'Help & Feedback',
      desc: 'Report an issue or suggest a feature',
      bg: 'bg-orange-100',
      iconColor: 'text-orange-600',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      onClick: () => {
        closeDrawer();
        setCurrentPage('feedback');
      }
    },

    {
      key: 'logout',
      label: 'Log Out',
      desc: 'Sign out of your account',
      bg: 'bg-red-100',
      iconColor: 'text-red-600',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
          />
        </svg>
      ),
      onClick: () => {
        localStorage.removeItem('token');
        closeDrawer();
        setCurrentPage('login');
      }
    }
  ];
  return (
    <div className="relative">
      <AnimatedMedicalBackground />

      <div className="p-6 max-w-6xl mx-auto mt-2 space-y-6 relative z-10">

        <header className="flex flex-col md:flex-row justify-between items-center bg-white/90 backdrop-blur p-4 rounded-xl shadow-sm border border-gray-200 gap-4">

          <div className="flex items-center gap-3">

            <button
              onClick={() => setIsDrawerOpen(true)}
              aria-label="Open menu"
              className="p-2 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-transform active:scale-95 shrink-0"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-700"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            <div className="flex flex-col">
              <h1 className="text-2xl font-black text-gray-800">
                {t('dashboard')}
              </h1>

              <span className="h-0.5 w-12 bg-amber-400 rounded-full mt-1" />
            </div>

            {isOffline && (
              <span className="bg-yellow-100 text-yellow-800 text-xs px-3 py-1 rounded-full font-bold border border-yellow-300">
                Offline Mode
              </span>
            )}
          </div>

          {/* Navigation */}

          <div className="flex flex-col sm:flex-row gap-2.5 w-full md:w-auto overflow-x-auto pb-2 sm:pb-0">

            <button
              onClick={() => setCurrentPage('emergency-donation')}
              className="bg-red-600 hover:bg-red-700 text-white px-3.5 py-2.5 rounded-lg font-bold text-xs shadow-md transition-transform active:scale-95 border border-red-500 whitespace-nowrap"
            >
              🏥 Emergency Organ & Blood
            </button>

            <button
              onClick={() => setCurrentPage('diagnostic-router')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2.5 rounded-lg font-bold text-xs shadow-md transition-transform active:scale-95 border border-blue-500 whitespace-nowrap"
            >
              🔬 Smart Lab Router
            </button>

            <button
              onClick={() => setCurrentPage('family-profile')}
              className="bg-teal-700 hover:bg-teal-800 text-white px-3.5 py-2.5 rounded-lg font-bold text-xs shadow-md transition-transform active:scale-95 border border-teal-600 whitespace-nowrap"
            >
              👥 My Profile & Family
            </button>

          </div>
        </header>
            <style>{`
                .dashboard-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 20px;
                    width: 100%;
                    margin-bottom: 24px;
                }

                .dashboard-card {
                    padding: 22px;
                    min-height: 190px;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    border-radius: 16px;
                    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08);
                    transition: transform 0.2s ease,
                                box-shadow 0.2s ease;
                }

                .dashboard-card:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 8px 22px rgba(0, 0, 0, 0.12);
                }

                .dashboard-card .card-icon {
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 25px;
                    margin-bottom: 12px;
                }

                /* Emergency SOS */

                .emergency-card {
                    background: #fff5f5;
                    border-left: 6px solid #e53935;
                }

                .emergency-card .card-icon {
                    background: #ffe0e0;
                }

                .emergency-card h3 {
                    margin: 0 0 7px;
                    font-size: 21px;
                    color: #c62828;
                }

                .emergency-card p {
                    margin: 0 0 18px;
                    color: #555;
                    line-height: 1.5;
                }

                .emergency-card button {
                    width: 100%;
                    padding: 12px 18px;
                    border: none;
                    border-radius: 9px;
                    background: #e53935;
                    color: white;
                    font-size: 15px;
                    font-weight: 600;
                    cursor: pointer;
                }

                .emergency-card button:hover {
                    background: #c62828;
                }

                /* Medicine Ordering */

                .medicine-card {
                    background: #f0fbff;
                    border-left: 6px solid #159bb5;
                }

                .medicine-card .card-icon {
                    background: #d8f3fa;
                }

                .medicine-card h3 {
                    margin: 0 0 7px;
                    font-size: 21px;
                    color: #087f96;
                }

                .medicine-card p {
                    margin: 0 0 18px;
                    color: #555;
                    line-height: 1.5;
                }

                .medicine-card button {
                    width: 100%;
                    padding: 12px 18px;
                    border: none;
                    border-radius: 9px;
                    background: #159bb5;
                    color: white;
                    font-size: 15px;
                    font-weight: 600;
                    cursor: pointer;
                }

                .medicine-card button:hover {
                    background: #087f96;
                }

                /* Mobile */

                @media (max-width: 768px) {
                    .dashboard-grid {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
            <div className="dashboard-grid">

                {/* Emergency SOS */}
                <div className="dashboard-card emergency-card">

                    <div>
                        <div className="card-icon">
                            🚨
                        </div>

                        <h3>Emergency SOS</h3>

                        <p>
                            Get immediate emergency assistance,
                            ambulance support, and nearby emergency care.
                        </p>
                    </div>

                    <button
                        onClick={() =>
                            setCurrentPage("emergency-sos")
                        }
                    >
                        Emergency SOS
                    </button>

                </div>
                <div className="dashboard-card medicine-card">

                    <div>
                        <div className="card-icon">
                            💊
                        </div>

                        <h3>Medicine Ordering</h3>

                        <p>
                            Order medicines online and track
                            delivery to your village.
                        </p>
                    </div>

                    <button
                        onClick={() =>
                            setCurrentPage("medicine-ordering")
                        }
                    >
                        Order Medicines
                    </button>

                </div>

            </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

          {/* Tele Consultation */}

          <div className="bg-white/90 backdrop-blur border-l-4 border-green-500 p-5 rounded-lg shadow-sm flex flex-col justify-between">

            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-1">
                {t('teleConsultation')}
              </h3>

              <p className="text-gray-600 mb-4 text-xs">
                {t('teleDesc')}
              </p>
            </div>

            <button
              onClick={() => setCurrentPage('patient-video')}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded font-bold text-sm shadow transition-transform active:scale-95"
            >
              {t('startCall')}
            </button>

          </div>

          {/* Smart Care Reminders */}

          <div className="bg-white/90 backdrop-blur border-l-4 border-teal-500 p-5 rounded-lg shadow-sm flex flex-col justify-between">

            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-1">
                📲 Smart Care Reminders
              </h3>

              <p className="text-gray-600 mb-4 text-xs">
                Automated SMS, Voice Call, WhatsApp, and printed reminders for upcoming patient visits.
              </p>
            </div>

            <button
              onClick={() => setCurrentPage('reminders')}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2 rounded font-bold text-sm shadow transition-transform active:scale-95"
            >
              Open Care Reminders
            </button>

          </div>

          {/* Emergency Admission */}

          <div className="bg-red-600 p-5 rounded-xl shadow-lg border border-red-700 flex flex-col justify-between animate-pulse">

            <div>
              <h3 className="text-lg font-black text-white mb-1">
                🚨 Emergency Admission
              </h3>

              <p className="text-red-100 mb-4 text-xs">
                Book beds, dispatch ambulances, and apply govt. schemes instantly.
              </p>
            </div>

            <button
              onClick={() => setCurrentPage('emergency-admission')}
              className="w-full bg-white text-red-600 py-3 rounded-lg font-black text-sm shadow-md transition-transform active:scale-95"
            >
              Open Portal
            </button>

          </div>

        </div>

        {/* =====================================================
            AI HOSPITAL FINDER
        ====================================================== */}

        <div className="bg-white/90 backdrop-blur p-6 rounded-xl shadow-sm border border-gray-200">

          <h3 className="text-lg font-bold text-gray-800 border-b pb-3 mb-3">
            🗺️ AI Hospital & Clinic Finder
          </h3>

          <p className="text-xs text-gray-600 mb-4">
            Find the nearest hospital or clinic based on your symptoms and live location, with an interactive map.
          </p>

          <button
            onClick={() => setCurrentPage('hospital-finder')}
            className="w-full bg-teal-800 hover:bg-teal-900 text-white py-2.5 rounded-lg font-bold text-sm shadow transition-transform active:scale-95"
          >
            Open Hospital Finder
          </button>

        </div>

        {/* =====================================================
            EMERGENCY SOS
        ====================================================== */}

        <EmergencySOS />

        {/* =====================================================
            DIGITAL PRESCRIPTION
        ====================================================== */}

        <div className="bg-white/90 backdrop-blur p-6 rounded-xl shadow-sm border border-gray-200">

          <h3 className="text-lg font-bold text-gray-800 border-b pb-3 mb-3">
            💊 Digital Prescription & Pharmacy Routing
          </h3>

          <p className="text-xs text-gray-600 mb-4">
            View your latest electronic prescription, route it to a community pharmacy, and download the official prescription PDF.
          </p>

          {/* Loading */}

          {loadingPrescription ? (

            <div className="flex items-center justify-center py-8">

              <div className="flex items-center gap-3 text-sm text-gray-500">

                <div className="h-5 w-5 border-2 border-teal-600 border-t-transparent rounded-full animate-spin" />

                Loading prescription details...

              </div>

            </div>

          ) : !prescription ? (

            /* No prescription */

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 text-center">

              <div className="text-4xl mb-2">
                📄
              </div>

              <p className="font-bold text-gray-700">
                No active prescription
              </p>

              <p className="text-xs text-gray-500 mt-1">
                Your latest prescription will appear here after a doctor creates one.
              </p>

            </div>

          ) : (

            /* Prescription available */

            <div className="space-y-4">

              <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">

                <div className="flex flex-col sm:flex-row justify-between gap-4">

                  <div className="space-y-2 text-sm text-gray-700">

                    <p>
                      <strong>Disease:</strong>{' '}
                      {prescription.disease || 'N/A'}
                    </p>

                    <p>
                      <strong>Diagnosis:</strong>{' '}
                      {prescription.diagnosis || 'N/A'}
                    </p>

                    <p>
                      <strong>Medicines:</strong>{' '}
                      {prescription.medicines || 'N/A'}
                    </p>

                    <p>
                      <strong>Treatment:</strong>{' '}
                      {prescription.treatment || 'N/A'}
                    </p>

                    <p>
                      <strong>Suggestions:</strong>{' '}
                      {prescription.suggestions || 'N/A'}
                    </p>

                    <p>
                      <strong>Next Steps:</strong>{' '}
                      {prescription.next_steps || 'N/A'}
                    </p>

                    {prescription.notes && (
                      <p>
                        <strong>Doctor's Notes:</strong>{' '}
                        {prescription.notes}
                      </p>
                    )}

                    <p className="text-gray-500 text-xs pt-1">
                      Issued by:{' '}
                      <strong>
                        Dr. {prescription.doctor_id?.name || 'Doctor'}
                      </strong>
                    </p>

                    <p className="text-gray-400 text-xs">
                      Prescription ID:{' '}
                      {prescription._id}
                    </p>

                  </div>

                  <div className="flex items-start">

                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-[10px] font-black uppercase">
                      Active Prescription
                    </span>

                  </div>

                </div>

              </div>

              {/* Buttons */}

              <div className="flex flex-col sm:flex-row gap-3">

                <button
                  onClick={handleRoutePrescription}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold px-5 py-2.5 rounded-lg text-xs shadow transition-transform active:scale-95"
                >
                  🛵 Route to Community Pharmacy
                </button>

                <button
                  onClick={handleDownloadPDF}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-lg text-xs shadow transition-transform active:scale-95"
                >
                  📄 Download Prescription PDF
                </button>

              </div>

              {/* Pharmacy Status */}

              {pharmacyStatus && (
                <div className="p-3 bg-green-50 text-green-800 rounded-lg border border-green-200 text-xs font-bold">
                  {pharmacyStatus}
                </div>
              )}

            </div>

          )}

        </div>

        {/* =====================================================
            CHW HOUSEHOLD PORTAL
        ====================================================== */}

        <div className="bg-white/90 backdrop-blur p-6 rounded-xl shadow-sm border border-gray-200">

          <div className="flex justify-between items-center border-b pb-3 mb-4">

            <div>

              <h3 className="text-lg font-bold text-gray-800">
                🏡 Community Health Worker (CHW) Household Portal
              </h3>

              <p className="text-xs text-gray-500">
                Village Sector:{' '}
                <strong>{chwVillageName}</strong>
              </p>

            </div>

            <span className="bg-teal-100 text-teal-800 text-[10px] font-black px-2.5 py-1 rounded-full uppercase">
              CHW Intermediary Mode
            </span>

          </div>

          <div className="overflow-x-auto">

            <table className="w-full text-left text-xs border-collapse">

              <thead>

                <tr className="bg-gray-100 text-gray-700 border-b">

                  <th className="p-2.5">
                    Household Unit
                  </th>

                  <th className="p-2.5">
                    Members
                  </th>

                  <th className="p-2.5">
                    Vaccination / Checkup Schedule
                  </th>

                  <th className="p-2.5">
                    Status
                  </th>

                </tr>

              </thead>

              <tbody>

                {villageRoster.map((item) => (

                  <tr
                    key={item.id}
                    className="border-b hover:bg-gray-50"
                  >

                    <td className="p-2.5 font-bold text-gray-900">
                      {item.family}
                    </td>

                    <td className="p-2.5 text-gray-600">
                      {item.members} members
                    </td>

                    <td className="p-2.5 font-semibold text-green-700">
                      {item.nextVaccine}
                    </td>

                    <td className="p-2.5">

                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          item.status === 'Completed'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {item.status}
                      </span>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>

      </div>

      {/* =======================================================
          SETTINGS DRAWER
      ======================================================== */}

      {createPortal(
        <>
          {/* Overlay */}

          {isDrawerOpen && (
            <div
              className="fixed inset-0 bg-black/40 z-[9998]"
              onClick={closeDrawer}
            />
          )}

          {/* Drawer */}

          <div
            className={`fixed top-0 left-0 h-dvh w-80 max-w-[85vw] bg-white shadow-2xl z-[9999] transform transition-transform duration-300 ease-in-out overflow-y-auto ${
              isDrawerOpen
                ? 'translate-x-0'
                : '-translate-x-full'
            }`}
          >

            {/* Account Header */}

            <div className="p-4 bg-gradient-to-r from-teal-800 to-cyan-800 text-white flex items-center gap-3">

              <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center text-xl font-black shrink-0">

                {(user?.name || 'U')
                  .charAt(0)
                  .toUpperCase()}

              </div>

              <div className="min-w-0">

                <p className="font-bold text-sm truncate">
                  {user?.name || 'My Account'}
                </p>

                <p className="text-teal-100 text-xs truncate">
                  {user?.email ||
                    user?.phone ||
                    'Rural Telemedicine User'}
                </p>

              </div>

            </div>

            {/* =================================================
                MAIN MENU
            ================================================== */}

            {!activeSubPanel && (
              <>

                <div className="flex justify-between items-center p-4 border-b border-gray-200">

                  <div>

                    <h3 className="text-lg font-bold text-gray-800">
                      Corner Settings & Account
                    </h3>

                    <p className="text-[11px] text-gray-500 mt-0.5">
                      Manage language, appearance, and account
                    </p>

                  </div>

                  <button
                    onClick={closeDrawer}
                    aria-label="Close menu"
                    className="p-1.5 rounded-lg hover:bg-gray-100 shrink-0"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>

                </div>

                <nav className="py-2">

                  {menuItems.map((item, idx) => (

                    <React.Fragment key={item.key}>

                      <button
                        onClick={item.onClick}
                        className="w-full flex items-center gap-3.5 px-4 py-3.5 hover:bg-gray-50 transition-colors text-left"
                      >

                        <span
                          className={`flex items-center justify-center h-9 w-9 rounded-full ${item.bg} ${item.iconColor} shrink-0`}
                        >
                          {item.icon}
                        </span>

                        <span className="flex-1 min-w-0">

                          <p
                            className={`text-sm font-bold ${
                              item.key === 'logout'
                                ? 'text-red-600'
                                : 'text-gray-800'
                            }`}
                          >
                            {item.label}
                          </p>

                          <p className="text-[11px] text-gray-500 truncate">
                            {item.desc}
                          </p>

                        </span>

                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 text-gray-300 shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 5l7 7-7 7"
                          />
                        </svg>

                      </button>

                      {idx === 3 && (
                        <div className="border-t border-gray-100 my-1" />
                      )}

                    </React.Fragment>

                  ))}

                </nav>

              </>
            )}

            {/* =================================================
                LANGUAGE PANEL
            ================================================== */}

            {activeSubPanel === 'language' && (
              <>

                <div className="flex items-center gap-3 p-4 border-b border-gray-200">

                  <button
                    onClick={() => setActiveSubPanel(null)}
                    className="p-1.5 rounded-lg hover:bg-gray-100"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>

                  <h3 className="text-lg font-bold text-gray-800">
                    Select Language
                  </h3>

                </div>

                <div className="p-4 space-y-2">

                  {[
                    {
                      key: 'english',
                      label: 'English'
                    },
                    {
                      key: 'hindi',
                      label: 'हिंदी (Hindi)'
                    },
                    {
                      key: 'bengali',
                      label: 'বাংলা (Bengali)'
                    }
                  ].map((lang) => (

                    <button
                      key={lang.key}
                      onClick={() => setLanguage(lang.key)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border text-sm font-bold transition-colors ${
                        language === lang.key
                          ? 'bg-teal-700 text-white border-teal-800'
                          : 'bg-gray-50 text-gray-800 border-gray-200 hover:bg-gray-100'
                      }`}
                    >

                      {lang.label}

                      {language === lang.key && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}

                    </button>

                  ))}

                </div>

              </>
            )}
            {activeSubPanel === 'password' && (
              <>

                <div className="flex items-center gap-3 p-4 border-b border-gray-200">

                  <button
                    onClick={() => setActiveSubPanel(null)}
                    className="p-1.5 rounded-lg hover:bg-gray-100"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>

                  <h3 className="text-lg font-bold text-gray-800">
                    Change Password
                  </h3>

                </div>

                <div className="p-4 space-y-3">

                  <div>

                    <label className="text-[11px] font-bold text-gray-500 uppercase">
                      Current Password
                    </label>

                    <input
                      type="password"
                      className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
                      placeholder="••••••••"
                    />

                  </div>

                  <div>

                    <label className="text-[11px] font-bold text-gray-500 uppercase">
                      New Password
                    </label>

                    <input
                      type="password"
                      className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
                      placeholder="••••••••"
                    />

                  </div>

                  <div>

                    <label className="text-[11px] font-bold text-gray-500 uppercase">
                      Confirm New Password
                    </label>

                    <input
                      type="password"
                      className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
                      placeholder="••••••••"
                    />

                  </div>

                  <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2.5 rounded-lg font-bold text-sm shadow transition-transform active:scale-95">
                    Update Password
                  </button>

                </div>

              </>
            )}
            {activeSubPanel === 'about' && (
              <>
                <div className="flex items-center gap-3 p-4 border-b border-gray-200">

                  <button
                    onClick={() => setActiveSubPanel(null)}
                    className="p-1.5 rounded-lg hover:bg-gray-100"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>

                  <h3 className="text-lg font-bold text-gray-800">
                    About This App
                  </h3>

                </div>

                <div className="p-4 space-y-3 text-xs text-gray-600">

                  <p>
                    A rural telehealth platform connecting village households with doctors, community health workers,
                    emergency dispatch, digital pharmacies, and AI-assisted symptom triage — built to work reliably
                    even with intermittent connectivity.
                  </p>

                  <div className="pt-2 border-t border-gray-100">

                    <p>
                      <strong>Version:</strong> 1.0.0
                    </p>

                    <p>
                      <strong>Region:</strong> West Bengal, India
                    </p>

                  </div>

                </div>

              </>
            )}

          </div>
        </>,
        document.body
      )}

    </div>
  );
}

