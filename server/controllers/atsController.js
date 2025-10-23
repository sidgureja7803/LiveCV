const atsService = require('../services/atsService');
const Resume = require('../models/Resume');
const mongoose = require('mongoose');

/**
 * Calculates ATS score for a resume
 */
exports.calculateATSScore = async (req, res) => {
  try {
    let resumeContent;
    let jobDescription = req.body.jobDescription;
    const { templateName, resumeId } = req.body;
    
    // Handle file upload or text content
    if (req.file) {
      // File was uploaded, extract text from it
      const fileBuffer = req.file.buffer;
      const fileName = req.file.originalname.toLowerCase();
      
      if (fileName.endsWith('.pdf')) {
        // Extract text from PDF
        const pdfParse = require('pdf-parse');
        const pdfData = await pdfParse(fileBuffer);
        resumeContent = pdfData.text;
      } else if (fileName.endsWith('.docx') || fileName.endsWith('.doc')) {
        // Extract text from Word document
        const mammoth = require('mammoth');
        const result = await mammoth.extractRawText({ buffer: fileBuffer });
        resumeContent = result.value;
      } else {
        return res.status(400).json({
          success: false,
          message: 'Unsupported file format. Please upload PDF or Word documents.'
        });
      }
    } else {
      // Use text content from request body
      resumeContent = req.body.resumeContent;
    }
    
    if (!resumeContent) {
      return res.status(400).json({ 
        success: false, 
        message: 'Resume content is required' 
      });
    }
    
    // Calculate ATS score using the service (pass job description if available)
    const atsResult = await atsService.analyzeResume(resumeContent, jobDescription, templateName);
    
    // If user is logged in and resumeId is provided, save the analysis result
    if (req.clerkId && resumeId && mongoose.Types.ObjectId.isValid(resumeId)) {
      try {
        // Check if resume exists and belongs to the user
        const resume = await Resume.findById(resumeId);
        if (resume && resume.clerkId === req.clerkId) {
          // Save the ATS analysis history
          if (!resume.atsHistory) {
            resume.atsHistory = [];
          }
          resume.atsHistory.push({
            date: new Date(),
            jobDescription,
            score: atsResult.score,
            suggestions: atsResult.suggestions,
            missingSkills: atsResult.missingSkills || []            
          });
          await resume.save();
        }
      } catch (saveError) {
        console.error('Error saving ATS history:', saveError);
        // Continue even if saving fails
      }
    }
    
    // Return the result
    res.status(200).json({ 
      success: true, 
      data: atsResult 
    });
  } catch (error) {
    console.error('Error calculating ATS score:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to calculate ATS score',
      error: error.message 
    });
  }
};

/**
 * Gets ATS analysis history for a resume
 */
exports.getATSHistory = async (req, res) => {
  try {
    const { resumeId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(resumeId)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid resume ID format' 
      });
    }
    
    // Find resume
    const resume = await Resume.findById(resumeId);
    
    if (!resume) {
      return res.status(404).json({ 
        success: false, 
        message: 'Resume not found' 
      });
    }
    
    // Check if the resume belongs to the authenticated user
    if (resume.clerkId !== req.clerkId) {
      return res.status(403).json({ 
        success: false, 
        message: 'You do not have permission to view this resume\'s ATS history' 
      });
    }
    
    // Get ATS history
    const atsHistory = resume.atsHistory || [];
    
    res.status(200).json({ 
      success: true, 
      data: atsHistory
    });
  } catch (error) {
    console.error('Error getting ATS history:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to get ATS history',
      error: error.message 
    });
  }
};
