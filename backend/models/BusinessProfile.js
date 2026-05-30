const mongoose = require('mongoose');

const businessProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  companyName: { type: String, required: true },
  industry: { type: String, default: '' },
  location: { type: String, default: '' },
  website: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('BusinessProfile', businessProfileSchema);