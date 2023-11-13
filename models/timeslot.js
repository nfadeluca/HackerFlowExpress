const mongoose = require('mongoose');

const timeslotSchema = new mongoose.Schema({
  slot: String
});

module.exports = mongoose.model('Timeslot', timeslotSchema);
