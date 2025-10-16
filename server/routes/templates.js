const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

/**
 * Templates Route - Serve template files from server/templates folder
 */

/**
 * GET /api/templates
 * Get list of available template files
 */
router.get('/', async (req, res) => {
  try {
    const templatesDir = path.join(__dirname, '..', 'templates');
    const files = await fs.readdir(templatesDir);
    
    // Group files by theme
    const templates = {};
    
    files.forEach(file => {
      if (file.endsWith('.pdf')) {
        const match = file.match(/John_Doe_(.+)Theme_CV\.pdf/);
        if (match) {
          const theme = match[1].toLowerCase();
          if (!templates[theme]) {
            templates[theme] = {
              name: `John Doe ${match[1]} Theme`,
              theme: theme,
              pdfPath: file,
              yamlPath: file.replace('.pdf', '.yaml')
            };
          }
        }
      }
    });
    
    res.status(200).json({
      success: true,
      templates: Object.values(templates)
    });
  } catch (error) {
    console.error('[Templates] Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to load templates'
    });
  }
});

/**
 * GET /api/templates/:filename
 * Serve a specific template file
 */
router.get('/:filename', async (req, res) => {
  try {
    const { filename } = req.params;
    const templatesDir = path.join(__dirname, '..', 'templates');
    const filePath = path.join(templatesDir, filename);
    
    // Security: Prevent directory traversal
    if (!filePath.startsWith(templatesDir)) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }
    
    // Check if file exists
    await fs.access(filePath);
    
    // Set appropriate content type
    if (filename.endsWith('.pdf')) {
      res.setHeader('Content-Type', 'application/pdf');
    } else if (filename.endsWith('.yaml') || filename.endsWith('.yml')) {
      res.setHeader('Content-Type', 'text/yaml');
    }
    
    res.sendFile(filePath);
  } catch (error) {
    console.error('[Templates] File error:', error);
    res.status(404).json({
      success: false,
      error: 'Template file not found'
    });
  }
});

module.exports = router;
