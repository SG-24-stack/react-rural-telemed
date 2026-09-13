import express from "express";
import {
    createHospital,
    getHospitals,
    loginHospital,
    getMyEmergencyBeds,
    updateMyEmergencyBeds
} from "../controller/hospitalcontroller.js";
import upload from "../middleware/upload.js";
import authMiddleware from "../middleware/authmiddleware.js";
const router=express.Router();
router.post(
    "/register",
    upload.single("certificate"),
    createHospital
);
router.post("/login",loginHospital);
router.get("/",getHospitals);
router.get(
    "/my/emergency-beds",
    authMiddleware,
    getMyEmergencyBeds
);
router.put(
    "/my/emergency-beds",
    authMiddleware,
    updateMyEmergencyBeds
);
export default router;