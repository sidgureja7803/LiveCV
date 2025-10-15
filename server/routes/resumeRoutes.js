const express = require('express');
const router = express.Router();
const resumeController = require('../controllers/resumeController');
const { verifyToken, getUser } = require('../middleware/auth');

// GET /resume/:id - Get a specific resume by ID
router.get('/:id', getUser, resumeController.getResume);

// GET /resume/template/:templateId - Render the specified resume template
router.get('/template/:templateId', getUser, resumeController.renderTemplate);

// GET /resume/templates/list - Get list of available templates
router.get('/templates/list', resumeController.listTemplates);

// GET /resume/user/all - Get all resumes for the authenticated user
router.get('/user/all', verifyToken, resumeController.getUserResumes);

// POST /resume - Create a new resume
router.post('/', verifyToken, resumeController.createResume);

// PUT /resume/:id - Update an existing resume
router.put('/:id', verifyToken, resumeController.updateResume);

// DELETE /resume/:id - Delete a resume
router.delete('/:id', verifyToken, resumeController.deleteResume);

// POST /resume/:id/upload - Upload a file to a resume
router.post('/:id/upload', verifyToken, resumeController.uploadResumeFile);

// DELETE /resume/:id/file - Delete a file from a resume
router.delete('/:id/file', verifyToken, resumeController.deleteResumeFile);

module.exports = router;
