import express from "express";

import dotenv from "dotenv";
import authRoutes from "./jwt-auth/routes/authRoutes.js";
import foodRoutes from "./jwt-auth/routes/foodRoutes.js";
import restrauntRoutes from "./jwt-auth/routes/restrauntRoutes.js";
import orderRoutes from "./jwt-auth/routes/orderRoutes.js";
import cartRoutes from "./jwt-auth/routes/cartRoutes.js";
import deliveryAuthRoutes from "./jwt-auth/routes/deliveryAuthRoutes.js";

dotenv.config();
const app = express();

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/admin/restraunts", restrauntRoutes);
app.use("/admin/foods", foodRoutes);
app.use("/foods", foodRoutes); //for public food access
app.use("/api/orders", orderRoutes);
app.use("/api/cart", cartRoutes);

app.use("/delivery", deliveryAuthRoutes);

app.get("/", (req, res) => {
  res.send("API is live");
});

app.listen(process.env.PORT, () => {
  console.log(`SERVER RUNNING ON PORT ${process.env.PORT}`);
});

export default app;
