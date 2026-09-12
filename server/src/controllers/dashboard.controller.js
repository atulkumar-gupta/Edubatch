const User = require('../models/User');
const Batch = require('../models/Batch');
const Enrollment = require('../models/Enrollment');
const Payment = require('../models/Payment');
const Attendance = require('../models/Attendance');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

exports.adminDashboard = asyncHandler(async (req, res) => {
  const [totalStudents, totalTeachers, activeBatches, revenueAgg, pendingFees] = await Promise.all([
    User.countDocuments({ role: 'student' }),
    User.countDocuments({ role: 'teacher' }),
    Batch.countDocuments({ status: 'active' }),
    Payment.aggregate([{ $match: { status: 'paid' } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
    Enrollment.countDocuments({ paymentStatus: 'pending', isActive: true }),
  ]);
  ApiResponse.success(res, {
    totalStudents,
    totalTeachers,
    activeBatches,
    revenue: (revenueAgg[0]?.total || 0) / 100,
    pendingFees,
  }, 'Admin dashboard');
});

exports.teacherDashboard = asyncHandler(async (req, res) => {
  const batches = await Batch.find({ teacher: req.user._id });
  const batchIds = batches.map(b => b._id);
  const [totalStudents, activeBatches] = await Promise.all([
    Enrollment.countDocuments({ batch: { $in: batchIds }, isActive: true }),
    batches.filter(b => b.status === 'active').length,
  ]);
  ApiResponse.success(res, {
    totalBatches: batches.length,
    activeBatches,
    totalStudents,
    batches,
  }, 'Teacher dashboard');
});

exports.studentDashboard = asyncHandler(async (req, res) => {
  const enrollments = await Enrollment.find({ student: req.user._id, isActive: true })
    .populate('batch');
  const attendance = await Attendance.find({ 'records.student': req.user._id });
  let present = 0, total = 0;
  attendance.forEach(a => {
    const rec = a.records.find(x => x.student.toString() === req.user._id.toString());
    if (rec) { total++; if (rec.status === 'present' || rec.status === 'late') present++; }
  });
  ApiResponse.success(res, {
    totalBatches: enrollments.length,
    pendingFees: enrollments.filter(e => e.paymentStatus === 'pending').length,
    attendancePercentage: total ? Math.round((present / total) * 100) : 0,
    enrollments,
  }, 'Student dashboard');
});