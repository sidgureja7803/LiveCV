const PDFDocument = require('pdfkit');
const htmlToText = require('html-to-text');
const atsService = require('./atsService');
const matchService = require('./matchService');

/**
 * Report Service - Generates PDF reports for resume analysis
 */

/**
 * Generates a PDF report for resume analysis
 * @param {Object} data - The data for the report
 * @param {string} data.resumeContent - The HTML content of the resume
 * @param {string} data.jobDescription - The job description text (optional)
 * @param {Object} data.atsScore - The ATS score data (optional)
 * @param {Object} data.matchScore - The match score data (optional)
 * @returns {Promise<Buffer>} The PDF document as a buffer
 */
exports.generatePDFReport = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { resumeContent, jobDescription, atsScore, matchScore } = data;
      
      // Extract plain text from resume HTML
      const resumeText = resumeContent.startsWith('<') 
        ? htmlToText.convert(resumeContent, { wordwrap: false })
        : resumeContent;
      
      // Calculate scores if not provided
      const atsResults = atsScore || await atsService.analyzeResume(resumeContent);
      const matchResults = jobDescription && !matchScore 
        ? await matchService.calculateMatchScore(resumeContent, jobDescription)
        : matchScore;
      
      // Create a new PDF document
      const doc = new PDFDocument({
        margins: {
          top: 50,
          bottom: 50,
          left: 50,
          right: 50
        },
        info: {
          Title: 'LiveCV Resume Analysis Report',
          Author: 'LiveCV',
          Subject: 'Resume Analysis',
          Keywords: 'resume, ats, job match, analysis'
        }
      });
      
      // Collect the PDF data chunks
      const chunks = [];
      doc.on('data', chunk => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);
      
      // Generate the PDF content
      generatePDFContent(doc, {
        resumeText,
        jobDescription,
        atsResults,
        matchResults
      });
      
      // Finalize the PDF and end the stream
      doc.end();
    } catch (error) {
      console.error('Error generating PDF report:', error);
      reject(error);
    }
  });
};

/**
 * Generates the content for the PDF report
 * @param {PDFDocument} doc - The PDF document
 * @param {Object} data - The data for the report
 */
function generatePDFContent(doc, data) {
  const { resumeText, jobDescription, atsResults, matchResults } = data;
  
  // Add header
  doc.fontSize(24)
     .fillColor('#333333')
     .text('LiveCV Resume Analysis Report', {
       align: 'center'
     });
  
  doc.moveDown(0.5);
  
  // Add date
  doc.fontSize(10)
     .fillColor('#666666')
     .text(`Generated on: ${new Date().toLocaleDateString()}`, {
       align: 'center'
     });
  
  doc.moveDown(2);
  
  // Add ATS Score section
  if (atsResults) {
    addATSScoreSection(doc, atsResults);
  }
  
  // Add Match Score section if job description was provided
  if (jobDescription && matchResults) {
    addMatchScoreSection(doc, matchResults, jobDescription);
  }
  
  // Add Resume Summary section
  addResumeSummarySection(doc, resumeText);
  
  // Add footer
  doc.fontSize(10)
     .fillColor('#666666')
     .text('Powered by LiveCV - Optimize your resume for job success', {
       align: 'center'
     });
}

/**
 * Adds the ATS Score section to the PDF
 * @param {PDFDocument} doc - The PDF document
 * @param {Object} atsResults - The ATS analysis results
 */
function addATSScoreSection(doc, atsResults) {
  // Section header
  doc.fontSize(18)
     .fillColor('#333333')
     .text('ATS Compatibility Score', {
       underline: true
     });
  
  doc.moveDown(0.5);
  
  // Score display
  const scoreColor = getScoreColor(atsResults.score);
  
  doc.fontSize(16)
     .fillColor('#333333')
     .text(`Score: `, {
       continued: true
     })
     .fillColor(scoreColor)
     .text(`${atsResults.score}/${atsResults.maxScore}`, {
       continued: true
     })
     .fillColor('#333333')
     .text(` (${getScoreRating(atsResults.score)})`);
  
  doc.moveDown(1);
  
  // Score breakdown
  doc.fontSize(14)
     .fillColor('#333333')
     .text('Score Breakdown:');
  
  doc.fontSize(12)
     .fillColor('#666666')
     .text(`• Keyword Presence: ${atsResults.analysis.keywordPresence}/100`);
  
  doc.fontSize(12)
     .fillColor('#666666')
     .text(`• Section Presence: ${atsResults.analysis.sectionPresence}/100`);
  
  doc.fontSize(12)
     .fillColor('#666666')
     .text(`• Formatting: ${atsResults.analysis.formatting}/100`);
  
  doc.fontSize(12)
     .fillColor('#666666')
     .text(`• Content Quality: ${atsResults.analysis.contentQuality}/100`);
  
  doc.moveDown(1);
  
  // Suggestions
  doc.fontSize(14)
     .fillColor('#333333')
     .text('Improvement Suggestions:');
  
  if (atsResults.suggestions.length > 0) {
    atsResults.suggestions.forEach((suggestion, index) => {
      doc.fontSize(12)
         .fillColor('#666666')
         .text(`${index + 1}. ${suggestion}`);
    });
  } else {
    doc.fontSize(12)
       .fillColor('#666666')
       .text('No suggestions - your resume is well-optimized for ATS systems!');
  }
  
  doc.moveDown(2);
}

/**
 * Adds the Match Score section to the PDF
 * @param {PDFDocument} doc - The PDF document
 * @param {Object} matchResults - The match analysis results
 * @param {string} jobDescription - The job description text
 */
function addMatchScoreSection(doc, matchResults, jobDescription) {
  // Section header
  doc.fontSize(18)
     .fillColor('#333333')
     .text('Job Match Score', {
       underline: true
     });
  
  doc.moveDown(0.5);
  
  // Score display
  const scoreColor = getScoreColor(matchResults.score);
  
  doc.fontSize(16)
     .fillColor('#333333')
     .text(`Score: `, {
       continued: true
     })
     .fillColor(scoreColor)
     .text(`${matchResults.score}%`, {
       continued: true
     })
     .fillColor('#333333')
     .text(` (${getScoreRating(matchResults.score)})`);
  
  doc.moveDown(1);
  
  // Matched keywords
  doc.fontSize(14)
     .fillColor('#333333')
     .text('Matched Keywords:');
  
  if (matchResults.keywordMatches.length > 0) {
    // Group keywords by type
    const keywordsByType = matchResults.keywordMatches.reduce((acc, keyword) => {
      acc[keyword.type] = acc[keyword.type] || [];
      acc[keyword.type].push(keyword.value);
      return acc;
    }, {});
    
    // Display keywords by type
    Object.entries(keywordsByType).forEach(([type, keywords]) => {
      doc.fontSize(12)
         .fillColor('#666666')
         .text(`• ${capitalizeFirstLetter(type)}: ${keywords.join(', ')}`);
    });
  } else {
    doc.fontSize(12)
       .fillColor('#666666')
       .text('No keyword matches found.');
  }
  
  doc.moveDown(1);
  
  // Missed keywords
  doc.fontSize(14)
     .fillColor('#333333')
     .text('Missing Keywords:');
  
  if (matchResults.missedKeywords.length > 0) {
    // Group keywords by type
    const keywordsByType = matchResults.missedKeywords.reduce((acc, keyword) => {
      acc[keyword.type] = acc[keyword.type] || [];
      acc[keyword.type].push(keyword.value);
      return acc;
    }, {});
    
    // Display keywords by type
    Object.entries(keywordsByType).forEach(([type, keywords]) => {
      doc.fontSize(12)
         .fillColor('#666666')
         .text(`• ${capitalizeFirstLetter(type)}: ${keywords.join(', ')}`);
    });
  } else {
    doc.fontSize(12)
       .fillColor('#666666')
       .text('No missing keywords - great job!');
  }
  
  doc.moveDown(1);
  
  // Suggestions
  doc.fontSize(14)
     .fillColor('#333333')
     .text('Suggestions:');
  
  if (matchResults.suggestions.length > 0) {
    matchResults.suggestions.forEach((suggestion, index) => {
      doc.fontSize(12)
         .fillColor('#666666')
         .text(`${index + 1}. ${suggestion}`);
    });
  } else {
    doc.fontSize(12)
       .fillColor('#666666')
       .text('No suggestions - your resume is a great match for this job!');
  }
  
  doc.moveDown(2);
}

/**
 * Adds the Resume Summary section to the PDF
 * @param {PDFDocument} doc - The PDF document
 * @param {string} resumeText - The plain text of the resume
 */
function addResumeSummarySection(doc, resumeText) {
  // Section header
  doc.fontSize(18)
     .fillColor('#333333')
     .text('Resume Summary', {
       underline: true
     });
  
  doc.moveDown(0.5);
  
  // Resume statistics
  const wordCount = resumeText.split(/\s+/).length;
  const sectionCount = estimateSectionCount(resumeText);
  const bulletPointCount = (resumeText.match(/•|\*|\-|\–/g) || []).length;
  
  doc.fontSize(12)
     .fillColor('#666666')
     .text(`• Word Count: ${wordCount} words`);
  
  doc.fontSize(12)
     .fillColor('#666666')
     .text(`• Estimated Sections: ${sectionCount}`);
  
  doc.fontSize(12)
     .fillColor('#666666')
     .text(`• Bullet Points: ${bulletPointCount}`);
  
  doc.moveDown(1);
  
  // Resume preview (truncated)
  doc.fontSize(14)
     .fillColor('#333333')
     .text('Resume Preview:');
  
  const previewText = resumeText.length > 500 
    ? resumeText.substring(0, 500) + '...' 
    : resumeText;
  
  doc.fontSize(10)
     .fillColor('#666666')
     .text(previewText, {
       align: 'left',
       paragraphGap: 5
     });
  
  doc.moveDown(2);
}

/**
 * Gets the color for a score based on its value
 * @param {number} score - The score value
 * @returns {string} The color hex code
 */
function getScoreColor(score) {
  if (score >= 80) return '#2e7d32'; // Green
  if (score >= 60) return '#f9a825'; // Amber
  return '#c62828'; // Red
}

/**
 * Gets a rating description for a score
 * @param {number} score - The score value
 * @returns {string} The rating description
 */
function getScoreRating(score) {
  if (score >= 90) return 'Excellent';
  if (score >= 80) return 'Very Good';
  if (score >= 70) return 'Good';
  if (score >= 60) return 'Fair';
  if (score >= 50) return 'Needs Improvement';
  return 'Poor';
}

/**
 * Capitalizes the first letter of a string
 * @param {string} str - The string to capitalize
 * @returns {string} The capitalized string
 */
function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Estimates the number of sections in a resume
 * @param {string} text - The plain text of the resume
 * @returns {number} The estimated number of sections
 */
function estimateSectionCount(text) {
  const commonSectionHeaders = [
    'experience', 'education', 'skills', 'projects', 'certifications',
    'summary', 'objective', 'contact', 'work experience', 'publications',
    'awards', 'achievements', 'interests', 'references', 'volunteer'
  ];
  
  const textLower = text.toLowerCase();
  let count = 0;
  
  commonSectionHeaders.forEach(header => {
    // Look for section headers in various formats
    const patterns = [
      new RegExp(`\\b${header}\\b`, 'i'),
      new RegExp(`\\b${header}:`, 'i'),
      new RegExp(`\\b${header.toUpperCase()}\\b`),
      new RegExp(`\\b${capitalizeFirstLetter(header)}\\b`)
    ];
    
    for (const pattern of patterns) {
      if (pattern.test(textLower)) {
        count++;
        break;
      }
    }
  });
  
  return count;
}
