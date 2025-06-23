import express from "express";
import restrauntController from "../controllers/restrauntController.js";
import isAdmin from "../isAdmin.js";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/", verifyToken, isAdmin, restrauntController.addRestaurant);
router.get("/", restrauntController.getAllRestaurants);
router.get("/:id/foods", restrauntController.getFoodsByRestaurant);

export default router;
