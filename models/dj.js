const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventSchema = new Schema({
  dj: String,
  time: String,
  songs: [String]
}, { _id: false });

const djSchema = new Schema({
  djID: Number,
  name: String,
  songs: [Number],
  events: [Schema.Types.Mixed]
});

module.exports = mongoose.model('DJ', djSchema);
