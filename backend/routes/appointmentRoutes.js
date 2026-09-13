import express from "express";
import {
    bookAppointment,
    getPatientAppointments,
    getDoctorAppointments,
    updateAppointmentStatus
} from "../controller/appointmentcontroller.js";
import authMiddleware from "../middleware/authmiddleware.js";
const router=express.Router();
router.post("/",authMiddleware,bookAppointment);
router.get("/my-appointments",authMiddleware,getPatientAppointments);
router.get("/doctor",authMiddleware,getDoctorAppointments);
router.patch(
    "/:id/status",
    authMiddleware,
    updateAppointmentStatus
);
export default router;