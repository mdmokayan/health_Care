const mongoose = require('mongoose')

const specialistSchema = new mongoose.Schema ({

    specialist_name:{
        type: String 
    },
    status:{
        type: String,
        default: 'active'
    },
    doctor_details: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor'
    }]

})

const Specialist = mongoose.model('Specialist', specialistSchema)
module.exports = Specialist

