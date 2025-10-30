const express = require('express');
const PatientController = require('../controller/patientController');
const patientRouter = express.Router();
const { jwtAuthMiddleware, generateToken } = require('../middleware/jwt');


//POST route for patient signup
patientRouter.post('/signup', PatientController.signup);

//Post route for patient login with otp by mobile number
patientRouter.post('/sendOtp', PatientController.sendOtpLogin);

//Post route for patient login with verify otp
patientRouter.post('/verifyOtp', jwtAuthMiddleware, PatientController.verifyOtpLogin);

module.exports = patientRouter;