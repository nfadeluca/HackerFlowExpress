const express = require('express');
const path = require('path');
const router = express.Router();
const fs = require('fs');

const readJSON = (filePath) => {
   const rawData = fs.readFileSync(filePath);
   return JSON.parse(rawData);
};

const djs_data = readJSON(path.join(__dirname, '..', 'data', 'djs.json'));
const songs_data = readJSON(path.join(__dirname, '..', 'data', 'songs.json'));
const timeslots_data = readJSON(path.join(__dirname, '..', 'data', 'timeslots.json'));
const events_data = readJSON(path.join(__dirname, '..', 'data', 'events.json'));

/* Used for fetching json data */

router.get('/api/djs', (req, res) => {
   res.json(djs_data);
});

router.get('/api/songs', (req, res) => {
   res.json(songs_data);
});

router.get('/api/timeslots', (req, res) => {
   res.json(timeslots_data);
});

router.get('/api/events', (req, res) => {
   res.json(events_data);
});


/* Uploading data to events */
router.post('/api/events', (req, res) => {
   const newEvent = req.body;

   // Generate a unique id for the new event, could be more sophisticated
   newEvent.id = events_data.length + 1;

   events_data.push(newEvent);

   // Write the updated data to the events.json file
   fs.writeFile(path.join(__dirname, '..', 'data', 'events.json'), JSON.stringify(events_data, null, 2), (err) => {
       if (err) {
           return res.status(500).json({ message: 'Internal Server Error' });
       }
       return res.json({ message: 'Event added successfully!' });
   });
});


/* Upload data to djs */
router.post('/api/djs', (req, res) => {
   const updatedDJ = req.body;

   // Find the index of the DJ with the provided ID in our data
   const djIndex = djs_data.findIndex(dj => dj.djID === updatedDJ.djID);

   if (djIndex === -1) {
       return res.status(404).json({ message: 'DJ not found.' });
   }

   // Replace the existing DJ data with the updated one
   djs_data[djIndex] = updatedDJ;

   // Save the updated DJs list back to djs.json
   fs.writeFile(path.join(__dirname, '..', 'data', 'djs.json'), JSON.stringify(djs_data, null, 2), (err) => {
       if (err) {
           return res.status(500).json({ message: 'Internal Server Error' });
       }
       return res.json({ success: true, message: 'DJ updated successfully!' });
   });
});


module.exports = router;
