import express from "express";
import { registerDoctor,getDoctors } from "../controller/doctorcontroller.js";
import upload from "../middleware/upload.js";
const router=express.Router();
router.post(
    "/register-doctor",
    upload.single("govt_document"),
    registerDoctor
);
router.get("/",getDoctors);
export default router;

