const express = require('express');
const path = require('path');
const router = express.Router();

router.get('/listener', (req, res) => {
   res.render(path.join(__dirname, '..', 'views', 'listener', 'index.ejs'));
});

module.exports = router;
