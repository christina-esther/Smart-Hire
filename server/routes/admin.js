const router = require('express').Router();
const { protect, authorize } = require('../middleware/auth');
const { getDashboardStats } = require('../controllers/adminController');

router.get('/stats', protect, authorize('admin'), getDashboardStats);

module.exports = router;
