const router = require('express').Router();
const ctrl = require('../controllers/user.controller');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.put('/profile', ctrl.updateProfile);
router.put('/change-password', ctrl.changePassword);
router.get('/', authorize('admin'), ctrl.listUsers);

module.exports = router;