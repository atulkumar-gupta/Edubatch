const router = require('express').Router();
const ctrl = require('../controllers/enrollment.controller');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.post('/', authorize('admin'), ctrl.enroll);
router.get('/my', authorize('student'), ctrl.myEnrollments);
router.get('/batch/:batchId', authorize('admin', 'teacher'), ctrl.batchEnrollments);
router.delete('/:id', authorize('admin'), ctrl.removeEnrollment);

module.exports = router;