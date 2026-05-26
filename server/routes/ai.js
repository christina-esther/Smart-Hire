const router = require('express').Router();
const { protect, authorize } = require('../middleware/auth');
const { getRecommendations } = require('../controllers/aiController');

router.get('/recommendations', protect, authorize('candidate'), getRecommendations);

module.exports = router;
