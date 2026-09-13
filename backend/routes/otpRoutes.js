import express from "express";
import {
    sendRegistrationOtp,
    verifyRegistrationOtp
} from "../controller/otpcontroller.js";
const router=express.Router();
router.post("/register/otp/request",sendRegistrationOtp);
router.post("/register/otp/verify",verifyRegistrationOtp);
export default router;