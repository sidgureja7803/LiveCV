const jdMatchService = require('../services/jdMatchService');

/**
 * Analyzes how well a resume matches a job description
 */
exports.analyzeJobMatch = async (req, res) => {
  try {
    let resumeContent;
    let jobDescription = req.body.jobDescription;
    
    // Handle file upload
    if (req.file) {
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
      return res.status(400).json({ 
        success: false, 
        message: 'Resume file is required' 
      });
    }
    
    if (!resumeContent || !jobDescription) {
      return res.status(400).json({ 
        success: false, 
        message: 'Both resume content and job description are required' 
      });
    }
    
    // Analyze job match using the service
    const matchResult = await jdMatchService.analyzeJobMatch(resumeContent, jobDescription);
    
    // Return the result
    res.status(200).json({ 
      success: true, 
      data: matchResult 
    });
  } catch (error) {
    console.error('Error analyzing job match:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to analyze job match',
      error: error.message 
    });
  }
};

/**
 * Gets job match history for a user (if we want to store history)
 */
exports.getMatchHistory = async (req, res) => {
  try {
    // This could be implemented to store and retrieve match history
    // For now, return empty array
    res.status(200).json({ 
      success: true, 
      data: [] 
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