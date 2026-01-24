const express = require('express');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const multer = require('multer');

const Devotional = require('../../models/Devotional');
const adminAuth = require('../../middleware/adminAuth');

const router = express.Router();

const uploadDir = path.join(__dirname, '..', '..', 'uploads', 'devotionals');
fs.mkdirSync(uploadDir, { recursive: true });

const allowedMimeTypes = new Set([
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
]);

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 25 * 1024 * 1024,
        files: 10,
    },
    fileFilter: (req, file, cb) => {
        if (!allowedMimeTypes.has(file.mimetype)) {
            return cb(new Error('Only document uploads are allowed'));
        }
        return cb(null, true);
    },
});

const buildStoredFilename = (originalName) => {
    const ext = path.extname(originalName).toLowerCase();
    const id = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}`;
    return `${id}${ext || '.bin'}`;
};

const deleteStoredFiles = async (documentUrls) => {
    const deletions = (documentUrls || []).map(async (docUrl) => {
        const filename = path.basename(docUrl);
        const fullPath = path.join(uploadDir, filename);
        try {
            await fs.promises.unlink(fullPath);
        } catch (err) {
            if (err.code !== 'ENOENT') {
                console.error(err);
            }
        }
    });

    await Promise.all(deletions);
};

router.get('/', async (req, res) => {
    try {
        const devotionals = await Devotional.find().sort({ createdAt: -1 });
        res.json(devotionals);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const devotional = await Devotional.findById(req.params.id);
        if (!devotional) return res.status(404).json({ message: 'Devotional not found' });
        res.json(devotional);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/create', adminAuth, upload.array('documents', 10), async (req, res) => {
    const { title } = req.body;
    const files = req.files || [];
    const documentUrls = [];

    try {
        for (const file of files) {
            const filename = buildStoredFilename(file.originalname);
            const outputPath = path.join(uploadDir, filename);
            await fs.promises.writeFile(outputPath, file.buffer);
            documentUrls.push(`/uploads/devotionals/${filename}`);
        }

        const devotional = new Devotional({
            title,
            documents: documentUrls,
        });

        await devotional.save();
        res.status(201).json(devotional);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.put('/:id', adminAuth, upload.array('documents', 10), async (req, res) => {
    const { title } = req.body;
    const files = req.files || [];

    try {
        const devotional = await Devotional.findById(req.params.id);
        if (!devotional) return res.status(404).json({ message: 'Devotional not found' });

        if (typeof title === 'string' && title.trim()) {
            devotional.title = title;
        }

        if (files.length) {
            await deleteStoredFiles(devotional.documents);
            const documentUrls = [];
            for (const file of files) {
                const filename = buildStoredFilename(file.originalname);
                const outputPath = path.join(uploadDir, filename);
                await fs.promises.writeFile(outputPath, file.buffer);
                documentUrls.push(`/uploads/devotionals/${filename}`);
            }
            devotional.documents = documentUrls;
        }

        await devotional.save();
        res.json(devotional);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.delete('/:id', adminAuth, async (req, res) => {
    try {
        const devotional = await Devotional.findByIdAndDelete(req.params.id);
        if (!devotional) return res.status(404).json({ message: 'Devotional not found' });
        await deleteStoredFiles(devotional.documents);
        res.json({ message: 'Devotional deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: err.message });
    }
    if (err && err.message === 'Only document uploads are allowed') {
        return res.status(400).json({ message: err.message });
    }
    return next(err);
});

module.exports = router;
