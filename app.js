import express from "express";
import path from "path";
import dotenv from "dotenv";
import authRoutes from "./jwt-auth/routes/authRoutes.js";
import foodRoutes from "./jwt-auth/routes/foodRoutes.js";
import restrauntRoutes from "./jwt-auth/routes/restrauntRoutes.js";
import orderRoutes from "./jwt-auth/routes/orderRoutes.js";
import cartRoutes from "./jwt-auth/routes/cartRoutes.js";
import deliveryAuthRoutes from "./jwt-auth/routes/deliveryAuthRoutes.js";
import paymentRoutes from "./jwt-auth/routes/paymentRoutes.js";
import { fileURLToPath } from "url";
import cors from "cors";

dotenv.config();
const app = express();

// For static serving uploads
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Only allow this domain to access the backend
const allowedOrigins = ["https://food-delivery-backend-qi7d.onrender.com"];
const corsOptions = {
  origin: function (origin, callback) {
    // Allow REST clients (like Postman) or allowed frontend origins
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // if using cookies or JWT Authorization header
};

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/admin/restraunts", restrauntRoutes);
app.use("/admin/foods", foodRoutes);
app.use("/foods", foodRoutes); //for public food access
app.use("/api/orders", orderRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/payment", paymentRoutes);

app.use("/delivery", deliveryAuthRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(cors(corsOptions));

app.get("/", (req, res) => {
  res.send("API is live");
});

app.listen(process.env.PORT, () => {
  console.log(`SERVER RUNNING ON PORT ${process.env.PORT}`);
});

export default app;
