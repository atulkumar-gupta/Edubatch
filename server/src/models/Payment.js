const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  enrollment: { type: mongoose.Schema.Types.ObjectId, ref: 'Enrollment', required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'INR' },
  razorpayOrderId: String,
  razorpayPaymentId: String,
  razorpaySignature: String,
  status: { type: String, enum: ['created', 'paid', 'failed'], default: 'created' },
  paidAt: Date,
  receiptNumber: String,
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);