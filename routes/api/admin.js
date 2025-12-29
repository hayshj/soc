const express = require('express');
const jwt = require('jsonwebtoken');
const Admin = require('../../models/Admin');
const adminAuth = require('../../middleware/adminAuth');
const router = express.Router();

router.post('/login', async (req, res) => {
  const { username, password } = req.body || {};

  if (!username || !password) {
    return res.status(400).json({ error: 'Missing username or password' });
  }

  try {
    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(404).json({ error: 'Admin not found' });

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid password' });

    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ token, admin: { username: admin.username, email: admin.email } });
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
});

router.get('/me', adminAuth, async (req, res) => {
  try {
    const admin = await Admin.findById(req.user.id).select('username email role');
    if (!admin) return res.status(404).json({ error: 'Admin not found' });
    res.json({ admin });
  } catch (err) {
    res.status(500).json({ error: 'Failed to load admin' });
  }
});

module.exports = router;
