import express from "express";
import {
    createOrder,
    getMyOrders,
    getOrderById,
    updateOrderStatus,
    cancelOrder
} from "../controller/ordercontroller.js";
import authMiddleware from "../middleware/authmiddleware.js";
const router=express.Router();
router.post(
    "/",
    authMiddleware,
    createOrder
);
router.get(
    "/my-orders",
    authMiddleware,
    getMyOrders
);
router.get(
    "/:id",
    authMiddleware,
    getOrderById
);
router.patch(
    "/:id/status",
    authMiddleware,
    updateOrderStatus
);
router.patch(
    "/:id/cancel",
    authMiddleware,
    cancelOrder
);
export default router;