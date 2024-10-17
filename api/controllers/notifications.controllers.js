const prisma = require('../models');
const { Prisma } = require('@prisma/client');

// Get all notifications
exports.getAllNotifications = async (req, res) => {
  try {
    const notifications = await prisma.notifications.findMany();
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
};

// Get a notification by ID
exports.getNotificationById = async (req, res) => {
  try {
    const notification = await prisma.notifications.findUnique({
      where: { Id_Notifications: req.params.id },
    });
    if (!notification) return res.status(404).json({ message: 'Notification not found' });
    res.status(200).json(notification);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notification' });
  }
};

// Create a new notification
exports.createNotification = async (req, res) => {
  try {
    const { type, content, date_upload, Id_User } = req.body;

    const newNotification = await prisma.notifications.create({
      data: {
        type,
        content,
        date_upload,
        Id_User,
      },
    });

    res.status(201).json(newNotification); // Created
  } catch (error) {
    if (error instanceof Prisma.PrismaClientValidationError) {
      res.status(400).json({ error: 'Invalid input data' }); // Bad Request
    } else {
      res.status(500).json({ error: 'Failed to create notification' });
    }
  }
};

// Update a notification by ID
exports.updateNotification = async (req, res) => {
  try {
    const { type, content, date_upload, Id_User } = req.body;

    // Check if the notification exists
    const notification = await prisma.notifications.findUnique({
      where: { Id_Notifications: req.params.id },
    });
    if (!notification) return res.status(404).json({ message: 'Notification not found' });

    const updatedNotification = await prisma.notifications.update({
      where: { Id_Notifications: req.params.id },
      data: {
        type,
        content,
        date_upload,
        Id_User,
      },
    });

    res.status(200).json(updatedNotification); // OK
  } catch (error) {
    if (error instanceof Prisma.PrismaClientValidationError) {
      res.status(400).json({ error: 'Invalid input data' });
    } else {
      res.status(500).json({ error: 'Failed to update notification' });
    }
  }
};

// Delete a notification by ID
exports.deleteNotification = async (req, res) => {
  try {
    // Check if the notification exists before attempting to delete
    const notification = await prisma.notifications.findUnique({
      where: { Id_Notifications: req.params.id },
    });
    if (!notification) return res.status(404).json({ message: 'Notification not found' });

    await prisma.notifications.delete({
      where: { Id_Notifications: req.params.id },
    });

    res.status(204).send(); // No Content
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete notification' });
  }
};
