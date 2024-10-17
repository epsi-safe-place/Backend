const prisma = require('../models');
const { Prisma } = require('@prisma/client');

// Get all settings
exports.getAllSettings = async (req, res) => {
  try {
    const settings = await prisma.settings.findMany();
    res.status(200).json(settings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
};

// Get a setting by ID
exports.getSettingById = async (req, res) => {
  try {
    const setting = await prisma.settings.findUnique({
      where: { Id_Settings: req.params.id },
    });
    if (!setting) return res.status(404).json({ message: 'Setting not found' });
    res.status(200).json(setting);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch setting' });
  }
};

// Create a new setting
exports.createSetting = async (req, res) => {
  try {
    const { data_type, content, confidentiality, Id_User } = req.body;

    const newSetting = await prisma.settings.create({
      data: {
        data_type,
        content,
        confidentiality,
        Id_User,
      },
    });

    res.status(201).json(newSetting); // Created
  } catch (error) {
    if (error instanceof Prisma.PrismaClientValidationError) {
      res.status(400).json({ error: 'Invalid input data' }); // Bad Request
    } else {
      res.status(500).json({ error: 'Failed to create setting' });
    }
  }
};

// Update a setting by ID
exports.updateSetting = async (req, res) => {
  try {
    const { data_type, content, confidentiality, Id_User } = req.body;

    // Check if the setting exists
    const setting = await prisma.settings.findUnique({
      where: { Id_Settings: req.params.id },
    });
    if (!setting) return res.status(404).json({ message: 'Setting not found' });

    const updatedSetting = await prisma.settings.update({
      where: { Id_Settings: req.params.id },
      data: {
        data_type,
        content,
        confidentiality,
        Id_User,
      },
    });

    res.status(200).json(updatedSetting); // OK
  } catch (error) {
    if (error instanceof Prisma.PrismaClientValidationError) {
      res.status(400).json({ error: 'Invalid input data' });
    } else {
      res.status(500).json({ error: 'Failed to update setting' });
    }
  }
};

// Delete a setting by ID
exports.deleteSetting = async (req, res) => {
  try {
    // Check if the setting exists before attempting to delete
    const setting = await prisma.settings.findUnique({
      where: { Id_Settings: req.params.id },
    });
    if (!setting) return res.status(404).json({ message: 'Setting not found' });

    await prisma.settings.delete({
      where: { Id_Settings: req.params.id },
    });

    res.status(204).send(); // No Content
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete setting' });
  }
};
