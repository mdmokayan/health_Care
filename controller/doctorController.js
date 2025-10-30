const Doctor = require('../models/doctor')
const { jwtAuthMiddleware, generateToken } = require('../middleware/jwt')
const multer = require('multer')
const fs = require('fs')
const path = require('path')

// Temporary in-memory OTP storage
// const otpStore = {};

class DoctorController {
  //POST route for doctor signup
  static signup = async (req, res) => {
    try {
      const data = req.body //Assuming the request body contains the user data

      //Check if there are already user
      const doctorUser = await Doctor.findOne({
        $or: [
          { username: data.username },
          { mobile: data.mobile },
          { Reg_Num: data.Reg_Num },
        ],
      })
      if (doctorUser) {
        //If image was uploaded but validation failed → delete the image
        if (req.file) {
          fs.unlinkSync(path.join(__dirname, '../uploads/', req.file.filename)) // Delete the uploaded file
        }

        return res.status(409).json({ massege: 'doctor already exits' })
      }

      const photopath = req.file ? req.file.filename : null // Access the uploaded file path
      console.log(req.file)

      const imageUrl = photopath
        ? `${req.protocol}://${req.get('host')}/uploads/${photopath}`
        : null
      // console.log(imageUrl)

      // Create a new user document using the mongoose model
      const newDoctor = new Doctor({ ...data, profile_img: imageUrl })

      // Save the new user to the database
      const response = await newDoctor.save()

      const payload = {
        id: response.id,
        username: response.username,
      }
      // console.log(JSON.stringify(payload))

      const token = generateToken(payload)

      res
        .status(200)
        .json({ response: response, token: token, imageUrl: imageUrl })
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: 'Internal signup error' })
    }
  }

  //POST route for doctor login
  static login = async (req, res) => {
    try {
      const { username, password } = req.body

      if (!username || !password) {
        return res.status(400).json({ error: 'Please Provide All Fields ' })
      }

      const user = await Doctor.findOne({ username: username })

      if (!user) {
        return res.status(404).json({ error: ' username not exits' })
      }
      if (user.password !== password) {
        return res.status(401).json({ error: 'Invalid password' })
      }

      //generate token
      const payload = {
        id: user.id,
        username: user.username,
      }
      const token = generateToken(payload)

      res.status(200).json({ token })
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Internal login server error' })
    }
  }

  //Post route for doctor login with otp by mobile number

  // Step 1: Send OTP for login
  static sendOtpLogin = async (req, res) => {
    try {
      const { mobile } = req.body

      if (!mobile) {
        return res.status(401).json({ error: 'Mobile number is required' })
      }
      // Check if doctor exists
      const doctorUser = await Doctor.findOne({ mobile: mobile })

      if (!doctorUser) {
        return res
          .status(404)
          .json({ error: 'Doctor with this mobile not found' })
      }

      // Generate 6 digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000) //100000 + 1*90000 = 190000

      // Save OTP with expiry (2 mins)
      doctorUser.otp = otp
      doctorUser[mobile] = { otp, expiresAt: Date.now() + 2 * 60 * 1000 }

      const responce = await doctorUser.save()

      console.log(`OTP for ${mobile}: ${otp}`) // In real life send via SMS

      // Generate JWT
      const payload = {
        id: doctorUser.id,
        username: doctorUser.username,
        mobile: doctorUser.mobile,
        otp: doctorUser.otp,
      }
      const token = generateToken(payload)

      res.status(200).json({
        message: 'OTP sent successfully',
        status: true,
        responce: responce,
        token: token,
      })
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'Internal OTP send error' })
    }
  }

  // Step 2: Verify OTP for login
  static verifyOtpLogin = async (req, res) => {
    try {
      const doctorPut = req.userJWT
      const doctorId = doctorPut.id

      const { mobile, otp } = req.body // Extract mobile from JWT and otp from body

      if (!mobile || !otp) {
        return res.status(401).json({ error: 'Mobile and OTP are required' })
      }

      // Find doctor by mobile
      const doctorOtpVerify = await Doctor.findById(doctorId)

      // const record = doctorOtpVerify[mobile];
      if (doctorOtpVerify.otp !== otp) {
        return res.status(404).json({ error: 'OTP not found or expired' })
      }

      // if (doctorOtpVerify.expiresAt < Date.now()) {
      //   delete otpStore[mobile];
      //   return res.status(400).json({ error: 'OTP expired' });
      // }

      // if (parseInt(otp) !== record.otp) {
      //   return res.status(400).json({ error: 'Invalid OTP' });
      // }

      // // OTP verified → fetch doctor
      // const doctor = await Doctor.findOne({ mobile });
      // if (!doctor) {
      //   return res.status(404).json({ error: 'Doctor not found' });
      // }

      // await doctorOtpVerify.save();

      // Generate JWT
      const payload = {
        id: doctorOtpVerify.id,
        username: doctorOtpVerify.username,
      }
      const token = generateToken(payload)

      // Clear OTP
      // delete otpStore[mobile];

      res
        .status(200)
        .json({ message: 'Login successful', doctorOtpVerify, token })
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'Internal OTP verify error' })
    }
  }

  //GET route for fetching doctors profile
  static getProfile = async (req, res) => {
    try {
      // const DoctorData = req.userJWT //extract the id from the token

      const DoctorData = req.params.doctorId //extract the id from the URL parameter
      console.log('Doctor data: ', DoctorData)

      // const DoctorId = DoctorData.id
      const DoctorGet = await Doctor.findById(DoctorData).populate({
        path: 'specialist_details',
        select: '-doctor_details', // 👈 hides doctor_details inside specialist
      })

      if (!DoctorGet) {
        return res.status(404).json({ error: 'Doctor not found' })
      }

      res.status(200).json({ DoctorGet })
    } catch (error) {
      console.error(error.message)
      res.status(500).json({ msg: 'Internal get profile server error' })
    }
  }

  // GET route for fetching all doctors
  static getAllDoctors = async (req, res) => {
    try {
      const data = await Doctor.find().populate({
        path: 'specialist_details',
        select: '-doctor_details', // 👈 hides doctor_details inside specialist
      })
      res.status(200).json(data)
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: 'Internal server error' })
    }
  }

  //PUT route for update password
  static passwordUpdate = async (req, res) => {
    try {
      const userPut = req.userJWT

      const { currentPassword, newPassword } = req.body

      const response = await Doctor.findById(userPut.id)

      if (response.password !== currentPassword) {
        return res.status(401).json({ error: 'Password not matched.' })
      }

      response.password = newPassword
      await response.save()

      console.log('password updated')
      res.status(200).json({ massege: 'password update' })
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: 'Internal put server error' })
    }
  }

  //PUT route for updating doctor profile
  static updateProfile = async (req, res) => {
    try {
      const DoctorId = req.params.id
      const updateDoctorId = req.body

      const response = await Doctor.findByIdAndUpdate(
        DoctorId,
        updateDoctorId,
        {
          new: true,
        }
      )

      if (!response) {
        return res.status(401).json({ error: 'Doctor not found' })
      }

      console.log('data update')
      res.status(200).json(response)
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: 'Internal Put server error ' })
    }
  }

  //DELETE route to add a doctor
  static deleteDoctor = async (req, res) => {
    try {
      const doctorDelete = req.params.doctorID //extract the id from the URL parameter

      const responce = await Doctor.findByIdAndDelete(doctorDelete)

      if (!responce) {
        return res.status(404).json({ error: 'doctor not found' })
      }

      console.log('doctor delete')
      res.status(200).json({ responce })
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: 'Internal delete server error' })
    }
  }
}

module.exports = DoctorController
