import mongoose from "mongoose";
const appointmentSchema=new mongoose.Schema(
    {
        patient_id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Patient",
            required:true
        },
        doctor_id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Doctor",
            required:true
        },
        hospital_id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Hospital",
            required:true
        },
        appointment_date:{
            type:Date,
            required:true
        },
        appointment_time:{
            type:String,
            required:true
        },
        appointment_type:{
            type:String,
            enum:["video","in-person"],
            default:"video"
        },
        reason:{
            type:String,
            trim:true
        },
        status:{
            type:String,
            enum:["confirmed","completed","cancelled"],
            default:"confirmed"
        }
    },
    {
        timestamps:true
    }
);
const Appointment=mongoose.model("Appointment",appointmentSchema);
export default Appointment;