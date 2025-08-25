const express = require('express');
const router = express.Router();

const Registration = require('../../models/Registration');

router.get('/', (req, res) => {
    Registration.find()
        .then(events => res.json(events))
        .catch(err => res.status(500).json({ message: 'Server error' }));
});

router.get('/:eventId', (req, res) => {
    const { eventId } = req.params;

    Registration.find({ eventId })
        .then(registrations => res.json(registrations))
        .catch(err => res.status(500).json({ message: 'Server error' }));
});

router.post('/create', async (req, res) => {
    const { eventId, name, namePreferred, address, city, state, zip, age, dob, medicalHistory, gaurdianName, gaurdianAddress, gaurdianPhone, gaurdianEmail, emergencyContactName, emergencyContactPhone, emergencyContactRelation } = req.body;

    try {
        const newRegistration = new Registration({
            eventId,
            name,
            namePreferred,
            address,
            city,
            state,
            zip,
            age,
            dob,
            medicalHistory,
            gaurdianName,
            gaurdianAddress,
            gaurdianPhone,
            gaurdianEmail,
            emergencyContactName,
            emergencyContactPhone,
            emergencyContactRelation
        });

        await newRegistration.save();
        res.status(201).json(newRegistration);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;