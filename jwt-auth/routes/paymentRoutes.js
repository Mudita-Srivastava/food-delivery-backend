import express from "express";
import paymentController from "../controllers/paymentController.js";

const router = express.Router();

router.post("/create-payment", paymentController.createPaymentOrder);
router.post("/verify", paymentController.verifyPayment);

export default router;
