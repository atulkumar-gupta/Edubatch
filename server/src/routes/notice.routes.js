const router = require('express').Router();
const ctrl = require('../controllers/notice.controller');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.post('/', authorize('admin', 'teacher'), ctrl.createNotice);
router.get('/', ctrl.getNotices);

module.exports = router;