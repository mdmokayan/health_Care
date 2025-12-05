const mongoose = require('mongoose');

const bookAppointmentSchema = new mongoose.Schema({

    consultationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Consultation"
    },

    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Patient"
    }

})

module.exports = mongoose.model('BookAppointment', bookAppointmentSchema);