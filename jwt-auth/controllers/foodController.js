import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const getAllFoods = async (req, res) => {
  const foods = await prisma.food.findMany();
  res.json(foods); // restaurant info hidden
};

const addFood = async (req, res) => {
  const { name, description, price, restaurantId } = req.body;
  const imageUrl = req.file?.path;
  try {
    const newFood = await prisma.food.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        image: imageUrl,
        restaurantId: parseInt(restaurantId),
      },
    });
    res.status(201).json(newFood);
  } catch (error) {
    res.status(500).json({ error: "Error adding food" });
  }
};

const updateFood = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, image } = req.body;
  try {
    const updatedFood = await prisma.food.update({
      where: { id: parseInt(id) },
      data: { name, description, price, image },
    });
    res.json(updatedFood);
  } catch (error) {
    res.status(500).json({ error: "Error updating food" });
  }
};

const deleteFood = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.food.delete({
      where: { id: parseInt(id) },
    });
    res.json({ message: "Food deleted" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting food" });
  }
};

const searchFoods = async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: "Search query is required" });
  }

  try {
    const results = await prisma.food.findMany({
      where: {
        OR: [
          {
            name: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            description: {
              contains: query,
              mode: "insensitive",
            },
          },
        ],
      },
    });

    res.json(results);
  } catch (error) {
    res.status(500).json({ error: "Failed to search foods" });
  }
};

export default { getAllFoods, addFood, updateFood, deleteFood, searchFoods };
