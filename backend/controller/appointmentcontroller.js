import Appointment from "../models/Appointment.js";
import Doctor from "../models/Doctor.js";
import Patient from "../models/Patient.js";
export const bookAppointment=async(req,res)=>{
    try{
        if(req.user.role!=="patient"){
        return res.status(403).json({
            error:"Only patients can book appointments"
        });
        }
        const{
            doctor_id,
            appointment_date,
            appointment_time,
            appointment_type,
            reason
        }=req.body;
        if(
            !doctor_id ||
            !appointment_date ||
            !appointment_time
        ){
            return res.status(400).json({
                error:"Doctor date and time are required"
            });
        }
        const doctor=await Doctor.findById(doctor_id);
        if(!doctor){
            return res.status(400).json({
                error:"Doctor not found"
            });
        }
        const existingAppointment=await Appointment.findOne({
            doctor_id,
            appointment_date:new Date(appointment_date),
            appointment_time,
            status:{
                $in: ["confirmed"]
            }
        });
        if(existingAppointment){
            return res.status(409).json({
                error:"This doctor already has an appointment at this date and time"
            });
        }
        const appointment=await Appointment.create({
            patient_id:req.user.id,
            doctor_id:doctor._id,
            hospital_id:doctor.hospital_id,
            appointment_date:new Date(appointment_date),appointment_time,
            appointment_type:appointment_type || "video",
            reason:reason || "",
            status:"confirmed"
        });
        const populatedAppointment=await Appointment.findById(
            appointment._id
        )
        .populate("doctor_id","name speciality qualification")
        .populate("patient_id","name email mobile")
        .populate("hospital_id","name location");
        return res.status(200).json({
            message:"Appointment booked sucessfully",
            appointment:populatedAppointment
        });
    }catch(error){
        console.error("Book Appointment error:",error);
        return res.status(500).json({
            error:"Server error while booking appointments"
        });
    }
};
export const getPatientAppointments=async(req,res)=>{
    try{
     if(req.user.role!=="patient"){
        return res.status(404).json({
            error:"Only patients can view their appointments"
        });
     }
     const appointments=await Appointment.find({
        patient_id:req.user.id
     })
     .populate("doctor_id","name specialty qualification")
     .populate("hospital_id","name location")
     .sort({
        appointment_date:1
     });
     return res.status(200).json(appointments);
    }catch(error){
     console.error("Get patient appointments error:",error);
     return res.status(500).json({
        error:"could not load patient appointments"
     });
    }
};
export const getDoctorAppointments=async(req,res)=>{
    try{
     if(req.user.role!=="doctor"){
        return res.status(404).json({
            error:"Only doctors can view their appointments"
        });
     }
     const doctor=await Doctor.findById(req.user.id);
     if(!doctor){
        return res.status(404).json({
            error:"Doctor profile not found"
        });
     }
     const appointments=await Appointment.find({
        doctor_id:doctor._id
     })
     .populate("patient_id","name email mobile dob details")
     .populate("hospital_id","name location")
     .sort({
        appointment_date:1,
        appointment_time:1
     });
     return res.status(200).json(appointments);
    }catch(error){
     console.error("Get doctor appointments error:",error);
     return res.status(500).json({
        error:"could not load doctor appointments"
     });
    }
};
export const updateAppointmentStatus=async(req,res)=>{
    try{
     if(req.user.role !== "doctor"){
        return res.status(400).json({
            error:"Only doctors can update appointment status"
        });
     }
     const {id}=req.params;
     const {status}=req.body;
     const allowedStatuses=[
        "confirmed",
        "completed",
        "cancelled"
     ];
     if(!allowedStatuses.includes(status)){
        return res.status(400).json({
            error:"Invalid appointment status"
        });
     }
     const doctor=await Doctor.findById(req.user.id);
     if(!doctor){
        return res.status(404).json({
            error:"Doctor profile not found"
        })
     }
     const appointment=await Appointment.findOne({
        _id:id,
        doctor_id:doctor._id
     });
     if(!appointment){
        return res.status(400).json({
            error:"Appointment not found"
        });
     }
     appointment.status=status;
     await appointment.save();
     return res.status(200).json({
        message:"Appointment saved successfully",
        appointment
     });
    }catch(error){
      console.error("Update appointment status error:",error);
      return res.status(500).json({
        error:"Server error while updating appointment"
      });
    }
};