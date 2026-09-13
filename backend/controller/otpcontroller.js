import Otp from "../models/Otp.js";
export const sendRegistrationOtp=async(req,res)=>{
    try{
      const {phone_number}=req.body;
      if(!phone_number || phone_number.length!==10){
        return res.status(400).json({
            error:"Please enter a valid 10 digit mobile number"
        });
      }
      const otp_code=Math.floor(100000+Math.random()*900000).toString();
      const expiresAt=new Date(Date.now()+5*60*1000);
      await Otp.deleteMany({phone_number});
      await Otp.create({
        phone_number,
        otp_code,
        expiresAt
      });
      console.log(`OTP for ${phone_number}:${otp_code}`);
      res.status(200).json({
        message:"OTP send successfully"
      });
    }catch(error){
      console.error("Send OTP error:",error);
      res.status(500).json({
        error:"Failed to generate OTP"
      });
    }
};
export const verifyRegistrationOtp=async(req,res)=>{
    try{
      const {phone_number,otp_code}=req.body;
      if(!phone_number || !otp_code){
        return res.status(400).json({
            error:"Phone number and OTP are required"
        });
      }
      const otp=await Otp.findOne({
        phone_number,
        otp_code
      });
      if(!otp){
        return res.status(400).json({
            error:"Invalid OTP"
        });
      }
      if(otp.expiresAt<new Date()){
        await Otp.deleteOne({ _id:otp._id});
        return res.status(400).json({
            error:"OTP has expired"
        });
      }
      await Otp.deleteOne({ _id:otp._id});
      res.status(200).json({
        message:"OTP verified successfully",
        verified:true
      });
    }catch(error){
       console.error("Verify OTP error:",error);
       res.status(500).json({
        error:"Failed to verify OTP"
       })
    }
}