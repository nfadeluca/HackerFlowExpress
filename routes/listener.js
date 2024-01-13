const express = require('express');
const path = require('path');
const router = express.Router();
const axios = require('axios');

router.get('/listener', async (req, res) => {
   try {
      const response1 = await axios.get('http://localhost:3000/api/djs');
      const djs_data = response1.data;
      const response2 = await axios.get('http://localhost:3000/api/songs');
      const songs_data = response2.data;

      res.render(path.join(__dirname, '..', 'views', 'listener', 'index.ejs'), {title: 'Listener', djs: djs_data, songs: songs_data});
   } catch (error) {
      console.error('Error fetching Songs data:', error);
      res.status(500).send('Internal Server Error');
   }
   
});

module.exports = router;
