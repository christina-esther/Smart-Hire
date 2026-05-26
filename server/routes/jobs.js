const router = require('express').Router();
const { protect, authorize } = require('../middleware/auth');
const {
  createJob, getJobs, getJob, updateJob, deleteJob, getRecruiterJobs,
} = require('../controllers/jobController');

router.get('/', getJobs);
router.get('/my-jobs', protect, authorize('recruiter', 'admin'), getRecruiterJobs);
router.get('/:id', getJob);
router.post('/', protect, authorize('recruiter', 'admin'), createJob);
router.put('/:id', protect, authorize('recruiter', 'admin'), updateJob);
router.delete('/:id', protect, authorize('recruiter', 'admin'), deleteJob);

module.exports = router;
