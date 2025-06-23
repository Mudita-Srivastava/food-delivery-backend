import express from "express";
import cartController from "../controllers/cartController.js";
import verifyToken from "../middleware/verifyToken.js";
const router = express.Router();

router.post("/checkout", verifyToken, cartController.checkoutCart);
router.post("/add", verifyToken, cartController.addToCart);
router.get("/", verifyToken, cartController.getCart);
router.delete("/:foodId", verifyToken, cartController.removeFromCart);

export default router;
