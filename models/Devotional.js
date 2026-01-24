const mongoose = require('mongoose');

const devotionalSchema = new  mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 80,
    },
    documents: {
        type: [String],
        default: [],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Devotional', devotionalSchema);