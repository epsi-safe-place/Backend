const prisma = require('../models');
const { Prisma } = require('@prisma/client');

// Get all conversations
exports.getAllConversations = async (req, res) => {
  try {
    const conversations = await prisma.conversation.findMany({
      include: {
        Discuss: true,
        Message: true
      }
    });
    res.status(200).json(conversations);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch conversations' });
  }
};

// Get a conversation by ID
exports.getConversationById = async (req, res) => {
  try {
    const conversation = await prisma.conversation.findUnique({
      where: { Id_Conversation: req.params.id },
      include: {
        Discuss: true,
        Message: true
      }
    });
    if (!conversation) return res.status(404).json({ message: 'Conversation not found' });
    res.status(200).json(conversation);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch conversation' });
  }
};

// Create a new conversation
exports.createConversation = async (req, res) => {
  try {
    const { name } = req.body;

    const newConversation = await prisma.conversation.create({
      data: {
        name
      },
    });

    res.status(201).json(newConversation); // Created
  } catch (error) {
    if (error instanceof Prisma.PrismaClientValidationError) {
      res.status(400).json({ error: 'Invalid input data' }); // Bad Request
    } else {
      res.status(500).json({ error: 'Failed to create conversation' });
    }
  }
};

// Update a conversation by ID
exports.updateConversation = async (req, res) => {
  try {
    const { name } = req.body;

    // Check if the conversation exists
    const conversation = await prisma.conversation.findUnique({
      where: { Id_Conversation: req.params.id },
    });
    if (!conversation) return res.status(404).json({ message: 'Conversation not found' });

    const updatedConversation = await prisma.conversation.update({
      where: { Id_Conversation: req.params.id },
      data: {
        name,
      },
    });

    res.status(200).json(updatedConversation); // OK
  } catch (error) {
    if (error instanceof Prisma.PrismaClientValidationError) {
      res.status(400).json({ error: 'Invalid input data' });
    } else {
      res.status(500).json({ error: 'Failed to update conversation' });
    }
  }
};

// Delete a conversation by ID
exports.deleteConversation = async (req, res) => {
  try {
    // Check if the conversation exists before attempting to delete
    const conversation = await prisma.conversation.findUnique({
      where: { Id_Conversation: req.params.id },
    });
    if (!conversation) return res.status(404).json({ message: 'Conversation not found' });

    await prisma.conversation.delete({
      where: { Id_Conversation: req.params.id },
    });

    res.status(204).send(); // No Content
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete conversation' });
  }
};
