import express from "express";
import { createPrescription,getPatientPrescription,downloadPrescriptionPDF } from "../controller/prescriptioncontroller.js";
import authMiddleware from "../middleware/authmiddleware.js";
const router=express.Router();
router.post("/",authMiddleware,createPrescription);
router.get("/my-prescription",authMiddleware,getPatientPrescription);
router.get("/download/:id",authMiddleware,downloadPrescriptionPDF);
export default router;