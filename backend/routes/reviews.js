const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const FreelancerProfile = require('../models/FreelancerProfile');
const BusinessProfile = require('../models/BusinessProfile');
const authMiddleware = require('../middleware/auth');

// Post a review (business only)
router.post('/', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'business') return res.status(403).json({ message: 'Only businesses can leave reviews' });

    const businessProfile = await BusinessProfile.findOne({ userId: req.user.id });
    const { jobId, freelancerId, rating, comment } = req.body;

    const review = await Review.create({ jobId, freelancerId, businessId: businessProfile._id, rating, comment });

    // Update freelancer's average rating
    const allReviews = await Review.find({ freelancerId });
    const avg = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    await FreelancerProfile.findByIdAndUpdate(freelancerId, { avgRating: Math.round(avg * 10) / 10 });

    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get reviews for a freelancer (public)
router.get('/freelancer/:freelancerId', async (req, res) => {
  try {
    const reviews = await Review.find({ freelancerId: req.params.freelancerId })
      .populate('businessId', 'companyName');
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;