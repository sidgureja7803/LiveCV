const matchService = require('../services/matchService');
const Resume = require('../models/Resume');
const mongoose = require('mongoose');

/**
 * Calculates match score between resume and job description
 */
exports.calculateMatchScore = async (req, res) => {
  try {
    const { resumeContent, jobDescription, resumeId } = req.body;
    
    if (!resumeContent || !jobDescription) {
      return res.status(400).json({ 
        success: false, 
        message: 'Both resume content and job description are required' 
      });
    }
    
    // Calculate match score using the service
    const matchResult = await matchService.calculateMatchScore(resumeContent, jobDescription);
    
    // If user is logged in and resumeId is provided, save the match result
    if (req.clerkId && resumeId && mongoose.Types.ObjectId.isValid(resumeId)) {
      try {
        // Check if resume exists and belongs to the user
        const resume = await Resume.findById(resumeId);
        if (resume && resume.clerkId === req.clerkId) {
          // Save the match history
          if (!resume.matchHistory) {
            resume.matchHistory = [];
          }
          resume.matchHistory.push({
            date: new Date(),
            jobDescription,
            score: matchResult.score,
            matchedSkills: matchResult.matchedSkills || [],
            missingSkills: matchResult.missingSkills || []
          });
          await resume.save();
        }
      } catch (saveError) {
        console.error('Error saving match history:', saveError);
        // Continue even if saving fails
      }
    }
    
    // Return the result
    res.status(200).json({ 
      success: true, 
      data: matchResult 
    });
  } catch (error) {
    console.error('Error calculating match score:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to calculate match score',
      error: error.message 
    });
  }
};

/**
 * Gets match history for a resume
 */
exports.getMatchHistory = async (req, res) => {
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
        message: 'You do not have permission to view this resume\'s match history' 
      });
    }
    
    // Get match history
    const matchHistory = resume.matchHistory || [];
    
    res.status(200).json({ 
      success: true, 
      data: matchHistory
    });
  } catch (error) {
    console.error('Error getting match history:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to get match history',
      error: error.message 
    });
  }
};
