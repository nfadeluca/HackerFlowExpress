const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventSchema = new Schema({
  dj: String,
  time: String,
  songs: [String]
}, { _id: false }); // Adding _id: false if you don't want MongoDB to add _id field to every event

const djSchema = new Schema({
  djID: Number,
  name: String,
  songs: [Number],
  events: [Schema.Types.Mixed] // This allows for both objects and other types like numbers
});

module.exports = mongoose.model('DJ', djSchema);
