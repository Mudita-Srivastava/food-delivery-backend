import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Place an order
const placeOrder = async (req, res) => {
  const { foodId, quantity } = req.body;
  const userId = req.user.id; // set by verifyToken middleware

  try {
    const food = await prisma.food.findUnique({
      where: { id: parseInt(foodId) },
    });
    if (!food) return res.status(404).json({ error: "Food not found" });
    const totalPrice = food.price * parseInt(quantity);
    const order = await prisma.order.create({
      data: {
        userId,
        foodId: parseInt(foodId),
        quantity: parseInt(quantity),
      },
    });

    res.status(201).json({ message: "Order placed", order, totalPrice });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all orders (admin only)
const getAllOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: true,
        food: { include: { restaurant: true } },
      },
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getMyOrders = async (req, res) => {
  const userId = req.user.id;

  try {
    const orders = await prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        food: {
          select: {
            name: true,
            image: true,
            price: true,
          },
        },
      },
    });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const updatedOrder = await prisma.order.update({
      where: { id: parseInt(id) },
      data: { status },
    });

    res.json({ message: "Order status updated", order: updatedOrder });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



export default {
  placeOrder,
  getAllOrders,
  getMyOrders,
  updateOrderStatus
};
