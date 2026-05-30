const express = require('express');
const router = express.Router();
const BusinessProfile = require('../models/BusinessProfile');
const authMiddleware = require('../middleware/auth');

// GET all businesses (public)
router.get('/', async (req, res) => {
  try {
    const profiles = await BusinessProfile.find().populate('userId', 'name email');
    res.json(profiles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET my business profile (protected)
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const profile = await BusinessProfile.findOne({ userId: req.user.id });
    if (!profile) return res.status(404).json({ message: 'No business profile found' });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// CREATE business profile (protected)
router.post('/', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'business') return res.status(403).json({ message: 'Only businesses can create a business profile' });
    const { companyName, industry, location, website } = req.body;
    const profile = await BusinessProfile.create({ userId: req.user.id, companyName, industry, location, website });
    res.status(201).json(profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// UPDATE business profile (protected)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const profile = await BusinessProfile.findById(req.params.id);
    if (!profile) return res.status(404).json({ message: 'Not found' });
    if (profile.userId.toString() !== req.user.id) return res.status(403).json({ message: 'Not authorized' });
    const updated = await BusinessProfile.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;