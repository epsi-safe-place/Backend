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
    const { mail } = req.body;

    // Check if user with the same email already exists
    const existingUser = await prisma.users.findUnique({
      where: { mail },
    });
    
    if (existingUser) {
      return res.status(409).json({ error: 'User with this email already exists' }); // Conflict
    }

    const newUser = await prisma.users.create({
      data: req.body,
    });
    res.status(201).json(newUser); // Created
  } catch (error) {
    if (error.code === 'P2002') { // Prisma's unique constraint violation error code
      res.status(409).json({ error: 'User with this email already exists' });
    } else if (error instanceof Prisma.PrismaClientValidationError) {
      res.status(400).json({ error: 'Invalid input data' }); // Bad Request
    } else {
      res.status(500).json({ error: 'Failed to create user' });
    }
    console.error(error);
  }
};

// Update a user by ID
exports.updateUser = async (req, res) => {
  try {
    const { mail } = req.body;

    // Check if the user exists
    const user = await prisma.users.findUnique({
      where: { Id_Users: req.params.id },
    });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Optional: Check for email uniqueness during update
    const existingUser = await prisma.users.findUnique({
      where: { mail },
    });
    if (existingUser && existingUser.Id_Users !== req.params.id) {
      return res.status(409).json({ error: 'Another user with this email already exists' });
    }

    const updatedUser = await prisma.users.update({
      where: { Id_Users: req.params.id },
      data: req.body,
    });
    res.status(200).json(updatedUser); // OK
  } catch (error) {
    if (error.code === 'P2002') {
      res.status(409).json({ error: 'User with this email already exists' });
    } else if (error instanceof Prisma.PrismaClientValidationError) {
      res.status(400).json({ error: 'Invalid input data' });
    } else {
      res.status(500).json({ error: 'Failed to update user' });
    }
  }
};

// Delete a user by ID
exports.deleteUser = async (req, res) => {
  try {
    // Check if the user exists before attempting to delete
    const user = await prisma.users.findUnique({
      where: { Id_Users: req.params.id },
    });
    if (!user) return res.status(404).json({ message: 'User not found' });

    await prisma.users.delete({
      where: { Id_Users: req.params.id },
    });
    res.status(204).send(); // No Content
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
};
