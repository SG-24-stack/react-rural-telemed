import React, { useEffect,useState } from 'react';
import api from '../constants/api.js';
export default function CareReminders({ setCurrentPage }) {
  const [appointments, setAppointments] = useState([]);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState("");
  useEffect(()=>{
    const fetchAppointments=async()=>{
      try{
        setLoading(true);
        setError(""); 
        const res=await api.get("/appointments/my-appointments");
        const data=Array.isArray(res.data)?res.data:res.data.appointments || [];
        const confirmedAppointments=data.filter(
          (appointment)=>appointment.status === "confirmed"
        );
        setAppointments(confirmedAppointments);
      } catch(err){
        console.error("Error loading appointments:",err);
        setError(
          err.response?.data?.error ||
          "Could not load your appointments."
        );
      } finally {
        setLoading(false);
      }
      };
      fetchAppointments();
    },[]);
    useEffect(()=>{
      if(appointments.length === 0)
        return;
      if(!("Notification" in window))
        return;
      if(Notification.permission!=="granted")
        return;
      appointments.forEach((appointment)=>{
        const days=getDaysDifference(
          appointment.appointment_date
        );
        if(days<0 || days>2)
          return;
        const reminderKey=`appointment-reminder-$
        {appointment._id}-${days}`;
        if(localStorage.getItem(reminderKey)){
          return;
        }
        let message="";
        if(days===0){
          message=`Your appointment is today at ${appointment.appointment_time}.`;
        } else if (days === 1){
          message=`Your appointment is tomorrow at ${appointment.appointment_time}.`;
        } else if (days === 2){
          message=`Your appointment is day after tomorrow at ${appointment.appointment_time}.`;
        } 
        new Notification("Smart Care Reminder",{
          body:message,
        });
        localStorage.setItem(reminderKey,"true");
      });
    },[appointments]);
    const getDaysDifference=
    (appointmentDate)=>{
      const today=new Date();
      const appointment=new Date(appointmentDate);
      today.setHours(0,0,0,0);
      appointment.setHours(0,0,0,0);
      const difference=appointment-today;
      return Math.ceil(difference/(1000*60*60*24));
    };
    const getReminderText=(days)=>{
      if(days === 0){
        return "Your appointment is today!";
      }
      if(days === 1){
        return "Your appointment is tomorrow!";
      }
      if(days === 2){
        return "Your appointment is day after tomorrow!";
      }
      return `Your appointment is in ${days} days`;
    };
     return(
      <div className="p-6 max-w-5xl mx-auto space-y-6">
        <header className="bg-white/90
        backdrop-blur p-6 rounded-2xl shadow-sm border
        border-gray-200 flex justify-between
        items-center">
          <div>
            <h1 className="text-2xl font-black text-emerald-900">
              🔔 Smart Care Reminder
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Never miss your upcoming healthcare appointments
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button
             onClick={async ()=>{
              if("Notification" in window){
                const permission=await Notification.requestPermission();
              if(permission==="granted"){
                new Notification("🔔 Smart Care Reminder",{
                  body:"Appointment reminders are now enabled!",
                });
              }
              }
             }}
             className="bg-emerald-600
             text-white px-4 py-2 rounded-lg
             text-sm font-bold
             hover:bg-emerald-700"
             >
              🔔 Enable Notifications
             </button>
          <button
           onClick={()=>
            setCurrentPage("dashboard")}
            className="text-sm font-bold text-gray-600 hover:text-gray-900 underline">
              Back to Dashboard
            </button>
            </div>
        </header>
        {loading && (
          <div className="bg-white p-8 rounded-2xl border text-center text-gray-500">
            Loading your appointments...
        </div>
        )}
        {!loading && error &&(
          <div className="bg-red-50 text-red-700
          p-5 rounded-xl border border-red-200">
            {error}
            </div>
        )}
        {!loading && !error && appointments.length === 0 && (
          <div className="bg-white p-8 rounded-2xl
          border text-center">
            <div className="text-5xl mb-3">📅</div>
            <h2 className="text-lg font-bold text-gray-800">
              No upcoming appointments
            </h2>
            <p className="text-sm text-gray-500 mt-2">
              You don't have any confirmed appointments at the moment
            </p>
      </div>
     )} 
     {!loading && 
       !error &&
       appointments.map((appointment)=>{
        const days=getDaysDifference(
          appointment.appointment_date
        );
        if(days<0){
          return null;
        }
        const appointmentDate=new Date(
          appointment.appointment_date
        );
        const formattedDate=appointmentDate.toLocaleDateString("en-IN",{
          day:"numeric",
          month:"long",
          year:"numeric"
        });
        return (
          <div
           key={appointment._id}
           className="bg-white rounded-2xl
           shadow-sm border border-emerald-100
           overflow-hidden"
           >
          <div className="bg-emerald-50 p-5 border-b border-emerald-100">
            <div className="flex items-center gap-3">
              <div className="text-4xl">
                🔔
              </div>
            <div>
              <h2 className="text-lg font-black text-emerald-900">
                {getReminderText(days)}
              </h2>
              <p className="text-sm text-emerald-700">
                Please make sure you are ready for your consultation.
              </p>
            </div>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase">
                  Doctor
                </p>
                <p className="text-lg font-black text-gray-900 mt-1">
                  Dr.{appointment.doctor_id?.name || "Doctor"}
                </p>
                <p className="text-sm text-gray-500">
                  {appointment.doctor_id?.specialty ||
                  "Medical Specialist"}
                  </p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase">
                  Hospital
                </p>
                <p className="text-lg font-bold text-gray-900 mt-1">
                  {appointment.hospital_id?.name ||
                  "Healthcare Centre"}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl">
                <p className="text-xs font-bold text-gray-500">
                  📅 DATE
                </p>
                <p className="font-bold text-gray-900 mt-1">
                  {formattedDate}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl">
                <p className="text-xs font-bold text-gray-500">
                  🕐 TIME
                </p>
                <p className="font-bold text-gray-900 mt-1">
                  {appointment.appointment_time}
                </p>
              </div>
            </div>
            {(days === 1 || days === 2) && (
              <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <p className="font-bold text-yellow-800">
                  💡Smart Reminder
                </p>
                <p className="text-sm text-yellow-700 mt-1">
                  {days === 1?
                  "Your consultation is tomorrow.Please keep your previous prescription and medical documents ready."
                   :"Your consultation is day after tomorrow.Please keep your previous prescription and medical documents ready."}
                </p>
                </div>
            )}
          </div>
           </div>
        );
       })}
     </div>
      );
  }