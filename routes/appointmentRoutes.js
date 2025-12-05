const express = require('express');
const appointmentRouter = express.Router();
const AppointmentController = require('../controller/appointmentController');


// Route to book a new appointment
appointmentRouter.post('/book', AppointmentController.bookAppointment);

module.exports = appointmentRouter;