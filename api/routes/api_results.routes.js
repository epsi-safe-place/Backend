const express = require('express');
const router = express.Router();
const apiResultController = require('../controllers/api_results.controllers');

// CRUD routes for API results
router.get('/', apiResultController.getAllAPIResults);
router.get('/:id', apiResultController.getAPIResultById);
router.post('/', apiResultController.createAPIResult);
router.put('/:id', apiResultController.updateAPIResult);
router.delete('/:id', apiResultController.deleteAPIResult);

module.exports = router;
