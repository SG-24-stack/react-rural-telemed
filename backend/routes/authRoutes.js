import express from "express";
import { loginPatient,loginDoctor} from "../controller/authcontroller.js";
const router=express.Router();
router.post("/login",loginPatient);
router.post("/doctor-login",loginDoctor);
export default router;