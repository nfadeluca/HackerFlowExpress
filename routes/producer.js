const express = require('express');
const path = require('path');
const router = express.Router();
const axios = require('axios');


router.get('/producer', (req, res) => {
   res.render(path.join(__dirname, '..', 'views', 'producer', 'index.ejs'), {title: 'Producer Home'});
});

router.get('/producer/manage', (req, res) => {
   res.render(path.join(__dirname, '..', 'views', 'producer', 'manage.ejs'), {title: 'Manage'});
});

router.get('/producer/create', (req, res) => {
   res.render(path.join(__dirname, '..', 'views', 'producer', 'create.ejs'), {title: 'Create'});
});

router.get('/producer/analytics', (req, res) => {
   res.render(path.join(__dirname, '..', 'views', 'producer', 'analytics.ejs'), {title: 'My Analytics'});
});

router.get('/producer/discover', async (req, res) => {
   try {
      const response = await axios.get('http://localhost:3000/api/djs');
      const djs_data = response.data;
      res.render(path.join(__dirname, '..', 'views', 'producer', 'discover.ejs'), {title: 'Discover Producers', djs: djs_data});
   } catch (error) {
      console.error('Error fetching DJ data:', error);
      res.status(500).send('Internal Server Error');
   }
});

module.exports = router;
