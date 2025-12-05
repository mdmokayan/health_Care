const express = require('express');
const consultationRouter = express.Router();
const ConsultationController = require('../controller/consultationController');


// Route to book a new consultation
consultationRouter.post('/slot', ConsultationController.createConsultation);

// Route to get consultations for a doctor
consultationRouter.get('/doctorconsultations/:consultationId', ConsultationController.doctorConsultations);

module.exports = consultationRouter;