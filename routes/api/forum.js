const express = require('express');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const multer = require('multer');
const router = express.Router();

const ForumPost = require('../../models/ForumPost');
const adminAuth = require('../../middleware/adminAuth');

const uploadDir = path.join(__dirname, '..', '..', 'uploads', 'forum');
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        const safeExt = ext.length <= 5 ? ext : '';
        const uniqueName = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${safeExt}`;
        cb(null, uniqueName);
    },
});

const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024,
        files: 4,
    },
    fileFilter: (req, file, cb) => {
        if (!file.mimetype || !file.mimetype.startsWith('image/')) {
            return cb(new Error('Only image uploads are allowed'));
        }
        return cb(null, true);
    },
});

router.get('/', (req, res) => {
    ForumPost.find().sort({ createdAt: -1 })
        .then(posts => res.json(posts))
        .catch(() => res.status(500).json({ message: 'Server error' }));
});

router.post('/create', upload.array('photos', 4), async (req, res) => {
    const { name, message } = req.body;
    const photoUrls = (req.files || []).map((file) => `/uploads/forum/${file.filename}`);

    try {
        const newPost = new ForumPost({
            name,
            message,
            photos: photoUrls,
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

router.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: err.message });
    }
    if (err && err.message === 'Only image uploads are allowed') {
        return res.status(400).json({ message: err.message });
    }
    return next(err);
});

module.exports = router;
