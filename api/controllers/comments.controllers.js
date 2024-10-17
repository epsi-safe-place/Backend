const prisma = require('../models');
const { Prisma } = require('@prisma/client');
const path = require('path');
const fs = require('fs');

// Helper function to get base64 image from file
const getBase64Image = (commentId) => {
  const uploadsDir = path.join(__dirname, '../..', 'uploads');
  const files = fs.readdirSync(uploadsDir);

  // Find the image file that starts with the comment ID
  const imageFile = files.find(file => file.startsWith(commentId));

  if (imageFile) {
    const imagePath = path.join(uploadsDir, imageFile);
    const imageExtension = imageFile.split('.').pop(); // Get the file extension
    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = `data:image/${imageExtension};base64,${imageBuffer.toString('base64')}`;
    return base64Image;
  }
  return null;
};

// Get all comments
exports.getAllComments = async (req, res) => {
  try {
    const comments = await prisma.comments.findMany();

    const commentsWithImages = comments.map(comment => {
      if (comment.image_exists) {
        const base64Image = getBase64Image(comment.Id_Comment);
        return { ...comment, image_b64: base64Image };
      }
      return comment;
    });

    res.status(200).json(commentsWithImages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
};

// Get a comment by ID
exports.getCommentById = async (req, res) => {
  try {
    const comment = await prisma.comments.findUnique({
      where: { Id_Comment: req.params.id },
      include: {
        replies: true // Include any comments that are replies to this comment
      }
    });
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    // Add base64 image if it exists
    if (comment.image_exists) {
      comment.image_b64 = getBase64Image(comment.Id_Comment);
    }

    res.status(200).json(comment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch comment' });
  }
};

// Create a new comment
exports.createComment = async (req, res) => {
  try {
    const { content, date_upload, toxic_score, image_exists, image_b64, Id_Post, Id_User, Id_Reply_to_comment } = req.body;

    // Create the comment
    const newComment = await prisma.comments.create({
      data: {
        content,
        date_upload: new Date(date_upload),
        toxic_score,
        image_exists,
        Id_Post,
        Id_User,
        Id_Reply_to_comment // This allows the comment to be a reply to another comment
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

      // Define the filename with the comment's generated ID and correct extension
      const imageFilename = `${newComment.Id_Comment}.${imageExtension}`;
      const imagePath = path.join(uploadsDir, imageFilename);

      // Save the image to the uploads directory
      fs.writeFileSync(imagePath, imageBuffer);
    }

    res.status(201).json(newComment); // Created
  } catch (error) {
    if (error instanceof Prisma.PrismaClientValidationError) {
      res.status(400).json({ error: 'Invalid input data' }); // Bad Request
      console.error(error);
    } else {
      res.status(500).json({ error: 'Failed to create comment' });
    }
  }
};

// Update a comment by ID
exports.updateComment = async (req, res) => {
  try {
    const { content, toxic_score, image_exists, image_b64, Id_Post, Id_User, Id_Reply_to_comment } = req.body;

    // Check if the comment exists
    const comment = await prisma.comments.findUnique({
      where: { Id_Comment: req.params.id },
    });
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    // If image_exists is false and was previously true, delete the image
    if (!image_exists && comment.image_exists) {
      const files = fs.readdirSync(path.join(__dirname, '../..', 'uploads'));
      const imageFile = files.find(file => file.startsWith(comment.Id_Comment));
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
      const imageFilename = `${comment.Id_Comment}.${imageExtension}`;
      const imagePath = path.join(uploadsDir, imageFilename);

      // Save the updated image
      fs.writeFileSync(imagePath, imageBuffer);
    }

    // Update the comment with new data including reply field
    const updatedComment = await prisma.comments.update({
      where: { Id_Comment: req.params.id },
      data: {
        content,
        toxic_score,
        image_exists,
        Id_Post,
        Id_User,
        Id_Reply_to_comment // Include the updated reply-to-comment ID
      },
    });

    res.status(200).json(updatedComment); // OK
  } catch (error) {
    if (error instanceof Prisma.PrismaClientValidationError) {
      res.status(400).json({ error: 'Invalid input data' });
    } else {
      res.status(500).json({ error: 'Failed to update comment' });
    }
  }
};

// Delete a comment by ID
exports.deleteComment = async (req, res) => {
  try {
    // Check if the comment exists before attempting to delete
    const comment = await prisma.comments.findUnique({
      where: { Id_Comment: req.params.id },
    });
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    // If comment has an image, delete the image file
    if (comment.image_exists) {
      const files = fs.readdirSync(path.join(__dirname, '../..', 'uploads'));
      const imageFile = files.find(file => file.startsWith(comment.Id_Comment));
      if (imageFile) {
        const imagePath = path.join(__dirname, '../..', 'uploads', imageFile);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }
    }

    await prisma.comments.delete({
      where: { Id_Comment: req.params.id },
    });
    res.status(204).send(); // No Content
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete comment' });
  }
};
