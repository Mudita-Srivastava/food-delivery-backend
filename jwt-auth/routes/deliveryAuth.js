import express from "express";
import deliveryAuthController from "../controllers/deliveryAuthController.js";
import isDeliveryPartner from "../middleware/isDeliveryPartner.js";
import  deliveryController  from "../controllers/deliveryController.js";
const router = express.Router();

// POST /delivery/login
router.post("/login", deliveryAuthController.loginDeliveryPartner);
router.get("/orders", isDeliveryPartner, deliveryController.getAssignedOrders);

export default router;
