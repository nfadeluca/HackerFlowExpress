const mongoose = require('mongoose');

const genreSchema = new mongoose.Schema({
  electronic: Boolean,
  lofi: Boolean,
  ambient: Boolean,
  classical: Boolean
});

const songSchema = new mongoose.Schema({
  songID: Number,
  title: String,
  album: String,
  artist: String,
  genre: genreSchema,
  popularity: Number
});

module.exports = mongoose.model('Song', songSchema);
