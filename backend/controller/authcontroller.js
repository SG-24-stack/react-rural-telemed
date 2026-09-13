import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Patient from "../models/Patient.js";
import Doctor from "../models/Doctor.js";
export const loginPatient=async(req,res)=>{
    try{
        const{email,password}=req.body;
        if(!email || !password){
            return res.status(400).json({
                error:"Email and password are required"   
            });
        }
    const patient=await Patient.findOne({email});
    if(!patient){
        return res.status(401).json({
            error:"Invalid email or password"
        });
    }
    const isMatch=await bcrypt.compare(password,patient.password);
    if(!isMatch){
        return res.status(401).json({
            error:"Invalid email or password"
        });
    }
    const token=jwt.sign(
        {
            id:patient._id,
            role:"patient"
        },
        process.env.JWT_SECRET,
        {
            expiresIn:"7d"
        }
    );
    res.status(200).json({
        message:"Login successful",
        token,
        user:{
            id:patient._id,
            name:patient.name,
            email:patient.email,
            mobile:patient.mobile,
            role:"patient"
        }
    });
    } catch(error){
        console.error("Patient login error:",error);
        res.status(500).json({
            error:"Server error during login"
        })
    }
}
export const loginDoctor=async(req,res)=>{
    try{
     const {email,password}=req.body;
     if(!email || !password){
        return res.status(400).json({
            error:"Email and password are required"
        });
     }
     const doctor=await Doctor.findOne({
        email:email.toLowerCase()
     });
        console.log("DOCTOR FOUND:", !! doctor);
     if(!doctor){
        return res.status(401).json({
            error:"Invalid email or password"
        });
     }
     const isMatch=await bcrypt.compare(
        password,
        doctor.password
     );
     if(!isMatch){
        return res.status(401).json({
            error:"Invalid email or password"
        });
     }
     const token=jwt.sign(
        {
            id:doctor._id,
            role:"doctor"
        },
        process.env.JWT_SECRET,
        {
            expiresIn:"7d"
        }
     );
     res.status(200).json({
        message:"Doctor login successful",
        token,
        user:{
            id:doctor._id,
            name:doctor.name,
            email:doctor.email,
            phone_number:doctor.phone_number,
            speciality:doctor.specialty,
            hospital_id:doctor.hospital_id,
            role:"doctor"
        }
     });
    }catch(error){
        console.error("Doctor login error:",error);
        res.status(500).json({
            error:"Server error during doctor login"
        });
    }
}