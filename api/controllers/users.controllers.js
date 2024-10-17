const prisma = require('../models');
const { Prisma } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Secret key for JWT
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// Hash the password using bcrypt
const hashPassword = async (password) => {
  const saltRounds = 10; // You can increase this to make it more secure (but slower)
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
};

// Compare the password with the hashed password
const comparePassword = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};

// Get all users (omit password field in response)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await prisma.users.findMany({
      select: {
        Id_User: true,
        mail: true,
        first_name: true,
        last_name: true,
        birth_date: true,
        isAdmin: true,
        seed_totp: true
      }
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
    console.error(error);
  }
};

// Get a user by ID (omit password field in response)
exports.getUserById = async (req, res) => {
  try {
    const user = await prisma.users.findUnique({
      where: { Id_User: req.params.id },
      select: {
        Id_User: true,
        mail: true,
        first_name: true,
        last_name: true,
        birth_date: true,
        seed_totp: true,
        isAdmin: true
      }
    });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};

// Create a new user with password hashing
exports.createUser = async (req, res) => {
  try {
    const { mail, password, first_name, last_name, birth_date, isAdmin, seed_totp } = req.body;

    // Check if user with the same email already exists
    const existingUser = await prisma.users.findUnique({
      where: { mail },
    });
    
    if (existingUser) {
      return res.status(409).json({ error: 'User with this email already exists' }); // Conflict
    }

    // Hash the password before saving
    const hashedPassword = await hashPassword(password);

    const newUser = await prisma.users.create({
      data: {
        mail,
        password: hashedPassword, // Store hashed password
        first_name,
        last_name,
        birth_date,
        seed_totp,
        isAdmin
      },
    });
    res.status(201).json({ Id_User: newUser.Id_User, mail: newUser.mail }); // Omit password in response
  } catch (error) {
    if (error.code === 'P2002') {
      res.status(409).json({ error: 'User with this email already exists' });
    } else if (error instanceof Prisma.PrismaClientValidationError) {
      res.status(400).json({ error: 'Invalid input data' });
    } else {
      res.status(500).json({ error: 'Failed to create user' });
    }
    console.error(error);
  }
};

// Update a user by ID with password hashing
exports.updateUser = async (req, res) => {
  try {
    const { mail, password, firstName, lastName, birth_date, isAdmin, seed_totp } = req.body;

    // Check if the user exists
    const user = await prisma.users.findUnique({
      where: { Id_User: req.params.id },
    });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Optional: Check for email uniqueness during update
    const existingUser = await prisma.users.findUnique({
      where: { mail },
    });
    if (existingUser && existingUser.Id_User !== req.params.id) {
      return res.status(409).json({ error: 'Another user with this email already exists' });
    }

    // If password is provided, hash it
    let updatedData = { mail, firstName, lastName, seed_totp, isAdmin, birth_date };
    if (password) {
      updatedData.password = await hashPassword(password); // Hash the new password
    }

    const updatedUser = await prisma.users.update({
      where: { Id_User: req.params.id },
      data: updatedData,
    });
    res.status(200).json({ Id_User: updatedUser.Id_User, mail: updatedUser.mail }); // Omit password in response
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
    const user = await prisma.users.findUnique({
      where: { Id_User: req.params.id },
    });
    if (!user) return res.status(404).json({ message: 'User not found' });

    await prisma.users.delete({
      where: { Id_User: req.params.id },
    });
    res.status(204).send(); // No Content
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
};

// Login route for authentication
exports.loginUser = async (req, res) => {
  try {
    const { mail, password } = req.body;

    // Find user by email
    const user = await prisma.users.findUnique({
      where: { mail },
    });
    if (!user) return res.status(401).json({ error: 'Invalid email or password' });

    // Compare passwords
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign({ Id_User: user.Id_User, mail: user.mail }, JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Failed to login user' });
  }
};
