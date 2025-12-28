const express = require('express');
const router = express.Router();
const renderController = require('../controllers/renderController');
const { getUser, verifyToken } = require('../middleware/auth');
const { validateResumeMiddleware, validateThemeMiddleware } = require('../utils/validation');

/**
 * RenderCV PDF Generation Routes
 * Base path: /api/render
 */

// Health check for RenderCV service
router.get('/health', renderController.healthCheck);

// Get cache statistics (admin/debug)
router.get('/cache/stats', renderController.getCacheStatistics);

// Preview PDF for a specific resume (streaming, for iframe preview)
// GET /api/render/:id/preview?theme=classic&bypassCache=false
router.get('/:id/preview', getUser, validateThemeMiddleware, renderController.previewPDF);

// Download PDF for a specific resume
// GET /api/render/:id/download?theme=classic
router.get('/:id/download', getUser, validateThemeMiddleware, renderController.downloadPDF);

// Get YAML representation of resume
// GET /api/render/:id/yaml?theme=classic
router.get('/:id/yaml', getUser, validateThemeMiddleware, renderController.getYAML);

// Generate PDF from raw JSON data (no database lookup)
// POST /api/render/generate
// Body: { resumeData: {...}, theme: 'classic', fileName: 'resume.pdf' }
router.post('/generate', validateResumeMiddleware, validateThemeMiddleware, renderController.generatePDF);

module.exports = router;
