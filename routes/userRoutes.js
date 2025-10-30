const express = require('express')
const userRouter = express.Router()
const User = require('./../models/user')
const { jwtAuthMiddleware, generateToken } = require('../jwt')

//POST route to add signup user
userRouter.post('/signup', async (req, res) => {
    try {
      const data = req.body; //Assuming the request body contains the user data
        // console.log('req Data', data);
      
      //Check if there are already admin user
      const adminUser = await User.findOne({role: 'admin'})
      if (data.role == 'admin') {
        res.status(404).json({massege: 'admin user already exits'});
      }

      // Create a new user document using the mongoose model
      const newUser = new User(data);
  
      // Save the new user to the database
      const response = await newUser.save();
      console.log('data saved');
  
      //generate token
      const payload = {
        id: response.id,
      };
      console.log(JSON.stringify(payload));
  
      const token = generateToken(payload);
      console.log('Token is : ', token);
  
      res.status(200).json({ response: response, token: token });
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: 'Internal signup server error' });
    }
  });

//POST route to add login user
userRouter.post('/login', async (req, res) => {
  try {
    //Extract username and password from request body
    const { aadhaarCardNumber, password } = req.body
    // const data = req.body

    if (!aadhaarCardNumber || !password) {
      return res.status(401).json({ error: 'Please Provide All Fields ' })
    }
    
    //find the user by aadharCardNumber
    const userCard = await User.findOne({ aadhaarCardNumber: aadhaarCardNumber })

    //if user does not exist or passworddoes not match, return error
    if (!userCard) {
      return res.status(401).json({ error: ' aadharCardNumber not exits' })
    }
    if (userCard.password !== password) {
      return res.status(401).json({ error: 'Invalid password' })
    }

    //generate token
    const payload = {
      id: userCard.id,
    }
    const token = generateToken(payload)
    // console.log('Token is : ', token)

    //return token as response
    res.json({ token })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal login server error' })
  }
})

//GET a profile route user
userRouter.get('/profile', jwtAuthMiddleware, async (req, res) => {
  try {
    const userData = req.userJWT //extract the id from the token
    console.log('User data: ', userData)

    const userId = userData.id
    const userGet = await User.findById(userId)

    res.status(200).json({ userGet })
  } catch (error) {
    console.error(error.message)
    res.status(500).json({ msg: 'Internal get profile server error' })
  }
})

//PUT route to add user password
userRouter.put('/profile/password', jwtAuthMiddleware, async (req, res) => {
  try {
    const userPut = req.userJWT //extract the id from the token
    const { currentPassword, newPassword } = req.body //update data for the person

    const responce = await User.findById(userPut)

    if (responce.password !== currentPassword) {
      return res.status(401).json({ error: 'Invalid password' })
    }

    //update user password
    responce.password = newPassword()
    await responce.save()

    console.log('password updated')
    res.status(200).json({ massege: 'password update' })
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Internal put server error' })
  }
})

module.exports = userRouter
