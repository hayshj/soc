const mongoose = require('mongoose');

const forumPostSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 80,
    },
    message: {
        type: String,
        required: true,
        trim: true,
        maxlength: 2000,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('ForumPost', forumPostSchema);
