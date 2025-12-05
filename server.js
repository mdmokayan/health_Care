const express = require('express')
const app = express()
const db = require('./config/db')
const path = require('path');

const bodyParser = require('body-parser')
app.use(bodyParser.json()) //req.body

app.get('/', (req, res) => {
  res.send('Welcome to Healthcare')
})

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


const doctorRoute = require('./routes/doctorRoutes')
app.use('/doctor', doctorRoute)

const patientRoute = require('./routes/patientRoutes')
app.use('/patient', patientRoute)

const specialistRoute = require('./routes/specialistRoutes')
app.use('/specialist', specialistRoute)

const consultationRoute = require('./routes/consutationRoutes')
app.use('/consultation', consultationRoute)

const appointmentRoute = require('./routes/appointmentRoutes')
app.use('/appointment', appointmentRoute)

const PORT = process.env.PORT || 2000

app.listen(PORT, () => {
  console.log('Listening on port 2000')
})