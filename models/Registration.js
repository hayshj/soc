const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    preferredName: {
        type: String,
        required: false,
    },
    address: {
        type: String,
        required: false,
    },
    city: {
        type: String,
        required: false,
    },
    state: {
        type: String,
        required: false,
    },
    zip: {
        type: String,
        required: false,
    },
    phone: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    role: {
        type: String,
        required: true,
        enum: ['Youth', 'Mentor'],
    },
    dob: {
        type: Date,
        required: false,
    },
    medicalHistory: {
        type: String,
        required: true,
    },
    emergencyContactName: {
        type: String,
        required: true,
    },
    emergencyContactPhone: {
        type: String,
        required: true,
    },
    guardianName: {
        type: String,
        required: false,
    },
    guardianPhone: {
        type: String,
        required: false,
    },
    registrationDate: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Registration', registrationSchema);
