const { mapJsonToRenderCVYaml, validateRenderCVYaml } = require('../utils/jsonToYamlMapper');
const { renderResume, getCacheStats, isRenderCVInstalled } = require('../services/rendercvService');
const Resume = require('../models/Resume');
const mongoose = require('mongoose');

/**
 * Preview PDF - generates and streams PDF from resume JSON
 * Endpoint: POST /api/render/:id/preview
 */
exports.previewPDF = async (req, res) => {
  const startTime = Date.now();
  
  try {
    const { id } = req.params;
    const { theme, bypassCache } = req.query;
    
    // Validate resume ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid resume ID format'
      });
    }
    
    // Get resume from database
    const resume = await Resume.findById(id);
    
    if (!resume) {
      return res.status(404).json({
        success: false,
        error: 'Resume not found'
      });
    }
    
    // Check authorization
    if (req.clerkId && resume.clerkId !== req.clerkId) {
      return res.status(403).json({
        success: false,
        error: 'Unauthorized access to resume'
      });
    }
    
    // Convert JSON to RenderCV YAML
    const yamlContent = mapJsonToRenderCVYaml(resume, theme || 'classic');
    
    // Validate YAML
    const validation = validateRenderCVYaml(yamlContent);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        error: 'Invalid YAML structure',
        details: validation.errors
      });
    }
    
    // Render PDF
    const pdfBuffer = await renderResume(yamlContent, theme || 'classic', {
      bypassCache: bypassCache === 'true',
      timeout: 30000
    });
    
    // Set headers for PDF streaming
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${resume.personalInfo?.fullName || 'resume'}_preview.pdf"`);
    res.setHeader('Content-Length', pdfBuffer.length);
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.setHeader('X-Render-Time', `${Date.now() - startTime}ms`);
    
    // Stream PDF
    res.send(pdfBuffer);
    
    console.log(`[Preview] Generated PDF for resume ${id} in ${Date.now() - startTime}ms`);
    
  } catch (error) {
    console.error('[Preview] Error:', error);
    
    res.status(500).json({
      success: false,
      error: 'Failed to generate PDF preview',
      message: error.message,
      renderTime: Date.now() - startTime
    });
  }
};

/**
 * Generate PDF from raw JSON data (no database lookup)
 * Endpoint: POST /api/render/generate
 */
exports.generatePDF = async (req, res) => {
  const startTime = Date.now();
  
  try {
    const { resumeData, theme, fileName } = req.body;
    
    if (!resumeData) {
      return res.status(400).json({
        success: false,
        error: 'Resume data is required'
      });
    }
    
    // Convert JSON to RenderCV YAML
    const yamlContent = mapJsonToRenderCVYaml(resumeData, theme || 'classic');
    
    // Validate YAML
    const validation = validateRenderCVYaml(yamlContent);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        error: 'Invalid YAML structure',
        details: validation.errors
      });
    }
    
    // Render PDF
    const pdfBuffer = await renderResume(yamlContent, theme || 'classic', {
      timeout: 30000
    });
    
    // Set headers
    const pdfFileName = fileName || `${resumeData.personalInfo?.fullName || 'resume'}_CV.pdf`;
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${pdfFileName}"`);
    res.setHeader('Content-Length', pdfBuffer.length);
    res.setHeader('X-Render-Time', `${Date.now() - startTime}ms`);
    
    // Send PDF
    res.send(pdfBuffer);
    
    console.log(`[Generate] Generated PDF in ${Date.now() - startTime}ms`);
    
  } catch (error) {
    console.error('[Generate] Error:', error);
    
    res.status(500).json({
      success: false,
      error: 'Failed to generate PDF',
      message: error.message,
      renderTime: Date.now() - startTime
    });
  }
};

/**
 * Download PDF for a resume
 * Endpoint: GET /api/render/:id/download
 */
exports.downloadPDF = async (req, res) => {
  const startTime = Date.now();
  
  try {
    const { id } = req.params;
    const { theme } = req.query;
    
    // Validate resume ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid resume ID format'
      });
    }
    
    // Get resume from database
    const resume = await Resume.findById(id);
    
    if (!resume) {
      return res.status(404).json({
        success: false,
        error: 'Resume not found'
      });
    }
    
    // Check authorization
    if (req.clerkId && resume.clerkId !== req.clerkId) {
      return res.status(403).json({
        success: false,
        error: 'Unauthorized access to resume'
      });
    }
    
    // Convert JSON to RenderCV YAML
    const yamlContent = mapJsonToRenderCVYaml(resume, theme || 'classic');
    
    // Render PDF
    const pdfBuffer = await renderResume(yamlContent, theme || 'classic');
    
    // Generate filename
    const fileName = `${resume.personalInfo?.fullName || 'Resume'}_${theme || 'classic'}_CV.pdf`
      .replace(/[^a-zA-Z0-9_-]/g, '_');
    
    // Set headers for download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.setHeader('Content-Length', pdfBuffer.length);
    res.setHeader('X-Render-Time', `${Date.now() - startTime}ms`);
    
    // Send PDF
    res.send(pdfBuffer);
    
    console.log(`[Download] Downloaded PDF ${fileName} in ${Date.now() - startTime}ms`);
    
  } catch (error) {
    console.error('[Download] Error:', error);
    
    res.status(500).json({
      success: false,
      error: 'Failed to download PDF',
      message: error.message
    });
  }
};

/**
 * Get YAML representation of resume
 * Endpoint: GET /api/render/:id/yaml
 */
exports.getYAML = async (req, res) => {
  try {
    const { id } = req.params;
    const { theme } = req.query;
    
    // Validate resume ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid resume ID format'
      });
    }
    
    // Get resume from database
    const resume = await Resume.findById(id);
    
    if (!resume) {
      return res.status(404).json({
        success: false,
        error: 'Resume not found'
      });
    }
    
    // Check authorization
    if (req.clerkId && resume.clerkId !== req.clerkId) {
      return res.status(403).json({
        success: false,
        error: 'Unauthorized access to resume'
      });
    }
    
    // Convert JSON to RenderCV YAML
    const yamlContent = mapJsonToRenderCVYaml(resume, theme || 'classic');
    
    // Validate YAML
    const validation = validateRenderCVYaml(yamlContent);
    
    res.status(200).json({
      success: true,
      yaml: yamlContent,
      validation,
      theme: theme || 'classic'
    });
    
  } catch (error) {
    console.error('[YAML] Error:', error);
    
    res.status(500).json({
      success: false,
      error: 'Failed to generate YAML',
      message: error.message
    });
  }
};

/**
 * Get cache statistics
 * Endpoint: GET /api/render/cache/stats
 */
exports.getCacheStatistics = async (req, res) => {
  try {
    const stats = getCacheStats();
    const isInstalled = await isRenderCVInstalled();
    
    res.status(200).json({
      success: true,
      cache: stats,
      rendercv: {
        installed: isInstalled
      }
    });
  } catch (error) {
    console.error('[Cache Stats] Error:', error);
    
    res.status(500).json({
      success: false,
      error: 'Failed to get cache statistics'
    });
  }
};

/**
 * Health check for RenderCV service
 * Endpoint: GET /api/render/health
 */
exports.healthCheck = async (req, res) => {
  try {
    const isInstalled = await isRenderCVInstalled();
    
    if (!isInstalled) {
      return res.status(503).json({
        success: false,
        error: 'RenderCV is not installed',
        message: 'Please install RenderCV using: pip install rendercv'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'RenderCV service is operational',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Health check failed',
      message: error.message
    });
  }
};

module.exports = exports;
