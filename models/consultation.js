const { text } = require('body-parser');
const mongoose = require('mongoose');

const consultationSchema = new mongoose.Schema({
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor"
  },

  date: {
    type: String
  },

  time: {
    type: String
  },

   purpose: {
    type: String,
    default: "Back Pain"
  }
});

module.exports = mongoose.model('Consultation', consultationSchema);
