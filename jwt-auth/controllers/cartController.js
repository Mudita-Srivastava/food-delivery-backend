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
    });

    if (cartItems.length === 0) {
      return res.status(400).json({ error: "Your cart is empty" });
    }

    // Create orders for each cart item
    const orders = await Promise.all(
      cartItems.map((item) =>
        prisma.order.create({
          data: {
            userId,
            foodId: item.foodId,
            quantity: item.quantity,
            status: "pending",
          },
        })
      )
    );

    // Clear the cart after order
    await prisma.cartItem.deleteMany({ where: { userId } });

    res.status(201).json({ message: "Order placed successfully", orders });
  } catch (error) {
    res.status(500).json({ error: "Failed to place order" });
  }
};

export default {
  addToCart,
  getCart,
  removeFromCart,
  checkoutCart,
};
