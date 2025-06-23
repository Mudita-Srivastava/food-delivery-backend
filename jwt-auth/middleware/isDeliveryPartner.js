import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const isDeliveryPartner = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ error: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    if (decoded.role !== "delivery") {
      return res
        .status(403)
        .json({ error: "Access denied: Delivery partners only" });
    }

    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

export default isDeliveryPartner;
