const prisma = require('../models');
const { Prisma } = require('@prisma/client');
const path = require('path');
const fs = require('fs');

// Helper function to get base64 image from file
const getBase64Image = (postId) => {
  const uploadsDir = path.join(__dirname, '../..', 'uploads');
  const files = fs.readdirSync(uploadsDir);

  // Find the image file that starts with the post ID
  const imageFile = files.find(file => file.startsWith(postId));

  if (imageFile) {
    const imagePath = path.join(uploadsDir, imageFile);
    const imageExtension = imageFile.split('.').pop(); // Get the file extension
    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = `data:image/${imageExtension};base64,${imageBuffer.toString('base64')}`;
    return base64Image;
  }
  return null;
};

// Get all posts
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await prisma.post.findMany();

    const postsWithImages = posts.map(post => {
      if (post.image_exists) {
        const base64Image = getBase64Image(post.Id_Post);
        return { ...post, image_b64: base64Image };
      }
      return post;
    });

    res.status(200).json(postsWithImages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch posts' });
    console.error(error);
  }
};

// Get feed posts excluding those from a specific user ID
exports.getFeedPosts = async (req, res) => {
  try {
    const { excludeUserId } = req.query;

    const posts = await prisma.post.findMany({
      where: {
        Id_User: {
          not: excludeUserId // Exclude posts by this user ID
        }
      }
    });

    const postsWithImages = posts.map(post => {
      if (post.image_exists) {
        const base64Image = getBase64Image(post.Id_Post);
        return { ...post, image_b64: base64Image };
      }
      return post;
    });

    res.status(200).json(postsWithImages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch feed posts' });
    console.error(error);
  }
};


// Get a post by ID
exports.getPostById = async (req, res) => {
  try {
    const post = await prisma.post.findUnique({
      where: { Id_Post: req.params.id },
    });
    if (!post) return res.status(404).json({ message: 'Post not found' });

    // Add base64 image if it exists
    if (post.image_exists) {
      post.image_b64 = getBase64Image(post.Id_Post);
    }

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch post' });
  }
};

// Create a new post
exports.createPost = async (req, res) => {
  try {
    const { content, visibility, toxic_score, image_exists, image_b64, date_creation, verified, Id_User } = req.body;

    // Create the post
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

    // If image_exists is true and image_b64 is provided
    if (image_exists && image_b64) {
      const uploadsDir = path.join(__dirname, '../..', 'uploads');
      
      // Ensure uploads directory exists
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      // Extract the image type (e.g., png, jpg, etc.) from the base64 string
      const matches = image_b64.match(/^data:image\/([a-zA-Z]+);base64,/);
      if (!matches) {
        throw new Error('Invalid base64 image format');
      }

      const imageExtension = matches[1]; // e.g., "png", "jpeg"
      const imageBuffer = Buffer.from(image_b64.replace(/^data:image\/[a-zA-Z]+;base64,/, ''), 'base64');

      // Define the filename with the post's generated ID and correct extension
      const imageFilename = `${newPost.Id_Post}.${imageExtension}`;
      const imagePath = path.join(uploadsDir, imageFilename);

      // Save the image to the uploads directory
      fs.writeFileSync(imagePath, imageBuffer);
    }

    res.status(201).json(newPost); // Return the newly created post
  } catch (error) {
    if (error instanceof Prisma.PrismaClientValidationError) {
      res.status(400).json({ error: 'Invalid input data' });
    } else if (error.message === 'Invalid base64 image format') {
      res.status(400).json({ error: 'Invalid base64 image format' });
    } else {
      res.status(500).json({ error: 'Failed to create post' });
    }
    console.error(error);
  }
};

// Update a post by ID
exports.updatePost = async (req, res) => {
  try {
    const { content, visibility, toxic_score, image_exists, image_b64, date_creation, verified } = req.body;

    const post = await prisma.post.findUnique({
      where: { Id_Post: req.params.id },
    });
    if (!post) return res.status(404).json({ message: 'Post not found' });

    // If image_exists is false and was previously true, delete the image
    if (!image_exists && post.image_exists) {
      const files = fs.readdirSync(path.join(__dirname, '../..', 'uploads'));
      const imageFile = files.find(file => file.startsWith(post.Id_Post));
      if (imageFile) {
        const imagePath = path.join(__dirname, '../..', 'uploads', imageFile);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }
    }

    // If image_exists is true and image_b64 is provided, update the image
    if (image_exists && image_b64) {
      const uploadsDir = path.join(__dirname, '../..', 'uploads');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      const matches = image_b64.match(/^data:image\/([a-zA-Z]+);base64,/);
      if (!matches) {
        throw new Error('Invalid base64 image format');
      }

      const imageExtension = matches[1]; // e.g., "png", "jpeg"
      const imageBuffer = Buffer.from(image_b64.replace(/^data:image\/[a-zA-Z]+;base64,/, ''), 'base64');
      const imageFilename = `${post.Id_Post}.${imageExtension}`;
      const imagePath = path.join(uploadsDir, imageFilename);

      // Save the updated image
      fs.writeFileSync(imagePath, imageBuffer);
    }

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

    // If post has an image, delete the image file
    if (post.image_exists) {
      const files = fs.readdirSync(path.join(__dirname, '../..', 'uploads'));
      const imageFile = files.find(file => file.startsWith(post.Id_Post));
      if (imageFile) {
        const imagePath = path.join(__dirname, '../..', 'uploads', imageFile);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }
    }

    await prisma.post.delete({
      where: { Id_Post: req.params.id },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete post' });
  }
};
