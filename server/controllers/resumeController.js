const path = require('path');
const ejs = require('ejs');
const fs = require('fs').promises;
const Resume = require('../models/Resume');
const mongoose = require('mongoose');

// Service imports
const templateService = require('../services/templateService');
const appwriteService = require('../services/appwriteService');
const resumeLimitService = require('../services/resumeLimitService');
const { APPWRITE_CONFIG } = require('../config/appwrite');

/**
 * Get a specific resume by ID
 */
exports.getResume = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid resume ID format' 
      });
    }
    
    // Find resume in database
    const resume = await Resume.findById(id);
    
    if (!resume) {
      return res.status(404).json({ 
        success: false, 
        message: 'Resume not found' 
      });
    }
    
    // Check if the resume belongs to the authenticated user or is public
    if (req.clerkId && resume.clerkId !== req.clerkId) {
      return res.status(403).json({ 
        success: false, 
        message: 'You do not have permission to view this resume' 
      });
    }
    
    res.status(200).json({ 
      success: true, 
      resume 
    });
  } catch (error) {
    console.error('Error getting resume:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to get resume',
      error: error.message 
    });
  }
};

/**
 * Renders the resume template with current data
 */
exports.renderTemplate = async (req, res) => {
  try {
    // Get template ID from params or use default
    const templateId = req.params.templateId || 'default';
    
    // Get resume ID from query if available
    const resumeId = req.query.resumeId;
    
    let resumeData;
    
    if (resumeId && mongoose.Types.ObjectId.isValid(resumeId)) {
      // Get specific resume by ID
      const resume = await Resume.findById(resumeId);
      
      if (resume && (!req.clerkId || resume.clerkId === req.clerkId)) {
        resumeData = resume.toObject();
      } else {
        return res.status(404).json({
          success: false,
          message: 'Resume not found or access denied'
        });
      }
    } else {
      // Get current resume data for the authenticated user or default
      resumeData = await templateService.getCurrentResumeData(req.clerkId);
    }
    
    // Render the template with the data
    res.render(`templates/${templateId}`, { 
      resumeData,
      title: 'LiveCV Resume Preview'
    });
  } catch (error) {
    console.error('Error rendering template:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to render template',
      error: error.message 
    });
  }
};

/**
 * Get list of available templates
 */
exports.listTemplates = async (req, res) => {
  try {
    const templates = await templateService.getAvailableTemplates();
    
    res.status(200).json({
      success: true,
      templates
    });
  } catch (error) {
    console.error('Error listing templates:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to list templates',
      error: error.message 
    });
  }
};

/**
 * Get all resumes for the authenticated user
 */
exports.getUserResumes = async (req, res) => {
  try {
    const resumes = await templateService.getUserResumes(req.clerkId);
    
    // Get resume count and limit information
    const count = resumes.length;
    const limit = resumeLimitService.RESUME_LIMIT;
    const remaining = Math.max(0, limit - count);
    
    res.status(200).json({
      success: true,
      resumes,
      count,
      limit,
      remaining
    });
  } catch (error) {
    console.error('Error getting user resumes:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to get user resumes',
      error: error.message 
    });
  }
};

/**
 * Create a new resume
 */
exports.createResume = async (req, res) => {
  try {
    const resumeData = req.body;
    
    if (!resumeData) {
      return res.status(400).json({ 
        success: false, 
        message: 'No resume data provided' 
      });
    }
    
    // Enforce resume limit before creating new resume
    let limitInfo;
    try {
      limitInfo = await resumeLimitService.enforceResumeLimit(req.clerkId);
      
      // Log deleted resumes if any
      if (limitInfo.deletedResumes && limitInfo.deletedResumes.length > 0) {
        console.log(`[Resume Creation] Deleted ${limitInfo.deletedResumes.length} resume(s) for user ${req.clerkId}:`);
        limitInfo.deletedResumes.forEach(resume => {
          console.log(`  - ${resume.title} (ID: ${resume.id}, Last updated: ${resume.updatedAt})`);
        });
      }
    } catch (limitError) {
      console.error('[Resume Creation] Error enforcing resume limit:', limitError);
      // Continue with resume creation even if limit enforcement fails
      limitInfo = {
        currentCount: await resumeLimitService.getResumeCount(req.clerkId),
        limit: resumeLimitService.RESUME_LIMIT,
        remaining: 0,
        deletedResumes: []
      };
    }
    
    // Save the data to database
    const resume = await templateService.saveResumeData(resumeData, req.clerkId);
    
    // Return success response with resume count information
    res.status(201).json({ 
      success: true, 
      message: 'Resume created successfully',
      resume,
      resumeLimit: {
        count: limitInfo.currentCount + 1, // Add 1 for the newly created resume
        limit: limitInfo.limit,
        remaining: Math.max(0, limitInfo.remaining - 1),
        deletedResumes: limitInfo.deletedResumes
      }
    });
  } catch (error) {
    console.error('Error creating resume:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to create resume',
      error: error.message 
    });
  }
};

/**
 * Update an existing resume
 */
exports.updateResume = async (req, res) => {
  try {
    const { id } = req.params;
    const resumeData = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid resume ID format' 
      });
    }
    
    if (!resumeData) {
      return res.status(400).json({ 
        success: false, 
        message: 'No resume data provided' 
      });
    }
    
    // Find resume
    const resume = await Resume.findById(id);
    
    if (!resume) {
      return res.status(404).json({ 
        success: false, 
        message: 'Resume not found' 
      });
    }
    
    // Check ownership
    if (resume.clerkId !== req.clerkId) {
      return res.status(403).json({ 
        success: false, 
        message: 'You do not have permission to update this resume' 
      });
    }
    
    // Update resume data
    Object.assign(resume, resumeData);
    resume.updatedAt = Date.now();
    await resume.save();
    
    // Broadcast the update to all connected clients
    req.io.emit('resumeUpdated', {
      resumeId: resume._id,
      lastUpdated: resume.updatedAt
    });
    
    // Return success response
    res.status(200).json({ 
      success: true, 
      message: 'Resume updated successfully',
      resume
    });
  } catch (error) {
    console.error('Error updating resume:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update resume',
      error: error.message 
    });
  }
};

/**
 * Save resume and generate PDF
 * @route PUT /api/resume/:id/save-with-pdf
 */
exports.saveResumeWithPDF = async (req, res) => {
  try {
    const { id } = req.params;
    const resumeData = req.body;
    const { theme } = req.query || {};
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid resume ID format' 
      });
    }
    
    if (!resumeData) {
      return res.status(400).json({ 
        success: false, 
        message: 'No resume data provided' 
      });
    }
    
    // Find resume
    const resume = await Resume.findById(id);
    
    if (!resume) {
      return res.status(404).json({ 
        success: false, 
        message: 'Resume not found' 
      });
    }
    
    // Check ownership
    if (resume.clerkId !== req.clerkId) {
      return res.status(403).json({ 
        success: false, 
        message: 'You do not have permission to update this resume' 
      });
    }
    
    // Update resume data
    Object.assign(resume, resumeData);
    resume.updatedAt = Date.now();
    await resume.save();
    
    // Check if rendercvService is available
    const { mapJsonToRenderCVYaml, validateRenderCVYaml } = require('../utils/jsonToYamlMapper');
    const { renderResume, isRenderCVInstalled } = require('../services/rendercvService');
    
    // First check if RenderCV is installed
    const renderCVAvailable = await isRenderCVInstalled();
    if (!renderCVAvailable) {
      return res.status(503).json({
        success: false,
        message: 'PDF generation is currently unavailable (RenderCV not installed)',
        resume: resume
      });
    }

    // Convert JSON to RenderCV YAML
    const yamlContent = mapJsonToRenderCVYaml(resume, theme || 'classic');
    
    // Validate YAML
    const validation = validateRenderCVYaml(yamlContent);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid YAML structure',
        errors: validation.errors
      });
    }
    
    // Render PDF
    const pdfBuffer = await renderResume(yamlContent, theme || 'classic');
    
    // Upload PDF to Appwrite
    try {
      const fileName = `${resume.personalInfo?.fullName || 'resume'}_${Date.now()}.pdf`;
      
      // Upload to Appwrite storage
      const uploadResult = await appwriteService.uploadPDF(pdfBuffer, fileName, req.clerkId);
      
      // Update resume with file information
      resume.resumeFile = {
        url: uploadResult.url,
        fileId: uploadResult.fileId,
        fileName: uploadResult.fileName,
        fileSize: uploadResult.fileSize,
        fileType: 'application/pdf',
        uploadedAt: new Date()
      };
      
      await resume.save();
      
      // Broadcast the update to all connected clients
      req.io?.emit('resumeUpdated', {
        resumeId: resume._id,
        lastUpdated: resume.updatedAt
      });
      
      // Return success response with resume and PDF URL
      res.status(200).json({ 
        success: true, 
        message: 'Resume updated and PDF generated successfully',
        resume,
        pdf: {
          url: uploadResult.url,
          fileName: uploadResult.fileName,
          fileSize: uploadResult.fileSize
        }
      });
    } catch (uploadError) {
      console.error('Error uploading PDF to Appwrite:', uploadError);
      
      // Still return the updated resume even if PDF upload failed
      res.status(200).json({ 
        success: true, 
        message: 'Resume updated but PDF generation failed',
        resume,
        pdfError: uploadError.message
      });
    }
    
  } catch (error) {
    console.error('Error updating resume with PDF:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update resume with PDF',
      error: error.message 
    });
  }
};

/**
 * Delete a resume
 */
exports.deleteResume = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid resume ID format' 
      });
    }
    
    // Find resume
    const resume = await Resume.findById(id);
    
    if (!resume) {
      return res.status(404).json({ 
        success: false, 
        message: 'Resume not found' 
      });
    }
    
    // Check ownership
    if (resume.clerkId !== req.clerkId) {
      return res.status(403).json({ 
        success: false, 
        message: 'You do not have permission to delete this resume' 
      });
    }
    
    // Delete resume file from Appwrite if exists
    if (resume.resumeFile && resume.resumeFile.fileId) {
      try {
        await appwriteService.deleteFile(APPWRITE_CONFIG.buckets.pdfs, resume.resumeFile.fileId);
        console.log(`Deleted resume file with ID: ${resume.resumeFile.fileId}`);
      } catch (appwriteError) {
        console.error('Error deleting file from Appwrite:', appwriteError);
        // Continue with resume deletion even if file deletion fails
      }
    }
    
    // Delete resume from database
    await Resume.findByIdAndDelete(id);
    
    // Return success response
    res.status(200).json({ 
      success: true, 
      message: 'Resume deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting resume:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to delete resume',
      error: error.message 
    });
  }
};

/**
 * Upload a resume file and associate it with a resume
 */
exports.uploadResumeFile = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid resume ID format' 
      });
    }
    
    // Find resume
    const resume = await Resume.findById(id);
    
    if (!resume) {
      return res.status(404).json({ 
        success: false, 
        message: 'Resume not found' 
      });
    }
    
    // Check ownership
    if (resume.clerkId !== req.clerkId) {
      return res.status(403).json({ 
        success: false, 
        message: 'You do not have permission to upload a file to this resume' 
      });
    }
    
    // Delete previous file if exists
    if (resume.resumeFile && resume.resumeFile.fileId) {
      try {
        await appwriteService.deleteFile(APPWRITE_CONFIG.buckets.pdfs, resume.resumeFile.fileId);
        console.log(`Deleted previous resume file with ID: ${resume.resumeFile.fileId}`);
      } catch (appwriteError) {
        console.error('Error deleting previous file from Appwrite:', appwriteError);
        // Continue with upload even if previous file deletion fails
      }
    }
    
    // Upload new file to Appwrite
    try {
      // Create a file buffer from the uploaded file
      const fileBuffer = req.file.buffer;
      const fileName = req.file.originalname;
      
      // Upload to Appwrite storage
      const uploadResult = await appwriteService.uploadPDF(fileBuffer, fileName, req.clerkId);
      
      // Update resume with file information
      resume.resumeFile = {
        url: uploadResult.url,
        fileId: uploadResult.fileId,
        fileName: uploadResult.fileName,
        fileSize: uploadResult.fileSize,
        fileType: req.file.mimetype,
        uploadedAt: new Date()
      };
      
      await resume.save();
      
      res.status(200).json({
        success: true,
        message: 'Resume file uploaded successfully',
        resumeFile: resume.resumeFile
      });
    } catch (uploadError) {
      console.error('Error uploading file to Appwrite:', uploadError);
      res.status(400).json({ 
        success: false, 
        message: uploadError.message || 'Failed to upload resume file'
      });
    }
  } catch (error) {
    console.error('Error handling resume file upload:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while processing resume file upload',
      error: error.message 
    });
  }
};

/**
 * Generate PDF from raw resume data without saving to database
 * @route POST /api/resume/render-pdf
 */
exports.renderPDFFromData = async (req, res) => {
  try {
    const { resumeData, theme } = req.body;
    
    if (!resumeData) {
      return res.status(400).json({ 
        success: false, 
        message: 'Resume data is required' 
      });
    }
    
    // Check if rendercvService is available
    const { mapJsonToRenderCVYaml, validateRenderCVYaml } = require('../utils/jsonToYamlMapper');
    const { renderResume, isRenderCVInstalled } = require('../services/rendercvService');
    
    // First check if RenderCV is installed
    const renderCVAvailable = await isRenderCVInstalled();
    if (!renderCVAvailable) {
      return res.status(503).json({
        success: false,
        message: 'PDF generation is currently unavailable (RenderCV not installed)'
      });
    }

    // Convert JSON to RenderCV YAML
    const yamlContent = mapJsonToRenderCVYaml(resumeData, theme || 'classic');
    
    // Validate YAML
    const validation = validateRenderCVYaml(yamlContent);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid YAML structure',
        errors: validation.errors
      });
    }
    
    // Render PDF
    const pdfBuffer = await renderResume(yamlContent, theme || 'classic');
    
    // Generate filename
    const fileName = `${resumeData.personalInfo?.fullName || 'Resume'}_${theme || 'classic'}_Preview.pdf`
      .replace(/[^a-zA-Z0-9_-]/g, '_');
    
    // Set headers for PDF streaming
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${fileName}"`);
    res.setHeader('Content-Length', pdfBuffer.length);
    res.setHeader('Cache-Control', 'no-cache');
    
    // Send PDF
    res.send(pdfBuffer);
    
    console.log(`[Render PDF] Generated PDF from raw data in ${theme || 'classic'} theme`);
    
  } catch (error) {
    console.error('Error rendering PDF from data:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to generate PDF',
      error: error.message 
    });
  }
};

/**
 * Delete a resume file but keep the resume record
 */
exports.deleteResumeFile = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid resume ID format' 
      });
    }
    
    // Find resume
    const resume = await Resume.findById(id);
    
    if (!resume) {
      return res.status(404).json({ 
        success: false, 
        message: 'Resume not found' 
      });
    }
    
    // Check ownership
    if (resume.clerkId !== req.clerkId) {
      return res.status(403).json({ 
        success: false, 
        message: 'You do not have permission to delete files for this resume' 
      });
    }
    
    // Check if resume has a file
    if (!resume.resumeFile || !resume.resumeFile.fileId) {
      return res.status(400).json({ 
        success: false, 
        message: 'No file associated with this resume' 
      });
    }
    
    // Delete file from Appwrite
    try {
      await appwriteService.deleteFile(APPWRITE_CONFIG.buckets.pdfs, resume.resumeFile.fileId);
      
      // Remove file reference from resume
      resume.resumeFile = undefined;
      await resume.save();
      
      res.status(200).json({
        success: true,
        message: 'Resume file deleted successfully'
      });
    } catch (appwriteError) {
      console.error('Error deleting file from Appwrite:', appwriteError);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to delete resume file',
        error: appwriteError.message 
      });
    }
  } catch (error) {
    console.error('Error deleting resume file:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while processing resume file deletion',
      error: error.message 
    });
  }
};
