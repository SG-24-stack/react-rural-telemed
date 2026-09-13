import mongoose from "mongoose";
const otpSchema=new mongoose.Schema(
    {
        phone_number:{
            type:String,
            required:true,
            trim:true
        },
        otp_code:{
            type:String,
            required:true
        },
        expiresAt:{
            type:Date,
            required:true
        }
    },
    {
        timestamps:true
    }
);
otpSchema.index(
    {expiresAt:1},
    {expiresAfterSeconds:0}
);
const Otp=mongoose.model("Otp",otpSchema);
export default Otp;