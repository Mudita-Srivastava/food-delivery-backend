import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

const loginDeliveryPartner = async (req, res) => {
  const { email, password } = req.body;

  try {
    const partner = await prisma.deliveryPartner.findUnique({
      where: { email },
    });
    if (!partner)
      return res.status(404).json({ error: "Delivery partner not found" });

    const valid = await bcrypt.compare(password, partner.password);
    if (!valid) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { id: partner.id, email: partner.email, role: "delivery" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      partner: {
        id: partner.id,
        name: partner.name,
        email: partner.email,
      },
    });
  } catch (err) {
    console.error("Login error", err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

const getAssignedOrders = async (req, res) => {
  try {
    const partnerId = req.user.id;

    const orders = await prisma.order.findMany({
      where: { deliveryPartnerId: partnerId },
      include: {
        items: { include: { food: true } },
        user: { select: { name: true, email: true } },
      },
    });

    res.json(orders);
  } catch (err) {
    console.error("Failed to fetch delivery orders", err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

export default { loginDeliveryPartner, getAssignedOrders };
