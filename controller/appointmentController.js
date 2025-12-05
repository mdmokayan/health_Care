const appointment = require('../models/appointment');


class AppointmentController {

    // POST route to book a new appointment
    static bookAppointment = async (req, res) => {
        try {
            const {consultationId , patientId} = req.body;

            const newAppointment = new appointment({
                consultationId,
                patientId
            });

            const response = await newAppointment.save();
            res.status(200).json({message: 'Appointment booked successfully', appointment: response});

        } catch (error) {
            console.error(error);
            res.status(500).json({error: 'Internal booking error'});
        }
    }
}

module.exports = AppointmentController;