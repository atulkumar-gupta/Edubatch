const router = require('express').Router();
const ctrl = require('../controllers/batch.controller');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(ctrl.getBatches)
  .post(authorize('admin'), ctrl.createBatch);

router.route('/:id')
  .get(ctrl.getBatch)
  .put(authorize('admin'), ctrl.updateBatch)
  .delete(authorize('admin'), ctrl.archiveBatch);

router.patch('/:id/status', authorize('admin'), ctrl.updateStatus);

module.exports = router;