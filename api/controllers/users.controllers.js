const prisma = require('../models');

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await prisma.users.findMany();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

// Get a user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await prisma.users.findUnique({
      where: { Id_Users: req.params.id },
    });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};

// Create a new user
exports.createUser = async (req, res) => {
  try {
    const newUser = await prisma.users.create({
      data: req.body,
    });
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create user' });
    console.error(error)
  }
};

// Update a user by ID
exports.updateUser = async (req, res) => {
  try {
    const updatedUser = await prisma.users.update({
      where: { Id_Users: req.params.id },
      data: req.body,
    });
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user' });
  }
};

// Delete a user by ID
exports.deleteUser = async (req, res) => {
  try {
    await prisma.users.delete({
      where: { Id_Users: req.params.id },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
};
