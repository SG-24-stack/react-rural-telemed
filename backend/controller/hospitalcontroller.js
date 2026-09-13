import Hospital from "../models/Hospital.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
export const createHospital=async(req,res)=>{
    try{
     const{
        ownershipType,
        ownerName,
        contactName,
        contactDesignation,
        contactPhone,
        contactEmail,
        password,
        legalName,
        tradeName,
        registrationNumber,
        issuingAuthority,
        licenseValidTill,
        accreditationNumber,
        cityOrDistrict,
        state,
        pinCode
     }=req.body;
     if(
        !ownershipType ||
        !ownerName ||
        !contactName ||
        !contactPhone ||
        !contactEmail ||
        !password ||
        !legalName ||
        !registrationNumber ||
        !issuingAuthority ||
        !licenseValidTill ||
        !cityOrDistrict ||
        !state ||
        !pinCode
     ) {
        return res.status(400).json({
            error:"Please fill in all required hospital fields"
        });
     }
     const existingHospital=await Hospital.findOne({
        registrationNumber
     });
     if(existingHospital){
        return res.status(409).json({
            error:"Hospital with this registration number already exists"
        });
     }
     const hashedPassword=await bcrypt.hash(password,10);
     const hospital=await Hospital.create({
        ownershipType,
        ownerName,
        contactName,
        contactDesignation,
        contactPhone,
        contactEmail,
        password:hashedPassword,
        legalName,
        tradeName,
        registrationNumber,
        issuingAuthority,
        licenseValidTill,
        accreditationNumber,
        cityOrDistrict,
        state,
        pinCode,
        certificate:req.file?req.file.path:null
     });
     console.log("Hospital registered:",hospital);
     return res.status(201).json({
        message:"Hospital registered successfully",
        hospital
     });
    }catch(error){
      console.error("Hospital registration error:",error);
      return res.status(500).json({
        error:"Server error during hospital registration"
      });
    }
};
export const getHospitals=async(req,res)=>{
    try{
      const hospitals=await Hospital.find()
      .select("_id legalName tradeName cityOrDistrict state emergencyBeds availableEmergencyBeds");
      const formattedHospitals=hospitals.map((hospital)=>({
        id:hospital._id,
        name:hospital.tradeName ||
        hospital.legalName,
        location:`${hospital.cityOrDistrict},${hospital.state}`,
        emergencyBeds:hospital.emergencyBeds,
        availableEmergencyBeds:hospital.availableEmergencyBeds
      }));
      return res.status(200).json(formattedHospitals);
    }catch(error){
      console.error("Get hospitals error:",error);
      return res.status(500).json({
        error:"Failed to fetch hospitals"
      });
    }
}
export const loginHospital=async(req,res)=>{
   try{
     const {email,password}=req.body;
     if(!email || !password){
      return res.status(400).json({
         error:"Email and password are required"
      });
     }
     const hospital=await Hospital.findOne({
      contactEmail:email.toLowerCase().trim()
     });
     if(!hospital){
      return res.status(401).json({
         error:"Invalid email or password"
      });
     }
     const isMatch=await bcrypt.compare(
      password,
      hospital.password
     );
     if(!isMatch){
      return res.status(401).json({
         error:"Invalid email or password"
      });
     }
     const token=jwt.sign(
      {
         id:hospital._id,
         role:"hospital"
      },
      process.env.JWT_SECRET,
      {
         expiresIn:"7d"
      }
     );
     return res.status(200).json({
      message:"Hospital Login successful",
      token,
      user:{
         id:hospital._id,
         name:hospital.tradeName ||
         hospital.legalName,
         email:hospital.contactEmail,
         role:"hospital"
      }
     });
   }catch(error){
      console.error("Hospital login error:",error);
      return res.status(500).json({
         error:"Server error during hospital login"
      });
   }
}
export const getMyEmergencyBeds=async(req,res)=>{
   try{
     const hospital=await Hospital.findById(req.user.id)
     .select("emergencyBeds availableEmergencyBeds");
      if(!hospital){
         return res.status(404).json({
            error:"Hospital not found"
         });
      }
      res.json({
         emergencyBeds:hospital.emergencyBeds,
         availableEmergencyBeds:hospital.availableEmergencyBeds
      });
   }
   catch(error){
      console.error("Get emergency beds error:",error);
      res.status(500).json({
         error:"Failed to fetch emergency bed information"
      });
   }
};
export const updateMyEmergencyBeds=async(req,res)=>{
   try{
    const {emergencyBeds,availableEmergencyBeds}=req.body;
    if(
      emergencyBeds === undefined ||
      availableEmergencyBeds === undefined
    ) {
      return res.status(400).json({
         error:"Both emergency beds and available emergency beds are required"
      });
    }
    if(emergencyBeds<0 ||
      availableEmergencyBeds<0
    ){
      return res.status(400).json({
         error:"Bed numbers cannot be negative"
      })
    }
    if(availableEmergencyBeds>emergencyBeds){
      return res.status(400).json({
         error:"Available beds cannot be greater than total emergency beds"
      });
    }
    const hospital=await Hospital.findByIdAndUpdate(
      req.user.id,
      {
         emergencyBeds,
         availableEmergencyBeds
      },
      {new:true}
    ).select("emergencyBeds availableEmergencyBeds");
    if(!hospital){
      return res.status(404).json({
         error:"Hospital not found"
      });
    }
    res.json({
      message:"Emergency bed information updated successfully",
      emergencyBeds:hospital.emergencyBeds,
      availableEmergencyBeds:hospital.availableEmergencyBeds
    });
   }catch(error){
     console.error("Updaate emergency beds error:",error);
     res.status(500).json({
      error:"Failed to update emergency bed information"
     });
   }
};