const router = require('express').Router();
const { protect, authorize } = require('../middleware/auth');
const {
  apply, getMyApplications, getJobApplicants, updateApplicationStatus,
} = require('../controllers/applicationController');

router.post('/apply/:jobId', protect, authorize('candidate'), apply);
router.get('/my', protect, authorize('candidate'), getMyApplications);
router.get('/job/:jobId', protect, authorize('recruiter', 'admin'), getJobApplicants);
router.patch('/:id/status', protect, authorize('recruiter', 'admin'), updateApplicationStatus);

module.exports = router;
