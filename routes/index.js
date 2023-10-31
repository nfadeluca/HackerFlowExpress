const express = require('express');
const router = express.Router();

// Define the home page route
router.get('/', function(req, res) {
  res.render('index', { title: 'Home' });
});

module.exports = router;
