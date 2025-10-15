const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');

// GET /download-report - Generate a PDF of the ATS + match score analysis
router.get('/', reportController.generateReport);

module.exports = router;
