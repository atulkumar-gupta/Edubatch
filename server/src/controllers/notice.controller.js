const Notice = require('../models/Notice');
const Enrollment = require('../models/Enrollment');
const Batch = require('../models/Batch');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

exports.createNotice = asyncHandler(async (req, res) => {
  const { batchId, title, body, pinned } = req.body;
  if (batchId && req.user.role === 'teacher') {
    const batch = await Batch.findById(batchId);
    if (batch?.teacher?.toString() !== req.user._id.toString()) {
      throw new ApiError(403, 'Not your batch');
    }
  }
  const notice = await Notice.create({
    batch: batchId || null,
    title, body, pinned: !!pinned,
    createdBy: req.user._id,
  });
  ApiResponse.success(res, notice, 'Notice created', 201);
});

exports.getNotices = asyncHandler(async (req, res) => {
  let filter = {};
  if (req.query.batch) filter.batch = req.query.batch;
  if (req.user.role === 'student') {
    const enrollments = await Enrollment.find({ student: req.user._id, isActive: true });
    const batchIds = enrollments.map(e => e.batch);
    filter.$or = [{ batch: { $in: batchIds } }, { batch: null }];
  }
  const notices = await Notice.find(filter)
    .populate('batch', 'name subject')
    .populate('createdBy', 'name role')
    .sort('-pinned -createdAt');
  ApiResponse.success(res, notices, 'Notices fetched');
});