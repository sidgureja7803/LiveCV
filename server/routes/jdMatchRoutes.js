const express = require('express');
const router = express.Router();
const jdMatchController = require('../controllers/jdMatchController');
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

// POST /api/jd-match/analyze - Analyze job match between resume and job description
router.post('/analyze', getUser, upload.single('resume'), jdMatchController.analyzeJobMatch);

// GET /api/jd-match/history - Get job match history for user (optional feature)
router.get('/history', verifyToken, jdMatchController.getMatchHistory);

module.exports = router;