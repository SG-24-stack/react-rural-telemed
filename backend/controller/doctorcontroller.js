import bcrypt from "bcryptjs";
import Doctor from "../models/Doctor.js";
export const registerDoctor=async(req,res)=>{
    try{
      const{
        name,
        email,
        phone_number,
        password,
        specialty,
        license_number,
        council,
        qualification,
        hospital_id
      }=req.body;
      if(
        !name || 
        !email ||
        !phone_number ||
        !password ||
        !license_number ||
        !council ||
        !qualification ||
        !hospital_id
      ){
        return res.status(400).json({
            error:"Please fill in all required details"
        });
      }
      if(!req.file){
        return res.status(400).json({
            error:
                "Government document is required"
        });
      }
      const existingDoctor=await Doctor.findOne({
        $or:[
            {
                email:email.toLowerCase() },
                {phone_number},
                {license_number}
        ]
      });
      if(existingDoctor){
        return res.status(409).json({
            error:"Doctor with this email phone number or license already exists"
        });
      }
      const hashedPassword=await bcrypt.hash(password,10);
      const doctor=await Doctor.create({
        name,
        email:email.toLowerCase(),
        phone_number,
        password:hashedPassword,
        specialty,
        license_number,
        council,
        qualification,
        hospital_id,
        govt_document:req.file.path
      });
      return res.status(201).json({
        message:"Doctor registered successfully",
        doctor:{
            id:doctor._id,
            name:doctor.name,
            email:doctor.email,
            phone_number:doctor.phone_number,
            specialty:doctor.specialty,
            license_number:doctor.license_number,
            council:doctor.council,
            qualification:doctor.qualification,
            hospital_id:doctor.hospital_id
        }
      });
    }catch(error){
      console.error("Doctor registration error:",error);
      return res.status(500).json({
        error:"Server error during doctor registration"
      });
    }
}
export const getDoctors=async(req,res)=>{
  try{
   const doctors=await Doctor.find().select(
    "name email phone_number specialty qualification hospital_id"
   )
   .populate("hospital_id","name location");
   return res.status(200).json(doctors);
  }catch(error){
    console.error("Get doctors error:",error);
    return res.status(500).json({
      error:"Could not load doctors"
    })
  }
}