import express from "express";
import orderController from "../controllers/orderController.js";
import verifyToken from "../middleware/verifyToken.js";
import isAdmin from "../isAdmin.js";

const router = express.Router();

router.post("/", verifyToken, orderController.placeOrder);
router.get("/", verifyToken, isAdmin, orderController.getAllOrders);
router.get("/my-orders", verifyToken, orderController.getMyOrders);
router.put("/:id", verifyToken, isAdmin, orderController.updateOrderStatus);

export default router;
