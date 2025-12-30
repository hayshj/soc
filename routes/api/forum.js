const express = require('express');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const multer = require('multer');
const sharp = require('sharp');
const router = express.Router();

const ForumPost = require('../../models/ForumPost');
const adminAuth = require('../../middleware/adminAuth');

const uploadDir = path.join(__dirname, '..', '..', 'uploads', 'forum');
fs.mkdirSync(uploadDir, { recursive: true });

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 20 * 1024 * 1024,
        files: 4,
    },
    fileFilter: (req, file, cb) => {
        if (!file.mimetype || !file.mimetype.startsWith('image/')) {
            return cb(new Error('Only image uploads are allowed'));
        }
        return cb(null, true);
    },
});

const selectOutputFormat = (mimeType) => {
    if (mimeType === 'image/png') {
        return { format: 'png', ext: '.png', options: { compressionLevel: 9 } };
    }
    if (mimeType === 'image/webp') {
        return { format: 'webp', ext: '.webp', options: { quality: 80 } };
    }
    if (mimeType === 'image/avif') {
        return { format: 'avif', ext: '.avif', options: { quality: 50 } };
    }
    return { format: 'jpeg', ext: '.jpg', options: { quality: 80 } };
};

router.get('/', (req, res) => {
    ForumPost.find().sort({ createdAt: -1 })
        .then(posts => res.json(posts))
        .catch(() => res.status(500).json({ message: 'Server error' }));
});

router.post('/create', upload.array('photos', 4), async (req, res) => {
    const { name, message } = req.body;
    const files = req.files || [];
    const photoUrls = [];

    try {
        for (const file of files) {
            const { format, ext, options } = selectOutputFormat(file.mimetype);
            const filename = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${ext}`;
            const outputPath = path.join(uploadDir, filename);

            await sharp(file.buffer)
                .rotate()
                .resize({
                    width: 1600,
                    height: 1600,
                    fit: 'inside',
                    withoutEnlargement: true,
                })
                .toFormat(format, options)
                .toFile(outputPath);

            photoUrls.push(`/uploads/forum/${filename}`);
        }

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
