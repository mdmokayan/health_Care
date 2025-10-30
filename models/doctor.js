const mongoose = require('mongoose')

//define the doctor schema
const doctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  profile_img: {
    type: String,
  },
  mobile: {
    type: Number,
  },
  otp: {
    type: Number,
  },
  email: {
    type: String,
  },
  Reg_Num: {
    type: Number,
  },
  doctype: {
    type: String,
    enum: ['Allopathy', 'Homeopathy'],
  },
  specialist_details: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Specialist',
  },
  address: {
    type: String,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
})

const Doctor = mongoose.model('Doctor', doctorSchema)
module.exports = Doctor
