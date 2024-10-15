const express = require('express');
const router = express.Router();
require('dotenv').config();
const fs = require('fs');

router.get('/', async (req, res) => {
    fs.readFile('api/routes/front/public/index.html', 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('An error occurred while trying to read the file');
            return;
        }
        res.send(data);
    }
    );
});

module.exports = router;