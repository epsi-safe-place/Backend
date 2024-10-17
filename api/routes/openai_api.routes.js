const express = require('express');
const router = express.Router();
const openaiController = require('../controllers/openai_api.controllers');

// Route for Moderation API
router.post('/moderate', openaiController.moderateContent);

// Route for Rephrasing API
router.post('/rephrase', openaiController.rephraseContent);

module.exports = router;
