const prisma = require('../models');
const { Prisma } = require('@prisma/client');

// Get all API results
exports.getAllAPIResults = async (req, res) => {
  try {
    const apiResults = await prisma.aPI_result.findMany({
      include: {
        message: true,
        post: true,
        comment: true,
        Categories: true
      }
    });
    res.status(200).json(apiResults);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch API results' });
  }
};

// Get an API result by ID
exports.getAPIResultById = async (req, res) => {
  try {
    const apiResult = await prisma.aPI_result.findUnique({
      where: { Id_api_result: req.params.id },
      include: {
        message: true,
        post: true,
        comment: true,
        Categories: true
      }
    });
    if (!apiResult) return res.status(404).json({ message: 'API result not found' });
    res.status(200).json(apiResult);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch API result' });
  }
};

// Create a new API result
exports.createAPIResult = async (req, res) => {
  try {
    const { Id_Categories, flagged, Id_Message, Id_Post, Id_Comment } = req.body;

    const newAPIResult = await prisma.aPI_result.create({
      data: {
        Id_Categories,
        flagged,
        Id_Message,
        Id_Post,
        Id_Comment
      },
    });

    res.status(201).json(newAPIResult); // Created
  } catch (error) {
    if (error instanceof Prisma.PrismaClientValidationError) {
      res.status(400).json({ error: 'Invalid input data' }); // Bad Request
    } else {
      res.status(500).json({ error: 'Failed to create API result' });
    }
  }
};

// Update an API result by ID
exports.updateAPIResult = async (req, res) => {
  try {
    const { Id_Categories, flagged, Id_Message, Id_Post, Id_Comment } = req.body;

    // Check if the API result exists
    const apiResult = await prisma.aPI_result.findUnique({
      where: { Id_api_result: req.params.id },
    });
    if (!apiResult) return res.status(404).json({ message: 'API result not found' });

    const updatedAPIResult = await prisma.aPI_result.update({
      where: { Id_api_result: req.params.id },
      data: {
        Id_Categories,
        flagged,
        Id_Message,
        Id_Post,
        Id_Comment
      },
    });

    res.status(200).json(updatedAPIResult); // OK
  } catch (error) {
    if (error instanceof Prisma.PrismaClientValidationError) {
      res.status(400).json({ error: 'Invalid input data' });
    } else {
      res.status(500).json({ error: 'Failed to update API result' });
    }
  }
};

// Delete an API result by ID
exports.deleteAPIResult = async (req, res) => {
  try {
    // Check if the API result exists before attempting to delete
    const apiResult = await prisma.aPI_result.findUnique({
      where: { Id_api_result: req.params.id },
    });
    if (!apiResult) return res.status(404).json({ message: 'API result not found' });

    await prisma.aPI_result.delete({
      where: { Id_api_result: req.params.id },
    });

    res.status(204).send(); // No Content
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete API result' });
  }
};
