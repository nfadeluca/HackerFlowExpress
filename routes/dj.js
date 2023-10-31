const express = require('express');
const path = require('path');
const router = express.Router();

router.get('/dj', (req, res) => {
   res.render(path.join(__dirname, '..', 'views', 'dj', 'index.ejs'));
});

router.get('/dj/search', (req, res) => {
   res.render(path.join(__dirname, '..', 'views', 'dj', 'search.ejs'));
});

module.exports = router;
