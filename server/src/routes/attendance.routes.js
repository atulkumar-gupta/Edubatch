const router = require('express').Router();
const ctrl = require('../controllers/attendance.controller');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.post('/', authorize('admin', 'teacher'), ctrl.markAttendance);
router.get('/batch/:batchId', authorize('admin', 'teacher'), ctrl.batchAttendance);
router.get('/my', authorize('student'), ctrl.myAttendance);

module.exports = router;