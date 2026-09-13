import React, { useEffect,useState } from 'react';
import api from '../constants/api.js';
const ONLINE_PAYMENT_METHODS = new Set([
  'UPI / Online Payment (Google Pay / PhonePe / Paytm)',
]);
const NO_PAYMENT_STEP_METHODS = new Set([
  'PM-JAY Government Scheme Waiver (₹0 Balance)',
  'Emergency Subsidized Rural Package',
]);

export default function EmergencyAdmissionDashboard({ setCurrentPage }) {
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [admissionMode, setAdmissionMode] = useState('Online Digital Booking');
  const [patientName, setPatientName] = useState('');
  const [phone, setPhone] = useState('');
  const [age, setAge] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('PM-JAY Government Scheme Waiver (₹0 Balance)');
  const [admissionConfirmed, setAdmissionConfirmed] = useState(false);
  const [hospital,setHospitals]=useState([]);
  const [loadingHospitals,setLoadingHospitals]=useState(true);
  const [hospitalError,setHospitalError]=useState('');
  const [step, setStep] = useState('form');
  const [upiId, setUpiId] = useState('');
  const [onlinePaymentDone, setOnlinePaymentDone] = useState(false);
  const [physicalPaymentOption, setPhysicalPaymentOption] = useState('Cash at Reception Desk');
  const [physicalPaymentAcknowledged, setPhysicalPaymentAcknowledged] = useState(false);
  useEffect(()=>{
    const fetchHospitals=async()=>{
      try{
        setLoadingHospitals(true);
        setHospitalError('');
        const response=await api.get('/hospitals');
        setHospitals(response.data);
      }catch(error){
        console.error('Failed to fetch hospitals:',error);
        setHospitalError(
          error?.response?.data?.error ||
          'Failed to load hospital information'
        );
      } finally {
        setLoadingHospitals(false);
      }
    };
    fetchHospitals();
  },[]);
  const handleProceedToForm = (hospital) => {
    if (hospital.availableEmergencyBeds === 0) {
      alert('This hospital is currently at full capacity. Please select an available facility.');
      return;
    }
    setSelectedHospital(hospital);
    setAdmissionConfirmed(false);
    setStep('form');
    setOnlinePaymentDone(false);
    setPhysicalPaymentAcknowledged(false);
  };

  const isOnlineMode = admissionMode === 'Online Digital Booking';
  const needsOnlineGateway = isOnlineMode && ONLINE_PAYMENT_METHODS.has(paymentMethod);
  const skipsPaymentEntirely = NO_PAYMENT_STEP_METHODS.has(paymentMethod);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!patientName.trim() || !phone.trim()) {
      alert('Please fill in all mandatory patient registration details.');
      return;
    }
    if(NO_PAYMENT_STEP_METHODS.has(paymentMethod)){
      setAdmissionConfirmed(true);
      setStep('confirmed');
      return;
    }
    if(ONLINE_PAYMENT_METHODS.has(paymentMethod)){
      setStep('online-payment');
      return;
    }
    setStep('physical-payment');
  };
  const handleOnlinePaymentSubmit = (e) => {
    e.preventDefault();
    if (!upiId.trim()) {
      alert('Please enter a UPI ID or select a payment app to continue.');
      return;
    }
    setOnlinePaymentDone(true);
    setAdmissionConfirmed(true);
    setStep('confirmed');
  };

  const handlePhysicalPaymentSubmit = (e) => {
    e.preventDefault();
    if(!physicalPaymentAcknowledged){
      alert('Please acknowledge the payment option');
      return;
    }
    setAdmissionConfirmed(true);
    setStep('confirmed')
  };

  const resetToDashboard = () => {
    setSelectedHospital(null);
    setPatientName('');
    setPhone('');
    setAge('');
    setPaymentMethod(
      'PM-JAY Government Scheme Waiver (0 balance)'
    );
    setAdmissionConfirmed(false);
    setStep('form');
    setUpiId('');
    setOnlinePaymentDone(false);
    setPhysicalPaymentAcknowledged(false);
    setCurrentPage('dashboard');
  };
  if(!selectedHospital && step === 'form'){
    return (
      <div className="min-h-screen bg-slate-50 p-4 sm:p-6">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                  Emergency Services
                </p>
                <h1 className="text-2xl sm:text-3xl font-black text-emerald-950 mt-1">
                  Emergency Admission
                </h1>
                <p className="text-sm text-gray-500 mt-2">
                  Find an available hospital and book and emergency bed.
                </p>
              </div>
              <button
               type="button"
               onClick={resetToDashboard}
               className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-sm"
              >
                ← Dashboard
              </button>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="mb-5">
              <h2 className="text-xl font-black text-gray-900">
                Available Hospitals
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Select a hospital with an available emergency bed
              </p>
            </div>
            <div className="space-y-3">
              {loadingHospitals && (
                <p className="text-sm text-gray-500">
                  Loading hospitals and emergency bed availability...
                </p>
              )}
              {hospitalError && (
                <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                  {hospitalError}
                </div>
              )}
              {!loadingHospitals &&
              !hospitalError &&
              hospital.length===0 && (
              <div className="text-sm text-gray-500 bg-gray-50 border border-gray-200
              rounded-lg px-4 py-3">
                No hospitals are currently available
                </div>
                )}
                {!loadingHospitals && 
                hospital.map((h)=>(
                  <div
                  key={h.id}
                  className={`p-4 rounded-2xl border flex justify-between items-center gap-4 transition-all ${
                      h.availableEmergencyBeds > 0
                        ? 'bg-emerald-50/50 border-emerald-200'
                        : 'bg-red-50/30 border-red-200 opacity-70'
                    }`}
                  >
                    <div>
                  <h4 className="font-black text-gray-900 text-base">
                    {h.name}
                  </h4>
                  <p className="text-xs text-gray-600 mt-1">
                    📍 {h.location}
                  </p>
                  <p className={`text-xs mt-1 font-bold ${
                    h.availableEmergencyBeds>0
                    ?'text-emerald-700'
                    :'text-red-600'
                  }`}
                  >
                  {h.availableEmergencyBeds>0
                    ?`${h.availableEmergencyBeds}Emergency  Beds Open`:'Full Capacity'}
                  </p>
            </div>
            <button
             type="button"
             onClick={()=>handleProceedToForm(h)}
             disabled={h.availableEmergencyBeds === 0}
             className={`px-5 py-2.5 rounded-xl font-bold text-xs shadow transition-transform active:scale-95 whitespace-nowrap ${
                        h.availableEmergencyBeds > 0
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {h.availableEmergencyBeds > 0
                        ? 'Book & Register 🚑'
                        : 'Full Capacity'}
                    </button>
                  </div>
                ))}
          </div>
        </div>
      </div>
      </div>
    );
  }
   if(step === 'form' && selectedHospital){
    return(
      <div className="min-h-screen bg-slate-50 p-4 sm:p-6">
        <div className="max-w-3xl mx-auto space-y-6">

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <button
              type="button"
              onClick={() => setSelectedHospital(null)}
              className="text-sm font-bold text-emerald-700 hover:text-emerald-900 mb-4"
            >
              ← Back to hospitals
            </button>
          <p className="text-xs font-bold uppercase tracking-wider text-emerald-600">
              Selected Hospital
          </p>  
        <h1 className="text-2xl font-black text-gray-900 mt-1">
          {selectedHospital.name}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          📍 {selectedHospital.location}
        </p>
         <div className="mt-3 inline-flex px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold">
              🛏️ {selectedHospital.availableEmergencyBeds}{' '}
              Emergency Beds Available
            </div>
        </div>
        <form 
        onSubmit={handleFormSubmit}
        className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-5"
        >
         <div>
          <h2 className="text-xl font-black text-gray-900">
            Patient Information
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Enter the details required for emergency admission
          </p>
          </div> 
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Patient Name
            </label>
            <input
             type="text"
             value={patientName}
             onChange={(e)=>setPatientName(e.target.value)}
             placeholder="Enter patient name"
             className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Phone Number
              </label>

              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter phone number"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Age
              </label>

              <input
                type="number"
                min="0"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="Enter age"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Admission Mode
              </label>
              <select
                value={admissionMode}
                onChange={(e) => setAdmissionMode(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option>Online Digital Booking</option>
                <option>Emergency Walk-in</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Payment Method
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option>PM-JAY Government Scheme Waiver(₹0 Balance)</option>
                <option>Emergency Subsidized Rural Package</option>
                <option>UPI/Online Payment (Google Pay/PhonePe/Paytm)</option>
                <option>Cash At Hospital Reception</option>
              </select>
            </div>
             <button
               type="submit"
                className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-black py-3.5 rounded-xl shadow"
            >
              Continue →
            </button>
        </form>
        </div>
        </div>
      );
   }
   if(step === 'online-payment'){
    return(
      <div className="min-h-screen bg-slate-50 p-4 sm:p-6">
        <div className="max-w-xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">

            <button
              type="button"
              onClick={() => setStep('form')}
              className="text-sm font-bold text-emerald-700 mb-5"
            >
              ← Back
            </button>
            <h1 className="text-2xl font-black text-gray-900">
              💳 Online Payment
            </h1>
            <p className="text-sm text-gray-500 mt-2">
              Enter your UPI ID to continue with the emergency admission
            </p>
            <div className="mt-6">
              <label className="block text-sm font-bold text-gray-700 mb-2">
                UPI ID
              </label>
              <input
               type="text"
               value={upiId}
               onChange={(e)=>setUpiId(e.target.value)}
               placeholder="example@upi"
               className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <button
             type="button"
             onClick={handleOnlinePaymentSubmit}
             disabled={onlinePaymentDone}
              className="w-full mt-5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-60 text-white font-black py-3.5 rounded-xl"
            >
              {onlinePaymentDone
                ? 'Processing Payment...'
                : 'Pay & Confirm Admission'}
            </button>
            </div>
        </div>
      </div>
    );
   }
   if(step === 'physical-payment'){
    return(
      <div className="min-h-screen bg-slate-50 p-4 sm:p-6">
        <div className="max-w-xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">

            <button
              type="button"
              onClick={() => setStep('form')}
              className="text-sm font-bold text-emerald-700 mb-5"
            >
              ← Back
            </button>
            <h1 className="text-2xl font-black text-gray-900">
              🏥 Payment at Hospital
            </h1>
            <p className="text-sm text-gray-500 mt-2">
              Payment can be completed at the hospital reception desk
            </p>
            <div className="mt-6">
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Payment Option
              </label>
              <select
               value={physicalPaymentOption}
               onChange={(e)=>
                setPhysicalPaymentOption(e.target.value)
               }
               className="w-full border border-gray-300 rounded-xl px-4 py-3"
              >
                <option>Cash at Reception Desk</option>
                <option>Card at Reception Desk</option>
              </select>
            </div>
            <label className="flex items-start gap-3 mt-5 cursor-pointer">
              <input
                type="checkbox"
                checked={physicalPaymentAcknowledged}
                onChange={(e)=>
                  setPhysicalPaymentAcknowledged(e.target.checked)
                }
                className="mt-1"
                />
                <span className="text-sm text-gray-600">
                  I understand that payment will be completed at the hospital
                  reception desk.
                </span>
            </label>
            <button
             type="button"
             onClick={handlePhysicalPaymentSubmit}
              className="w-full mt-5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-60 text-white font-black py-3.5 rounded-xl"
            >
              Confirm Emergency Admission
            </button>
            </div>
        </div>
      </div>
    );
   }
   if(step === 'confirmed' && admissionConfirmed){
    return (
       <div className="min-h-screen bg-slate-50 p-4 sm:p-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
            <div className="text-6xl mb-4">
              ✅
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-emerald-900">
              Emergency Admission Confirmed
            </h1>
            <p className="text-gray-600 mt-3">
              Your emergency admission request has been registered successfully.
            </p>
            <div className="mt-6 text-left bg-emerald-50 border border-emerald-200 rounded-2xl p-5 space-y-3">

              <div>
                <p className="text-xs text-gray-500 font-bold">
                  Patient
                </p>

                <p className="font-black text-gray-900">
                  {patientName}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-bold">
                  Hospital
                </p>
                <p className="font-blacl text-gray-900">
                  {selectedHospital?.name}
                </p>
              </div>
                <div>
                  <p className="text-xs text-gray-500 font-bold">
                    Location
                  </p>
                  <p className="font-semibold text-gray-700">
                    {selectedHospital?.location}
                  </p>
                </div>
              <div>
                <p className="text-xs text-gray-500 font-bold">
                    Payment
                  </p>
                  <p className="font-semibold text-gray-700">
                    {paymentMethod}
                  </p>
              </div>
            </div>
             <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
              🚑 Ambulance dispatch alert has been sent to the driver
              and hospital reception.
            </div>

            <button
              type="button"
              onClick={resetToDashboard}
              className="mt-6 w-full bg-emerald-700 hover:bg-emerald-800 text-white font-black py-3.5 rounded-xl"
            >
              Return to Dashboard
            </button>
            </div>
            </div>
            </div>
    );
   }
   return null;
  }