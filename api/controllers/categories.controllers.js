const prisma = require('../models');
const { Prisma } = require('@prisma/client');

// Get all categories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await prisma.categories.findMany({
      include: {
        api_result: true
      }
    });
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
};

// Get a category by ID
exports.getCategoryById = async (req, res) => {
  try {
    const category = await prisma.categories.findUnique({
      where: { Id_Category: req.params.id },
      include: {
        api_result: true
      }
    });
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch category' });
  }
};

// Create a new category
exports.createCategory = async (req, res) => {
  try {
    const { name, score, Id_api_result } = req.body;

    const newCategory = await prisma.categories.create({
      data: {
        name,
        score,
        Id_api_result
      },
    });

    res.status(201).json(newCategory); // Created
  } catch (error) {
    if (error instanceof Prisma.PrismaClientValidationError) {
      res.status(400).json({ error: 'Invalid input data' }); // Bad Request
    } else {
      res.status(500).json({ error: 'Failed to create category' });
    }
  }
};

// Update a category by ID
exports.updateCategory = async (req, res) => {
  try {
    const { name, score, Id_api_result } = req.body;

    // Check if the category exists
    const category = await prisma.categories.findUnique({
      where: { Id_Category: req.params.id },
    });
    if (!category) return res.status(404).json({ message: 'Category not found' });

    const updatedCategory = await prisma.categories.update({
      where: { Id_Category: req.params.id },
      data: {
        name,
        score,
        Id_api_result
      },
    });

    res.status(200).json(updatedCategory); // OK
  } catch (error) {
    if (error instanceof Prisma.PrismaClientValidationError) {
      res.status(400).json({ error: 'Invalid input data' });
    } else {
      res.status(500).json({ error: 'Failed to update category' });
    }
  }
};

// Delete a category by ID
exports.deleteCategory = async (req, res) => {
  try {
    // Check if the category exists before attempting to delete
    const category = await prisma.categories.findUnique({
      where: { Id_Category: req.params.id },
    });
    if (!category) return res.status(404).json({ message: 'Category not found' });

    await prisma.categories.delete({
      where: { Id_Category: req.params.id },
    });

    res.status(204).send(); // No Content
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete category' });
  }
};
