const fs = require('fs');
require('dotenv').config();

const mongoose = require('mongoose');
const DJ = require('./models/dj');
const Song = require('./models/song');
const Timeslot = require('./models/timeslot');

const DJs = JSON.parse(fs.readFileSync('./data/djs.json', 'utf-8'));
const Songs = JSON.parse(fs.readFileSync('./data/songs.json', 'utf-8'));
const Timeslots = JSON.parse(fs.readFileSync('./data/timeslots.json', 'utf-8'));

const password = process.env.MONGODB_PASSWORD;
mongoose.connect(`mongodb+srv://hackerflowuser:${password}@cluster0.i0mb71s.mongodb.net/?retryWrites=true&w=majority`, {
})
.then(() => console.log('Connected to MongoDB Atlas...'))
.catch(err => console.error('Could not connect to MongoDB Atlas...', err));

const seedDB = async () => {
   await DJ.deleteMany({});
   await Song.deleteMany({});
   await Timeslot.deleteMany({});

   for (let song of Songs) {
      let newSong = new Song(song);
      await newSong.save();
   }

   for (let dj of DJs) {
      let newDJ = new DJ(dj);
      await newDJ.save();
   }

   for (let timeslot of Timeslots) {
      let newTimeslot = new Timeslot({ slot: timeslot });
      await newTimeslot.save();
   }
};

seedDB().then(() => {
   mongoose.connection.close();
});
 