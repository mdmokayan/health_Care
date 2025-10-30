const mongoose = require('mongoose')

//define the user schema 
const patientSchema = new mongoose.Schema({
    name: {
        type : String,
    },
    age:{
        type:Number,
    },
    mobile:{
        type: String,
    },
    email:{
        type: String
    },
    address:{
        type: String,
    },
    otp:{
        type: Number,
    }
    // usenamer: {
    //     type: Number,
    //     required: true
    // },
    // password: {
    //     type: String,
    //     required: true
    // },
    
})

const Patient = mongoose.model('Patient', patientSchema)
module.exports = Patient