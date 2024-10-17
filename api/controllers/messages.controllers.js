const prisma = require('../models');
const { Prisma } = require('@prisma/client');

// Get all messages
exports.getAllMessages = async (req, res) => {
  try {
    const messages = await prisma.message.findMany();
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
};

// Get a message by ID
exports.getMessageById = async (req, res) => {
  try {
    const message = await prisma.message.findUnique({
      where: { Id_Message: req.params.id },
    });
    if (!message) return res.status(404).json({ message: 'Message not found' });
    res.status(200).json(message);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch message' });
  }
};

// Create a new message
exports.createMessage = async (req, res) => {
  try {
    const { content, date_upload, Id_User } = req.body;

    const newMessage = await prisma.message.create({
      data: {
        content,
        date_upload: new Date(date_upload),
        Id_User,
        Id_Conversation,
      },
    });

    res.status(201).json(newMessage); // Created
  } catch (error) {
    if (error instanceof Prisma.PrismaClientValidationError) {
      res.status(400).json({ error: 'Invalid input data' }); // Bad Request
    } else {
      res.status(500).json({ error: 'Failed to create message' });
    }
  }
};

// Update a message by ID
exports.updateMessage = async (req, res) => {
  try {
    const { content, date_upload, Id_User, Id_Conversation } = req.body;

    // Check if the message exists
    const message = await prisma.message.findUnique({
      where: { Id_Message: req.params.id },
    });
    if (!message) return res.status(404).json({ message: 'Message not found' });

    const updatedMessage = await prisma.message.update({
      where: { Id_Message: req.params.id },
      data: {
        content,
        date_upload: new Date(date_upload),
        Id_User,
        Id_Conversation
      },
    });

    res.status(200).json(updatedMessage); // OK
  } catch (error) {
    if (error instanceof Prisma.PrismaClientValidationError) {
      res.status(400).json({ error: 'Invalid input data' });
    } else {
      res.status(500).json({ error: 'Failed to update message' });
    }
  }
};

// Delete a message by ID
exports.deleteMessage = async (req, res) => {
  try {
    // Check if the message exists before attempting to delete
    const message = await prisma.message.findUnique({
      where: { Id_Message: req.params.id },
    });
    if (!message) return res.status(404).json({ message: 'Message not found' });

    await prisma.message.delete({
      where: { Id_Message: req.params.id },
    });

    res.status(204).send(); // No Content
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete message' });
  }
};
