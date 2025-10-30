const express = require('express')
const DoctorController = require('../controller/doctorController');
const doctorRouter = express.Router()
const Doctor = require('./../models/doctor')
const { jwtAuthMiddleware, generateToken } = require('../middleware/jwt');
const multer = require('multer');

//set up multer to store files in /uploads folder
const storage = multer.diskStorage({
  destination: (req, file, cb) =>{
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) =>{
    const suffix = Date.now()
    cb(null, suffix + '-' + file.originalname);
  }
});
const upload = multer({storage});


//POST route for doctor signup
doctorRouter.post('/signup', upload.single('profile_img'), DoctorController.signup);

//POST route for doctor login
doctorRouter.post('/login', DoctorController.login);

//Post route for doctor login with send otp by mobile number
doctorRouter.post('/sendOtp', DoctorController.sendOtpLogin);

//Post route for doctor login with verify otp
doctorRouter.post('/verifyOtp', jwtAuthMiddleware, DoctorController.verifyOtpLogin);

//GET route for fetching doctor profile
doctorRouter.get('/profile/:doctorId', DoctorController.getProfile);

 //GET route for fetching all doctors
doctorRouter.get('/allDoctors', DoctorController.getAllDoctors);

//PUT route for updating doctor password
doctorRouter.put('/passwordUpdate', jwtAuthMiddleware, DoctorController.passwordUpdate);

//PUT route for updating doctor profile
doctorRouter.put('/profile/:id', jwtAuthMiddleware,  DoctorController.updateProfile);

//DELETE route for deleting doctor profile
doctorRouter.delete('/delete/:id', jwtAuthMiddleware, DoctorController.deleteDoctor);

module.exports = doctorRouter
