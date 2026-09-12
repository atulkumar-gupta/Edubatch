const mongoose = require('mongoose');

const batchSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  subject: { type: String, required: true },
  description: { type: String },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  schedule: {
    days: [{ type: String }],
    startTime: String,
    endTime: String,
  },
  capacity: { type: Number, required: true, min: 1 },
  fee: { type: Number, required: true, min: 0 },
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['upcoming', 'active', 'archived'], default: 'upcoming' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Batch', batchSchema);