import express from "express";
import foodcontroller from "../controllers/foodController.js";
import isAdmin from "../isAdmin.js";
import verifyToken from "../middleware/verifyToken.js";
const router = express.Router();

router.get("/", foodcontroller.getAllFoods);
router.post("/", verifyToken, isAdmin, foodcontroller.addFood);
router.put("/:id", verifyToken, isAdmin, foodcontroller.updateFood);
router.delete("/:id", verifyToken, isAdmin, foodcontroller.deleteFood);
router.get("/search", foodcontroller.searchFoods);

export default router;
