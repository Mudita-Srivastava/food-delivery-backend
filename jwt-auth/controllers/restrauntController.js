import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const addRestaurant = async (req, res) => {
  const { name, description, image } = req.body;

   if (!name) {
    return res.status(400).json({ error: "Restaurant name is required" });
  }

  try {
    const newRestaurant = await prisma.restaurant.create({
      data: { name, description, image }
    });
    res.status(201).json(newRestaurant);
  } catch (error) {
    res.status(500).json({ error: "Error adding restaurant" });
  }
};

 const getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await prisma.restaurant.findMany();
    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ error: "Error fetching restaurants" });
  }
};

 const getFoodsByRestaurant = async (req, res) => {
  const { id } = req.params;
  try {
    const foods = await prisma.food.findMany({
      where: { restaurantId: parseInt(id) }
    });
    res.json(foods);
  } catch (error) {
    res.status(500).json({ error: "Error fetching foods" });
  }
};

export default {addRestaurant, getAllRestaurants, getFoodsByRestaurant };
