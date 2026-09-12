const Batch = require('../models/Batch');
const Enrollment = require('../models/Enrollment');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

exports.createBatch = asyncHandler(async (req, res) => {
  const batch = await Batch.create({ ...req.body, createdBy: req.user._id });
  ApiResponse.success(res, batch, 'Batch created', 201);
});

exports.getBatches = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  if (req.query.teacher) filter.teacher = req.query.teacher;
  if (req.user.role === 'teacher') filter.teacher = req.user._id;
  const batches = await Batch.find(filter).populate('teacher', 'name email').sort('-createdAt');
  ApiResponse.success(res, batches, 'Batches fetched');
});

exports.getBatch = asyncHandler(async (req, res) => {
  const batch = await Batch.findById(req.params.id).populate('teacher', 'name email');
  if (!batch) throw new ApiError(404, 'Batch not found');
  const enrolledCount = await Enrollment.countDocuments({ batch: batch._id, isActive: true });
  ApiResponse.success(res, { ...batch.toObject(), enrolledCount }, 'Batch fetched');
});

exports.updateBatch = asyncHandler(async (req, res) => {
  const batch = await Batch.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!batch) throw new ApiError(404, 'Batch not found');
  ApiResponse.success(res, batch, 'Batch updated');
});

exports.updateStatus = asyncHandler(async (req, res) => {
  const batch = await Batch.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
  if (!batch) throw new ApiError(404, 'Batch not found');
  ApiResponse.success(res, batch, 'Status updated');
});

exports.archiveBatch = asyncHandler(async (req, res) => {
  const batch = await Batch.findByIdAndUpdate(req.params.id, { status: 'archived' }, { new: true });
  if (!batch) throw new ApiError(404, 'Batch not found');
  ApiResponse.success(res, batch, 'Batch archived');
});