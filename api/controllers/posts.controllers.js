const prisma = require('../models');
const { Prisma } = require('@prisma/client');

// Get all posts
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await prisma.post.findMany();
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
};

// Get a post by ID
exports.getPostById = async (req, res) => {
  try {
    const post = await prisma.post.findUnique({
      where: { Id_Post: req.params.id },
    });
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch post' });
  }
};

// Create a new post
exports.createPost = async (req, res) => {
  try {
    const { content, visibility, toxic_score, image_exists, date_creation, verified, Id_User } = req.body;

    const newPost = await prisma.post.create({
      data: {
        content,
        visibility,
        toxic_score,
        image_exists,
        date_creation,
        verified,
        Id_User
      },
    });
    res.status(201).json(newPost);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientValidationError) {
      res.status(400).json({ error: 'Invalid input data' });
    } else {
      res.status(500).json({ error: 'Failed to create post' });
    }
  }
};

// Update a post by ID
exports.updatePost = async (req, res) => {
  try {
    const { content, visibility, toxic_score, image_exists, date_creation, verified } = req.body;

    const post = await prisma.post.findUnique({
      where: { Id_Post: req.params.id },
    });
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const updatedPost = await prisma.post.update({
      where: { Id_Post: req.params.id },
      data: {
        content,
        visibility,
        toxic_score,
        image_exists,
        date_creation,
        verified,
      },
    });
    res.status(200).json(updatedPost);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientValidationError) {
      res.status(400).json({ error: 'Invalid input data' });
    } else {
      res.status(500).json({ error: 'Failed to update post' });
    }
  }
};

// Delete a post by ID
exports.deletePost = async (req, res) => {
  try {
    const post = await prisma.post.findUnique({
      where: { Id_Post: req.params.id },
    });
    if (!post) return res.status(404).json({ message: 'Post not found' });

    await prisma.post.delete({
      where: { Id_Post: req.params.id },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete post' });
  }
};
