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
  genre: genreSchema, // embededd document
  popularity: Number
});

// Compile schema into Song model
module.exports = mongoose.model('Song', songSchema);
