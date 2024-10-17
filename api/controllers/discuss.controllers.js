const prisma = require('../models');
const { Prisma } = require('@prisma/client');

// Get all discussions (associations between users and conversations)
exports.getAllDiscussions = async (req, res) => {
  try {
    const discussions = await prisma.discuss.findMany({
      include: {
        user: true,
        conversation: true
      }
    });
    res.status(200).json(discussions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch discussions' });
  }
};

// Get a specific discussion by User and Conversation IDs
exports.getDiscussionById = async (req, res) => {
  try {
    const discussion = await prisma.discuss.findUnique({
      where: { Id_User_Id_Conversation: { Id_User: req.params.id_user, Id_Conversation: req.params.id_conversation } },
      include: {
        user: true,
        conversation: true
      }
    });
    if (!discussion) return res.status(404).json({ message: 'Discussion not found' });
    res.status(200).json(discussion);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch discussion' });
  }
};

// Create a new discussion (association between a user and a conversation)
exports.createDiscussion = async (req, res) => {
  try {
    const { Id_User, Id_Conversation } = req.body;

    const newDiscussion = await prisma.discuss.create({
      data: {
        Id_User,
        Id_Conversation
      },
    });

    res.status(201).json(newDiscussion); // Created
  } catch (error) {
    if (error instanceof Prisma.PrismaClientValidationError) {
      res.status(400).json({ error: 'Invalid input data' }); // Bad Request
    } else {
      res.status(500).json({ error: 'Failed to create discussion' });
    }
  }
};

// Update a discussion by User and Conversation IDs
exports.updateDiscussion = async (req, res) => {
  try {
    const { Id_User, Id_Conversation } = req.body;

    // Check if the discussion exists
    const discussion = await prisma.discuss.findUnique({
      where: { Id_User_Id_Conversation: { Id_User: req.params.id_user, Id_Conversation: req.params.id_conversation } },
    });
    if (!discussion) return res.status(404).json({ message: 'Discussion not found' });

    const updatedDiscussion = await prisma.discuss.update({
      where: { Id_User_Id_Conversation: { Id_User: req.params.id_user, Id_Conversation: req.params.id_conversation } },
      data: {
        Id_User,
        Id_Conversation
      },
    });

    res.status(200).json(updatedDiscussion); // OK
  } catch (error) {
    if (error instanceof Prisma.PrismaClientValidationError) {
      res.status(400).json({ error: 'Invalid input data' });
    } else {
      res.status(500).json({ error: 'Failed to update discussion' });
    }
  }
};

// Delete a discussion by User and Conversation IDs
exports.deleteDiscussion = async (req, res) => {
  try {
    // Check if the discussion exists before attempting to delete
    const discussion = await prisma.discuss.findUnique({
      where: { Id_User_Id_Conversation: { Id_User: req.params.id_user, Id_Conversation: req.params.id_conversation } },
    });
    if (!discussion) return res.status(404).json({ message: 'Discussion not found' });

    await prisma.discuss.delete({
      where: { Id_User_Id_Conversation: { Id_User: req.params.id_user, Id_Conversation: req.params.id_conversation } },
    });

    res.status(204).send(); // No Content
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete discussion' });
  }
};
