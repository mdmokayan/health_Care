const Specialist = require('../models/specialist')

//define the specialist controller class
class SpecialistController {

    //POST route for adding a specialist
    static addSpecialist = async (req, res) => {
        try {
            const data = req.body;

            const newSpecialist = new Specialist(data);

            await newSpecialist.save();

            res.status(200).json({message: 'Specialist added successfully', specialist: newSpecialist});    
        } catch (error) {
            console.error(error.message);
            res.status(500).json({msg: 'Internal add server error'});
            
        }
    }
}

module.exports = SpecialistController