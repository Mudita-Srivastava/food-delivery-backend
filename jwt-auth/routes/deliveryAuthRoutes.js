import express from "express";
import isDeliveryPartner from "../middleware/isDeliveryPartner.js";
import deliveryAuthController from "../controllers/deliveryAuthController.js";
const router = express.Router();

// POST /delivery/login
router.post("/login", deliveryAuthController.loginDeliveryPartner);
router.get(
  "/orders",
  isDeliveryPartner,
  deliveryAuthController.getAssignedOrders
);

export default router;
