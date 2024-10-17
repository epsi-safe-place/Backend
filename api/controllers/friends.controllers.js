const prisma = require('../models');
const { Prisma } = require('@prisma/client');

// Get all friendships
exports.getAllFriends = async (req, res) => {
  try {
    const friends = await prisma.friend.findMany({
      include: {
        user: true,
        friend: true
      }
    });
    res.status(200).json(friends);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch friends' });
  }
};

// Get a friendship by user and friend IDs
exports.getFriendById = async (req, res) => {
  try {
    const friend = await prisma.friend.findUnique({
      where: { Id_User_Id_Friend: { Id_User: req.params.id_user, Id_Friend: req.params.id_friend } },
      include: {
        user: true,
        friend: true
      }
    });
    if (!friend) return res.status(404).json({ message: 'Friendship not found' });
    res.status(200).json(friend);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch friendship' });
  }
};

// Create a new friendship
exports.createFriend = async (req, res) => {
  try {
    const { Id_User, Id_Friend } = req.body;

    const newFriend = await prisma.friend.create({
      data: {
        Id_User,
        Id_Friend
      },
    });

    res.status(201).json(newFriend); // Created
  } catch (error) {
    if (error instanceof Prisma.PrismaClientValidationError) {
      res.status(400).json({ error: 'Invalid input data' }); // Bad Request
    } else {
      res.status(500).json({ error: 'Failed to create friendship' });
    }
  }
};

// Update a friendship by user and friend IDs
exports.updateFriend = async (req, res) => {
  try {
    const { Id_User, Id_Friend } = req.body;

    // Check if the friendship exists
    const friend = await prisma.friend.findUnique({
      where: { Id_User_Id_Friend: { Id_User: req.params.id_user, Id_Friend: req.params.id_friend } },
    });
    if (!friend) return res.status(404).json({ message: 'Friendship not found' });

    const updatedFriend = await prisma.friend.update({
      where: { Id_User_Id_Friend: { Id_User: req.params.id_user, Id_Friend: req.params.id_friend } },
      data: {
        Id_User,
        Id_Friend
      },
    });

    res.status(200).json(updatedFriend); // OK
  } catch (error) {
    if (error instanceof Prisma.PrismaClientValidationError) {
      res.status(400).json({ error: 'Invalid input data' });
    } else {
      res.status(500).json({ error: 'Failed to update friendship' });
    }
  }
};

// Delete a friendship by user and friend IDs
exports.deleteFriend = async (req, res) => {
  try {
    // Check if the friendship exists before attempting to delete
    const friend = await prisma.friend.findUnique({
      where: { Id_User_Id_Friend: { Id_User: req.params.id_user, Id_Friend: req.params.id_friend } },
    });
    if (!friend) return res.status(404).json({ message: 'Friendship not found' });

    await prisma.friend.delete({
      where: { Id_User_Id_Friend: { Id_User: req.params.id_user, Id_Friend: req.params.id_friend } },
    });

    res.status(204).send(); // No Content
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete friendship' });
  }
};
