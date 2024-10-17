const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settings.controllers');

// CRUD routes for Settings
router.get('/', settingsController.getAllSettings);
router.get('/:id', settingsController.getSettingById);
router.post('/', settingsController.createSetting);
router.put('/:id', settingsController.updateSetting);
router.delete('/:id', settingsController.deleteSetting);

module.exports = router;
