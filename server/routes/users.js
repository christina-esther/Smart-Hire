const router = require('express').Router();
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  updateProfile, uploadResume, saveJob, getSavedJobs, getAllUsers, toggleUserStatus,
} = require('../controllers/userController');

router.put('/profile', protect, updateProfile);
router.post('/resume', protect, upload.single('resume'), uploadResume);
router.post('/save-job/:jobId', protect, authorize('candidate'), saveJob);
router.get('/saved-jobs', protect, authorize('candidate'), getSavedJobs);

// Admin only
router.get('/', protect, authorize('admin'), getAllUsers);
router.patch('/:id/toggle-status', protect, authorize('admin'), toggleUserStatus);

module.exports = router;
