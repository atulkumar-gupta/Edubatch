const Enrollment = require('../models/Enrollment');
const Batch = require('../models/Batch');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

// Admin: Enroll a student into a batch
exports.enroll = asyncHandler(async (req, res) => {
  const { studentId, batchId } = req.body;

  const batch = await Batch.findById(batchId);
  if (!batch) throw new ApiError(404, 'Batch not found');
  if (batch.status === 'archived') throw new ApiError(400, 'Batch is archived');

  const count = await Enrollment.countDocuments({ batch: batchId, isActive: true });
  if (count >= batch.capacity) throw new ApiError(400, 'Batch is full');

  const existing = await Enrollment.findOne({ student: studentId, batch: batchId });
  if (existing && existing.isActive) throw new ApiError(400, 'Already enrolled');
  if (existing) {
    existing.isActive = true;
    await existing.save();
    return ApiResponse.success(res, existing, 'Re-enrolled successfully');
  }

  const enrollment = await Enrollment.create({ student: studentId, batch: batchId });
  ApiResponse.success(res, enrollment, 'Enrolled successfully', 201);
});

// Student: Get my enrollments
exports.myEnrollments = asyncHandler(async (req, res) => {
  const enrollments = await Enrollment.find({ student: req.user._id, isActive: true })
    .populate('batch')
    .populate('payment');
  ApiResponse.success(res, enrollments, 'My enrollments fetched');
});

// Admin: Remove/deactivate enrollment
exports.removeEnrollment = asyncHandler(async (req, res) => {
  const enrollment = await Enrollment.findByIdAndUpdate(
    req.params.id,
    { isActive: false },
    { new: true }
  );
  if (!enrollment) throw new ApiError(404, 'Enrollment not found');
  ApiResponse.success(res, enrollment, 'Enrollment removed');
});

// Admin/Teacher: Get all enrollments for a batch
exports.batchEnrollments = asyncHandler(async (req, res) => {
  const enrollments = await Enrollment.find({ batch: req.params.batchId, isActive: true })
    .populate('student', 'name email phone')
    .populate('payment');
  ApiResponse.success(res, enrollments, 'Batch enrollments fetched');
});