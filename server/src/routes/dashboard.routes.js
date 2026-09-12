const router = require('express').Router();
const ctrl = require('../controllers/dashboard.controller');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.get('/admin', authorize('admin'), ctrl.adminDashboard);
router.get('/teacher', authorize('teacher'), ctrl.teacherDashboard);
router.get('/student', authorize('student'), ctrl.studentDashboard);

module.exports = router;