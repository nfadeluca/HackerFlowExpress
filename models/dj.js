const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  dj: String,
  time: String,
  songs: [String]
});

const djSchema = new mongoose.Schema({
  djID: Number,
  name: String,
  songs: [Number],
  events: [eventSchema]
});

module.exports = mongoose.model('DJ', djSchema);
