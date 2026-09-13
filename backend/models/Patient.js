import mongoose from "mongoose";
const patientSchema=new mongoose.Schema(
    {
        name:{
            type:String,
            required:true,
            trim:true
        },
        details:{
            type:String,
            required:true,
            trim:true
        },
        dob:{
            type:Date,
            required:true
        },
        mobile:{
            type:String,
            required:true,
            unique:true,
            trim:true
        },
        email:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true
        },
        password:{
            type:String,
            required:true
        }
    },
    {
        timestamps:true
    }
);
const Patient=mongoose.model("Patient",patientSchema);
export default Patient;