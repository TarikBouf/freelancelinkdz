const express = require('express');
const router = express.Router();
const Proposal = require('../models/Proposal');
const FreelancerProfile = require('../models/FreelancerProfile');
const Job = require('../models/Job');
const authMiddleware = require('../middleware/auth');

// Submit a proposal (freelancer only)
router.post('/', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'freelancer') return res.status(403).json({ message: 'Only freelancers can submit proposals' });

    const freelancerProfile = await FreelancerProfile.findOne({ userId: req.user.id });
    if (!freelancerProfile) return res.status(404).json({ message: 'Create a freelancer profile first' });

    const { jobId, coverLetter, price } = req.body;

    // Prevent duplicate proposals
    const existing = await Proposal.findOne({ jobId, freelancerId: freelancerProfile._id });
    if (existing) return res.status(400).json({ message: 'You already applied to this job' });

    const proposal = await Proposal.create({ jobId, freelancerId: freelancerProfile._id, coverLetter, price });
    res.status(201).json(proposal);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all proposals for a job (business owner only)
router.get('/job/:jobId', authMiddleware, async (req, res) => {
  try {
    const proposals = await Proposal.find({ jobId: req.params.jobId })
      .populate({ path: 'freelancerId', populate: { path: 'userId', select: 'name email' } });
    res.json(proposals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Accept or reject a proposal (business only)
router.put('/:id/status', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'business') return res.status(403).json({ message: 'Only businesses can update proposal status' });

    const { status } = req.body; // 'accepted' or 'rejected'
    const proposal = await Proposal.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!proposal) return res.status(404).json({ message: 'Proposal not found' });

    // If accepted, close the job
    if (status === 'accepted') {
      await Job.findByIdAndUpdate(proposal.jobId, { status: 'closed' });
    }

    res.json(proposal);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;