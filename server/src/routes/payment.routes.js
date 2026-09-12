const router = require('express').Router();
const ctrl = require('../controllers/payment.controller');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.post('/create-order', authorize('student'), ctrl.createOrder);
router.post('/verify', authorize('student'), ctrl.verifyPayment);
router.get('/history', ctrl.history);

module.exports = router;