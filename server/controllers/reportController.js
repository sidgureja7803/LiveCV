const reportService = require('../services/reportService');

/**
 * Generates a PDF report of the ATS and match score analysis
 */
exports.generateReport = async (req, res) => {
  try {
    const { resumeContent, jobDescription, atsScore, matchScore } = req.query;
    
    if (!resumeContent) {
      return res.status(400).json({ 
        success: false, 
        message: 'Resume content is required' 
      });
    }
    
    // Generate the PDF report
    const pdfBuffer = await reportService.generatePDFReport({
      resumeContent,
      jobDescription,
      atsScore: atsScore || null,
      matchScore: matchScore || null
    });
    
    // Set response headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=livecv-report.pdf');
    
    // Send the PDF buffer
    res.send(pdfBuffer);
  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to generate report',
      error: error.message 
    });
  }
};
