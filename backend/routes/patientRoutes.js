import express from "express";
import { registerPatient,getAllPatients } from "../controller/patientcontroller.js";
import {sendRegistrationOtp,verifyRegistrationOtp} from "../controller/otpcontroller.js";
const router=express.Router();
router.post("/register",registerPatient);
router.post("/register/otp/request",sendRegistrationOtp);
router.post("/register/otp/verify",verifyRegistrationOtp);
router.get("/",getAllPatients);
export default router;