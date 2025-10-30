const express = require('express');
const SpecialistController = require('../controller/specialistController');
const specialistRouter = express.Router();


//POST route for adding a specialist
specialistRouter.post('/add', SpecialistController.addSpecialist);

module.exports = specialistRouter;