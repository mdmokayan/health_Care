const mongoose = require('mongoose')
const env = require('dotenv')
env.config()

//mongodb connect URL
const mongoURL = process.env.MONGODB_LOCAL_URL

//set up mongodb connection
mongoose.connect(mongoURL)

//get the default connection
//mongoose maintains a default connection object representing the mongoDB connection.
const db = mongoose.connection

//define event listener for database connection
db.on('connected', () => {
  console.log('Connect to mongoDB server')
})


module.exports = db
