const Patient = require('../models/patient')
const { jwtAuthMiddleware, generateToken } = require('../middleware/jwt');


class PatientController {

  //POST route for patient signup
  static signup = async (req, res) => {
    try {
        const data = req.body //Assuming the request body contains the user data

      //Check if there are already user
      const patientUser = await Patient.findOne({ mobile : data.mobile });
      if ( patientUser) {
        return res.status(404).json({massege: ' Patient already exits'});
      }

    // Create a new user document using the mongoose model
    const newPatient = new Patient(data)

    // Save the new user to the database
    const response = await newPatient.save()

    const payload = {
      id: response.id,
      mobile: response.mobile
    }
    // console.log(JSON.stringify(payload))

    const token = generateToken(payload)

    res.status(200).json({ response: response, token: token})
    } catch (error) {
        console.log(error)
    res.status(500).json({ error: 'Internal signup error' })
    }
 }

  //Post route for patient login with otp by mobile number

  // Step 1: Send OTP for login
  static sendOtpLogin = async (req, res) => {
    try {
      const {mobile} = req.body;
      
      if (!mobile) {
        return res.status(400).json({ error: 'Mobile number is required' });
      }
      // Check if doctor exists
      const patientUser = await Patient.findOne({ mobile: mobile });

      if (!patientUser) {
        return res.status(404).json({ error: 'Patient with this mobile not found' });
      }

      // Generate 6 digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000); //100000 + 1*90000 = 190000

      // Save OTP with expiry (2 mins)
      patientUser.otp = otp;
      patientUser[mobile] = { otp, expiresAt: Date.now() + 2 * 60 * 1000 };

      const responce = await patientUser.save();

      console.log(`OTP for ${mobile}: ${otp}`); // In real life send via SMS

      // Generate JWT
      const payload = { 
        id: patientUser.id,
        mobile: patientUser.mobile,
        otp: patientUser.otp
      };
      const token = generateToken(payload);

      res.status(200).json({ message: 'OTP sent successfully', status: true, responce: responce , token:token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal OTP send error' });
    }
  };

  // Step 2: Verify OTP for login
  static verifyOtpLogin = async (req, res) => {
    try {
      const patientPut = req.userJWT;
      const patientId = patientPut.id;

      const { mobile, otp } = req.body; // Extract mobile from JWT and otp from body
      
      if (!mobile || !otp) {
        return res.status(400).json({ error: 'Mobile and OTP are required' });
      }

      // Find doctor by mobile
      const patientOtpVerify = await Patient.findById(patientId); 

      // const record = doctorOtpVerify[mobile];
      if (patientOtpVerify.otp !== otp) {
        return res.status(400).json({ error: 'OTP not found or expired' });
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
        id: patientOtpVerify.id, 
        username: patientOtpVerify.username 
      };
      const token = generateToken(payload);

      // Clear OTP
      // delete otpStore[mobile];

      res.status(200).json({ message: 'Login successful', patientOtpVerify, token,});
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal OTP verify error' });
    }
  };

}

module.exports = PatientController;