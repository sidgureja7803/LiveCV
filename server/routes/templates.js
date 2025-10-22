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
          const themeName = match[1];
          const themeKey = themeName.toLowerCase();
          
          if (!templates[themeKey]) {
            // Map theme names to categories
            const categoryMap = {
              'moderncv': 'modern',
              'classic': 'professional',
              'sb2nov': 'creative',
              'engineeringclassic': 'professional',
              'engineeringresumes': 'modern'
            };
            
            templates[themeKey] = {
              id: themeKey,
              name: themeName.replace(/([A-Z])/g, ' $1').trim(),
              theme: themeKey,
              category: categoryMap[themeKey] || 'modern',
              pdfPath: file,
              yamlPath: file.replace('.pdf', '.yaml'),
              pdfUrl: `/api/templates/${file}`,
              yamlUrl: `/api/templates/${file.replace('.pdf', '.yaml')}`
            };
          }
        }
      }
    });
    
    console.log(`[Templates] Found ${Object.keys(templates).length} templates`);
    
    res.status(200).json({
      success: true,
      count: Object.keys(templates).length,
      templates: Object.values(templates)
    });
  } catch (error) {
    console.error('[Templates] Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to load templates',
      message: error.message
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

/**
 * GET /api/templates/yaml/:theme
 * Get parsed YAML data for a specific template theme
 */
router.get('/yaml/:theme', async (req, res) => {
  try {
    const { theme } = req.params;
    const templatesDir = path.join(__dirname, '..', 'templates');
    
    // Find the YAML file for this theme
    const files = await fs.readdir(templatesDir);
    const yamlFile = files.find(file => 
      file.toLowerCase().includes(theme.toLowerCase()) && file.endsWith('.yaml')
    );
    
    if (!yamlFile) {
      return res.status(404).json({
        success: false,
        error: 'Template YAML not found'
      });
    }
    
    const yamlPath = path.join(templatesDir, yamlFile);
    const yamlContent = await fs.readFile(yamlPath, 'utf8');
    
    // Parse YAML using a simple parser (you may want to install 'yaml' package)
    const yaml = require('yaml');
    const parsedData = yaml.parse(yamlContent);
    
    res.status(200).json({
      success: true,
      theme,
      data: parsedData,
      filename: yamlFile
    });
  } catch (error) {
    console.error('[Templates] YAML parse error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to parse template YAML',
      message: error.message
    });
  }
});

module.exports = router;
