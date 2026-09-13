import express from "express";
import {
    getMedicines,
    getMedicineById,
    createMedicine,
    updateMedicine,
    deleteMedicine
} from "../controller/medicinecontroller.js";
const router=express.Router();
router.get("/",getMedicines);
router.get("/:id",getMedicineById);
router.post("/",createMedicine);
router.put("/:id",updateMedicine);
router.delete("/:id",deleteMedicine);
export default router;