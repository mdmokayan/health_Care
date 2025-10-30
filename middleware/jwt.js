const jwt = require('jsonwebtoken')
// require('dotenv').config();

const jwtAuthMiddleware = (req, res, next) => {

  // first check requestheaders has authorization or not
  const authorization = req.headers.authorization
  if (!authorization) return res.status(401).json({ error: 'Token not found' })

  //extract the jwt token from the request headers
  const token = req.headers.authorization.split(' ')[1]
  if (!token) return res.status(401).json({ error: 'Unauthorized' })

  try {
    // verify the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    //attach user token information to the request object
    req.userJWT = decoded

    next()
  } catch (err) {
    console.error(err)
    res.status(401).json({ error: 'jwt token error' })
  }
}

//function to generate JWT token
const generateToken = (userData) => {

  //Generate a new JWT token using userData
  return jwt.sign(userData, process.env.JWT_SECRET)
}
module.exports = { jwtAuthMiddleware, generateToken }