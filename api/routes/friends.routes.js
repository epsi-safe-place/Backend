const express = require('express');
const router = express.Router();
const friendController = require('../controllers/friends.controllers');

// CRUD routes for Friendships
router.get('/', friendController.getAllFriends);
router.get('/:id_user/:id_friend', friendController.getFriendById);
router.post('/', friendController.createFriend);
router.put('/:id_user/:id_friend', friendController.updateFriend);
router.delete('/:id_user/:id_friend', friendController.deleteFriend);

module.exports = router;
