const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'BusinessProfile', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, enum: ['webdev', 'design', 'marketing'], required: true },
  budget: { type: Number, required: true },
  status: { type: String, enum: ['open', 'closed'], default: 'open' }
}, { timestamps: true });

module.exports = mongoose.model('Job', jobSchema);