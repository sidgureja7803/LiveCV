const express = require('express');
const router = express.Router();
const matchController = require('../controllers/matchController');
const { verifyToken, getUser } = require('../middleware/auth');

// POST /api/match/analyze - Compare resume vs. job description and return a match score
router.post('/analyze', getUser, matchController.calculateMatchScore);

// POST / - Legacy endpoint for backward compatibility
router.post('/', getUser, matchController.calculateMatchScore);

// GET /api/match/history/:resumeId - Get match analysis history for a resume
router.get('/history/:resumeId', verifyToken, matchController.getMatchHistory);

module.exports = router;
