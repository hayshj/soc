const express = require('express');
const router = express.Router();

const ForumPost = require('../../models/ForumPost');
const adminAuth = require('../../middleware/adminAuth');

router.get('/', (req, res) => {
    ForumPost.find().sort({ createdAt: -1 })
        .then(posts => res.json(posts))
        .catch(() => res.status(500).json({ message: 'Server error' }));
});

router.post('/create', async (req, res) => {
    const { name, message } = req.body;

    try {
        const newPost = new ForumPost({
            name,
            message,
        });

        await newPost.save();
        res.status(201).json(newPost);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.delete('/:id', adminAuth, async (req, res) => {
    try {
        const post = await ForumPost.findByIdAndDelete(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });
        res.json({ message: 'Post deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
