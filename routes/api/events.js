const express = require('express');
const router = express.Router();

const Event = require('../../models/Event');
const adminAuth = require('../../middleware/adminAuth');

router.get('/', (req, res) => {
    Event.find()
        .then(events => res.json(events))
        .catch(err => res.status(500).json({ message: 'Server error' }));
});

router.post('/create', adminAuth, async (req, res) => {
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

router.put('/:id', adminAuth, async (req, res) => {
    const { title, description, date, location } = req.body;

    try {
        const event = await Event.findByIdAndUpdate(
            req.params.id,
            { title, description, date, location },
            { new: true, runValidators: true }
        );
        if (!event) return res.status(404).json({ message: 'Event not found' });
        res.json(event);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.delete('/:id', adminAuth, async (req, res) => {
    try {
        const event = await Event.findByIdAndDelete(req.params.id);
        if (!event) return res.status(404).json({ message: 'Event not found' });
        res.json({ message: 'Event deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
