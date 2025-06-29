import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Place an order
const placeOrder = async (req, res) => {
  const { items } = req.body;
  const userId = req.user.id; // set by verifyToken middleware

  try {
    //create an empty order
    const order = await prisma.order.create({
      data: { userId },
    });

    let totalPrice = 0;
    // 2. Create OrderItems + calculate totalPrice
    for (const item of items) {
      const food = await prisma.food.findUnique({
        where: { id: item.foodId },
      });

      if (!food) continue; // skip invalid items

      totalPrice += food.price * item.quantity;

      await prisma.orderItem.create({
        data: {
          orderId: order.id,
          foodId: item.foodId,
          quantity: item.quantity,
        },
      });
    }

    // 3. Update order with totalPrice
    await prisma.order.update({
      where: { id: order.id },
      data: { totalPrice },
    });

    res
      .status(201)
      .json({ message: "Order placed", orderId: order.id, totalPrice });
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
        items: {
          include: {
            food: {
              include: { restaurant: true },
            },
          },
        },
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
        items: {
          include: {
            food: {
              select: {
                name: true,
                image: true,
                price: true,
              },
            },
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
  updateOrderStatus,
};
