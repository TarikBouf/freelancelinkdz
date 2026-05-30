const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const BusinessProfile = require('../models/BusinessProfile');
const authMiddleware = require('../middleware/auth');

// GET all jobs (public) — with optional category filter
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.category) filter.category = req.query.category;
    filter.status = 'open';
    const jobs = await Job.find(filter).populate('businessId', 'companyName location').sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET single job (public)
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('businessId', 'companyName location website');
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json(job);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a job (protected — business only)
router.post('/', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'business') return res.status(403).json({ message: 'Only businesses can post jobs' });
    const businessProfile = await BusinessProfile.findOne({ userId: req.user.id });
    if (!businessProfile) return res.status(404).json({ message: 'Create a business profile first' });

    const { title, description, category, budget } = req.body;
    const job = await Job.create({ businessId: businessProfile._id, title, description, category, budget });
    res.status(201).json(job);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE a job (protected — owner only)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('businessId');
    if (!job) return res.status(404).json({ message: 'Job not found' });
    if (job.businessId.userId.toString() !== req.user.id) return res.status(403).json({ message: 'Not authorized' });
    await job.deleteOne();
    res.json({ message: 'Job deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;