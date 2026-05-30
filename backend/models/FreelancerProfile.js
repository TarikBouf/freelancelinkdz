const mongoose = require('mongoose');

const freelancerProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  bio: { type: String, default: '' },
  skills: { type: [String], default: [] },
  hourlyRate: { type: Number, default: 0 },
  portfolioUrl: { type: String, default: '' },
  avgRating: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('FreelancerProfile', freelancerProfileSchema);