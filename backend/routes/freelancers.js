const express = require('express');
const router = express.Router();
const FreelancerProfile = require('../models/FreelancerProfile');
const authMiddleware = require('../middleware/auth');

// GET all freelancers (public)
router.get('/', async (req, res) => {
  try {
    const profiles = await FreelancerProfile.find().populate('userId', 'name email');
    res.json(profiles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET single freelancer (public)
router.get('/:id', async (req, res) => {
  try {
    const profile = await FreelancerProfile.findById(req.params.id).populate('userId', 'name email');
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// CREATE profile (protected — freelancer only)
router.post('/', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'freelancer') return res.status(403).json({ message: 'Only freelancers can create a profile' });
    const { bio, skills, hourlyRate, portfolioUrl } = req.body;
    const profile = await FreelancerProfile.create({ userId: req.user.id, bio, skills, hourlyRate, portfolioUrl });
    res.status(201).json(profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// UPDATE profile (protected — owner only)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const profile = await FreelancerProfile.findById(req.params.id);
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    if (profile.userId.toString() !== req.user.id) return res.status(403).json({ message: 'Not authorized' });

    const updated = await FreelancerProfile.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;