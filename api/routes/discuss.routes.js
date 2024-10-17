const express = require('express');
const router = express.Router();
const discussController = require('../controllers/discuss.controllers');

// CRUD routes for Discussions (associations between users and conversations)
router.get('/', discussController.getAllDiscussions);
router.get('/:id_user/:id_conversation', discussController.getDiscussionById);
router.post('/', discussController.createDiscussion);
router.put('/:id_user/:id_conversation', discussController.updateDiscussion);
router.delete('/:id_user/:id_conversation', discussController.deleteDiscussion);

module.exports = router;
