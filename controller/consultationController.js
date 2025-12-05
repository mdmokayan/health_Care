const Consultation = require('../models/consultation');


class ConsultationController {

    // POST route to book a new consultation
    static createConsultation = async (req, res) => {
        try {
            const { doctorId, date, time } = req.body;

            // Check if slot already booked
            const exists = await Consultation.findOne({
                doctorId,
                date,
                time
            });

            if (exists) {
                return res.status(403).json({ message: "This time slot is already created" });
            }

            // Create a new consultation document
            const newConsultation = new Consultation({
                doctorId,
                date,
                time,
            });
            const response = await newConsultation.save();

            res.status(200).json({ message: 'Consultation booking successfully', consultation: response });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal consultation error' });
        }
    }

    // GET CONSULTATIONS FOR DOCTOR
  static doctorConsultations = async (req, res) => {
    try {
      const consultationData = req.params.consultationId;

      const consultationsGet = await Consultation.findById(consultationData).populate({ path: 'doctorId' , populate: {path: 'specialist_details' }});
      
      if (!consultationsGet) {
        return res.status(404).json({ error: 'consultation not found' })
      }

      res.status(200).json({consultationsGet});

    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error fetching consultations" });
    }
  };

}

module.exports = ConsultationController;