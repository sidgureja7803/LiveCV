const path = require('path');
const ejs = require('ejs');
const fs = require('fs').promises;
const Resume = require('../models/Resume');
const mongoose = require('mongoose');

// Service imports
const templateService = require('../services/templateService');
const cloudinaryService = require('../services/cloudinaryService');

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
    
    res.status(200).json({
      success: true,
      resumes
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
    
    // Save the data to database
    const resume = await templateService.saveResumeData(resumeData, req.clerkId);
    
    // Return success response
    res.status(201).json({ 
      success: true, 
      message: 'Resume created successfully',
      resume 
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
    
    // Delete resume file from Cloudinary if exists
    if (resume.resumeFile && resume.resumeFile.publicId) {
      try {
        await cloudinaryService.deleteFile(resume.resumeFile.publicId);
        console.log(`Deleted resume file with ID: ${resume.resumeFile.publicId}`);
      } catch (cloudinaryError) {
        console.error('Error deleting file from Cloudinary:', cloudinaryError);
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
    if (resume.resumeFile && resume.resumeFile.publicId) {
      try {
        await cloudinaryService.deleteFile(resume.resumeFile.publicId);
        console.log(`Deleted previous resume file with ID: ${resume.resumeFile.publicId}`);
      } catch (cloudinaryError) {
        console.error('Error deleting previous file from Cloudinary:', cloudinaryError);
        // Continue with upload even if previous file deletion fails
      }
    }
    
    // Upload new file
    try {
      const uploadResult = await cloudinaryService.uploadFile(req, res);
      
      // Update resume with file information
      resume.resumeFile = {
        url: uploadResult.url,
        publicId: uploadResult.publicId,
        originalName: req.file.originalname,
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
      console.error('Error uploading file to Cloudinary:', uploadError);
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
    if (!resume.resumeFile || !resume.resumeFile.publicId) {
      return res.status(400).json({ 
        success: false, 
        message: 'No file associated with this resume' 
      });
    }
    
    // Delete file from Cloudinary
    try {
      await cloudinaryService.deleteFile(resume.resumeFile.publicId);
      
      // Remove file reference from resume
      resume.resumeFile = undefined;
      await resume.save();
      
      res.status(200).json({
        success: true,
        message: 'Resume file deleted successfully'
      });
    } catch (cloudinaryError) {
      console.error('Error deleting file from Cloudinary:', cloudinaryError);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to delete resume file',
        error: cloudinaryError.message 
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
