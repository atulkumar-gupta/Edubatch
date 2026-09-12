const crypto = require('crypto');
const razorpay = require('../config/razorpay');
const Payment = require('../models/Payment');
const Enrollment = require('../models/Enrollment');
const Batch = require('../models/Batch');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const sendEmail = require('../utils/email');

exports.createOrder = asyncHandler(async (req, res) => {
  const { enrollmentId } = req.body;
  const enrollment = await Enrollment.findById(enrollmentId).populate('batch');
  if (!enrollment) throw new ApiError(404, 'Enrollment not found');
  if (enrollment.paymentStatus === 'paid') throw new ApiError(400, 'Already paid');
  const amount = enrollment.batch.fee * 100;
  const order = await razorpay.orders.create({
    amount,
    currency: 'INR',
    receipt: `rcpt_${enrollment._id.toString().slice(-8)}`,
  });
  const payment = await Payment.create({
    enrollment: enrollment._id,
    student: req.user._id,
    amount,
    razorpayOrderId: order.id,
  });
  ApiResponse.success(res, {
    orderId: order.id,
    amount: order.amount,
    currency: order.currency,
    keyId: process.env.RAZORPAY_KEY_ID,
    paymentId: payment._id,
  }, 'Order created');
});

exports.verifyPayment = asyncHandler(async (req, res) => {
  const { razorpayOrderId, razorpayPaymentId, razorpaySignature, enrollmentId } = req.body;
  const body = razorpayOrderId + '|' + razorpayPaymentId;
  const expected = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest('hex');
  if (expected !== razorpaySignature) {
    await Payment.findOneAndUpdate({ razorpayOrderId }, { status: 'failed' });
    throw new ApiError(400, 'Invalid signature');
  }
  const payment = await Payment.findOneAndUpdate(
    { razorpayOrderId },
    {
      razorpayPaymentId,
      razorpaySignature,
      status: 'paid',
      paidAt: new Date(),
      receiptNumber: `RCPT-${Date.now()}`,
    },
    { new: true }
  );
  const enrollment = await Enrollment.findByIdAndUpdate(
    enrollmentId,
    { paymentStatus: 'paid', payment: payment._id },
    { new: true }
  ).populate('batch').populate('student');
  await sendEmail({
    to: enrollment.student.email,
    subject: 'Payment Receipt - EduBatch',
    html: `<h3>Payment Successful</h3>
      <p>Batch: ${enrollment.batch.name}</p>
      <p>Amount: ₹${payment.amount / 100}</p>
      <p>Receipt: ${payment.receiptNumber}</p>`,
  });
  ApiResponse.success(res, { payment, enrollment }, 'Payment verified');
});

exports.history = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.user.role === 'student') filter.student = req.user._id;
  const payments = await Payment.find(filter)
    .populate('student', 'name email')
    .populate({ path: 'enrollment', populate: { path: 'batch', select: 'name subject' } })
    .sort('-createdAt');
  ApiResponse.success(res, payments, 'Payment history');
});