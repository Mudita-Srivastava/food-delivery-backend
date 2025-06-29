import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// ✅ Add item to cart
const addToCart = async (req, res) => {
  const { foodId, quantity } = req.body;
  const userId = req.user.id;

  try {
    const existingItem = await prisma.cartItem.findFirst({
      where: { userId, foodId },
    });

    if (existingItem) {
      const updated = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      });
      return res.json(updated);
    }

    const newItem = await prisma.cartItem.create({
      data: {
        userId,
        foodId,
        quantity,
      },
    });

    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ error: "Failed to add item to cart" });
  }
};

// ✅ Get all cart items
const getCart = async (req, res) => {
  const userId = req.user.id;

  try {
    const cart = await prisma.cartItem.findMany({
      where: { userId },
      include: {
        food: true,
      },
    });

    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch cart" });
  }
};

// ✅ Remove an item from cart
const removeFromCart = async (req, res) => {
  const userId = req.user.id;
  const foodId = parseInt(req.params.foodId);

  try {
    await prisma.cartItem.deleteMany({
      where: { userId, foodId },
    });

    res.json({ message: "Item removed from cart" });
  } catch (error) {
    res.status(500).json({ error: "Failed to remove item from cart" });
  }
};

const checkoutCart = async (req, res) => {
  const userId = req.user.id;

  try {
    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: { food: true },
    });

    if (cartItems.length === 0) {
      return res.status(400).json({ error: "Your cart is empty" });
    }

    // 1. Create the order
    const order = await prisma.order.create({
      data: {
        userId,
        status: "pending",
      },
    });

    // 2. Create OrderItems and calculate total price
    let totalPrice = 0;

    for (const item of cartItems) {
      const itemTotal = item.quantity * item.food.price;
      totalPrice += itemTotal;

      await prisma.orderItem.create({
        data: {
          orderId: order.id,
          foodId: item.foodId,
          quantity: item.quantity,
        },
      });
    }

    // 3. Update total price in Order
    await prisma.order.update({
      where: { id: order.id },
      data: { totalPrice },
    });

    // 4. Clear cart
    await prisma.cartItem.deleteMany({
      where: { userId },
    });

    res.status(201).json({
      message: "Order placed successfully",
      orderId: order.id,
      totalPrice,
    });
  } catch (error) {
    console.error("Checkout Error:", error);
    res.status(500).json({ error: "Failed to place order" });
  }
};

export default {
  addToCart,
  getCart,
  removeFromCart,
  checkoutCart,
};
