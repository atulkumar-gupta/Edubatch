const Attendance = require('../models/Attendance');
const Batch = require('../models/Batch');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

exports.markAttendance = asyncHandler(async (req, res) => {
  const { batchId, date, records } = req.body;
  const batch = await Batch.findById(batchId);
  if (!batch) throw new ApiError(404, 'Batch not found');
  if (req.user.role === 'teacher' && batch.teacher?.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'Not your batch');
  }
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const attendance = await Attendance.findOneAndUpdate(
    { batch: batchId, date: d },
    { records, markedBy: req.user._id },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
  ApiResponse.success(res, attendance, 'Attendance marked');
});

exports.batchAttendance = asyncHandler(async (req, res) => {
  const records = await Attendance.find({ batch: req.params.batchId })
    .populate('records.student', 'name email')
    .sort('-date');
  ApiResponse.success(res, records, 'Attendance fetched');
});

exports.myAttendance = asyncHandler(async (req, res) => {
  const records = await Attendance.find({ 'records.student': req.user._id })
    .populate('batch', 'name subject');
  let present = 0, absent = 0, late = 0, total = 0;
  const details = records.map(r => {
    const rec = r.records.find(x => x.student.toString() === req.user._id.toString());
    if (!rec) return null;
    total++;
    if (rec.status === 'present') present++;
    else if (rec.status === 'absent') absent++;
    else if (rec.status === 'late') late++;
    return { batch: r.batch, date: r.date, status: rec.status };
  }).filter(Boolean);
  const percentage = total ? ((present + late * 0.5) / total) * 100 : 0;
  ApiResponse.success(res, {
    summary: { total, present, absent, late, percentage: Math.round(percentage * 100) / 100 },
    details,
  }, 'Attendance summary');
});