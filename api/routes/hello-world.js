const express = require('express');
const router = express.Router();
require('dotenv').config();
const fs = require('fs');

router.get('/', async (req, res) => {
    res.send('Hello World!');
});

module.exports = router;