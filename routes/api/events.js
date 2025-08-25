const express = require('express');
const router = express.Router();

const Event = require('../../models/Event');

router.get('/', (req, res) => {
    Event.find()
        .then(events => res.json(events))
        .catch(err => res.status(500).json({ message: 'Server error' }));
});

router.post('/create', async (req, res) => {
    const { title, description, date, location } = req.body;

    try {
        const newEvent = new Event({
            title,
            description,
            date,
            location
        });

        await newEvent.save();
        res.status(201).json(newEvent);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;