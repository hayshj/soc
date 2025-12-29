const express = require('express');
const router = express.Router();

const Registration = require('../../models/Registration');
const adminAuth = require('../../middleware/adminAuth');

router.get('/', (req, res) => {
    Registration.find()
        .then(events => res.json(events))
        .catch(err => res.status(500).json({ message: 'Server error' }));
});

router.post('/create', async (req, res) => {
    const {
        name,
        preferredName,
        address,
        city,
        state,
        zip,
        phone,
        email,
        role,
        dob,
        medicalHistory,
        emergencyContactName,
        emergencyContactPhone,
        guardianName,
        guardianPhone
    } = req.body;

    try {
        const newRegistration = new Registration({
            name,
            preferredName,
            address,
            city,
            state,
            zip,
            phone,
            email,
            role,
            dob,
            medicalHistory,
            emergencyContactName,
            emergencyContactPhone,
            guardianName,
            guardianPhone
        });

        await newRegistration.save();
        res.status(201).json(newRegistration);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.put('/:id', adminAuth, async (req, res) => {
    const {
        name,
        preferredName,
        address,
        city,
        state,
        zip,
        phone,
        email,
        role,
        dob,
        medicalHistory,
        emergencyContactName,
        emergencyContactPhone,
        guardianName,
        guardianPhone
    } = req.body;

    try {
        const registration = await Registration.findByIdAndUpdate(
            req.params.id,
            {
                name,
                preferredName,
                address,
                city,
                state,
                zip,
                phone,
                email,
                role,
                dob,
                medicalHistory,
                emergencyContactName,
                emergencyContactPhone,
                guardianName,
                guardianPhone
            },
            { new: true, runValidators: true }
        );
        if (!registration) return res.status(404).json({ message: 'Registration not found' });
        res.json(registration);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.delete('/:id', adminAuth, async (req, res) => {
    try {
        const registration = await Registration.findByIdAndDelete(req.params.id);
        if (!registration) return res.status(404).json({ message: 'Registration not found' });
        res.json({ message: 'Registration deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
