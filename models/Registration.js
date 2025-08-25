const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    namePreferred: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
    zip: {
        type: String,
        required: true,
        match: /^\d{5}(-\d{4})?$/,
    },
    age: {
        type: Number,
        required: true,
        min: 0,
    },
    dob: {
        type: Date,
        required: true,
    },
    medicalHistory: {
        type: String,
        required: false,
    },
    gaurdianName: {
        type: String,
        required: true,
    },
    gaurdianAddress: {
        type: String,
        required: true,
    },
    gaurdianPhone: {
        type: String,
        required: true,
    },
    gaurdianEmail: {
        type: String,
        required: true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    emergencyContactName: {
        type: String,
        required: true,
    },
    emergencyContactPhone: {
        type: String,
        required: true,
    },
    emergencyContactRelation: {
        type: String,
        required: true,
    },
    registrationDate: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Registration', registrationSchema);