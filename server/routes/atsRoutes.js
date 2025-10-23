const express = require('express');
const router = express.Router();
const atsController = require('../controllers/atsController');
const { verifyToken, getUser } = require('../middleware/auth');
const multer = require('multer');

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF and Word documents are allowed.'), false);
    }
  }
});

// POST /api/ats/analyze - Run ATS analysis and return score + suggestions
router.post('/analyze', getUser, upload.single('resume'), atsController.calculateATSScore);

// POST / - Legacy endpoint for backward compatibility
router.post('/', getUser, atsController.calculateATSScore);

// GET /api/ats/history/:resumeId - Get ATS analysis history for a resume
router.get('/history/:resumeId', verifyToken, atsController.getATSHistory);

module.exports = router;
