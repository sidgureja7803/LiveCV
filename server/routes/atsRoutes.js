const express = require('express');
const router = express.Router();
const atsController = require('../controllers/atsController');
const { verifyToken, getUser } = require('../middleware/auth');

// POST /api/ats/analyze - Run ATS analysis and return score + suggestions
router.post('/analyze', getUser, atsController.calculateATSScore);

// POST / - Legacy endpoint for backward compatibility
router.post('/', getUser, atsController.calculateATSScore);

// GET /api/ats/history/:resumeId - Get ATS analysis history for a resume
router.get('/history/:resumeId', verifyToken, atsController.getATSHistory);

module.exports = router;
