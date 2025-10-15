const htmlToText = require('html-to-text');

/**
 * ATS Service - Analyzes resumes for ATS compatibility
 * Uses OpenAI API for advanced analysis
 */
const OpenAI = require('openai');
require('dotenv').config();

// Initialize OpenAI API
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'sk-mock-key-for-development',
});

// Keywords that ATS systems typically look for in resumes
const COMMON_ATS_KEYWORDS = [
  'experience', 'skills', 'education', 'projects', 'achievements',
  'responsibilities', 'summary', 'contact', 'certifications',
  'leadership', 'management', 'teamwork', 'communication'
];

// Common section headings that ATS systems expect
const EXPECTED_SECTIONS = [
  'experience', 'education', 'skills', 'projects', 'certifications',
  'summary', 'objective', 'contact', 'work experience'
];

/**
 * Analyzes a resume for ATS compatibility
 * @param {string} resumeContent - The HTML content of the resume
 * @param {string} templateName - The name of the template used
 * @returns {Object} ATS analysis results
 */
exports.analyzeResume = async (resumeContent, jobDescription = null, templateName = 'default') => {
  try {
    // Extract plain text from HTML
    const plainText = htmlToText.convert(resumeContent, {
      wordwrap: false,
      preserveNewlines: true
    });
    
    // Perform ATS analysis
    let results;
    
    // If OpenAI API key is available, use AI for advanced analysis
    if (process.env.OPENAI_API_KEY) {
      try {
        results = await analyzeWithOpenAI(plainText, jobDescription);
      } catch (aiError) {
        console.error('Error with OpenAI analysis, falling back to basic analysis:', aiError);
        results = performBasicAnalysis(plainText);
      }
    } else {
      // Fall back to basic analysis if no API key
      console.warn('No OpenAI API key found, using basic ATS analysis');
      results = performBasicAnalysis(plainText);
    }
    
    return results;
  } catch (error) {
    console.error('Error analyzing resume:', error);
    throw new Error('Failed to analyze resume for ATS compatibility');
  }
};

/**
 * Analyzes resume using OpenAI GPT API
 * @param {string} resumeText - Plain text resume content
 * @param {string|null} jobDescription - Job description to match against (optional)
 * @returns {Object} ATS analysis results
 */
async function analyzeWithOpenAI(resumeText, jobDescription) {
  try {
    let prompt = `Analyze this resume for ATS compatibility. Provide an overall score (0-100) and specific suggestions for improvement:\n\nRESUME:\n${resumeText}\n`;
    
    if (jobDescription) {
      prompt += `\nJOB DESCRIPTION:\n${jobDescription}\n\nProvide specific feedback on how well the resume matches this job description.`;
    }
    
    const response = await openai.createCompletion({
      model: "text-davinci-003", // or newer model if available
      prompt,
      max_tokens: 1000,
      temperature: 0.3,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
    });
    
    // Parse the AI response
    const analysisText = response.data.choices[0].text.trim();
    
    // Extract score and suggestions using regex
    const scoreMatch = analysisText.match(/score:?\s*(\d+)/i);
    const score = scoreMatch ? parseInt(scoreMatch[1], 10) : 70; // Default to 70 if not found
    
    // Extract suggestions - assume they are separated by newlines or bullet points
    const suggestionLines = analysisText.split(/\n+/).filter(line => 
      (line.trim().startsWith('-') || line.trim().startsWith('•')) &&
      line.length > 10
    );
    
    // Clean up suggestion formatting
    const suggestions = suggestionLines.map(line => 
      line.trim().replace(/^[-•]\s*/, '')
    );
    
    // Extract missing skills if job description was provided
    const missingSkills = [];
    if (jobDescription) {
      const skillsSection = analysisText.match(/missing skills:?\s*(.*?)(?:\n\n|\Z)/is);
      if (skillsSection) {
        const skillsList = skillsSection[1].split(/[,;•-]/).map(s => s.trim()).filter(Boolean);
        missingSkills.push(...skillsList);
      }
    }
    
    return {
      score: Math.min(100, Math.max(0, score)), // Ensure score is between 0-100
      suggestions: suggestions.length > 0 ? suggestions : ["No specific suggestions provided by the AI."],
      missingSkills: missingSkills,
      feedback: suggestions,
      metadata: {
        timestamp: new Date().toISOString(),
        requestId: Math.random().toString(36).substring(2, 15),
        analysis: {
          aiPowered: true,
          wordCount: resumeText.split(/\s+/).length,
          jobDescriptionProvided: !!jobDescription
        }
      }
    };
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw new Error('Failed to analyze resume using AI');
  }
}

/**
 * Performs basic ATS analysis without API
 * @param {string} plainText - Plain text resume content
 * @returns {Object} Basic ATS analysis results
 */
function performBasicAnalysis(plainText) {
  const results = {
    score: 0,
    maxScore: 100,
    suggestions: [],
    feedback: [],
    missingSkills: [],
    analysis: {
      keywordPresence: 0,
      sectionPresence: 0,
      formatting: 0,
      contentQuality: 0
    },
    metadata: {
      timestamp: new Date().toISOString(),
      requestId: Math.random().toString(36).substring(2, 15),
      analysis: {
        aiPowered: false,
        wordCount: plainText.split(/\s+/).length
      }
    }
  };
  
  // Check for keywords
  const keywordResults = analyzeKeywords(plainText);
  results.analysis.keywordPresence = keywordResults.score;
  results.suggestions = [...results.suggestions, ...keywordResults.suggestions];
  results.feedback = [...results.feedback, ...keywordResults.suggestions];
  
  // Check for sections
  const sectionResults = analyzeSections(plainText);
  results.analysis.sectionPresence = sectionResults.score;
  results.suggestions = [...results.suggestions, ...sectionResults.suggestions];
  results.feedback = [...results.feedback, ...sectionResults.suggestions];
  
  // Check formatting
  const formattingResults = analyzeFormatting(plainText);
  results.analysis.formatting = formattingResults.score;
  results.suggestions = [...results.suggestions, ...formattingResults.suggestions];
  results.feedback = [...results.feedback, ...formattingResults.suggestions];
  
  // Check content quality
  const contentResults = analyzeContentQuality(plainText);
  results.analysis.contentQuality = contentResults.score;
  results.suggestions = [...results.suggestions, ...contentResults.suggestions];
  results.feedback = [...results.feedback, ...contentResults.suggestions];
  
  // Calculate overall score (weighted average)
  results.score = Math.round(
    (results.analysis.keywordPresence * 0.3) +
    (results.analysis.sectionPresence * 0.3) +
    (results.analysis.formatting * 0.2) +
    (results.analysis.contentQuality * 0.2)
  );
  
  return results;
};

/**
 * Analyzes keyword presence in the resume
 * @param {string} text - The plain text of the resume
 * @returns {Object} Analysis results
 */
function analyzeKeywords(text) {
  const textLower = text.toLowerCase();
  const foundKeywords = COMMON_ATS_KEYWORDS.filter(keyword => 
    textLower.includes(keyword.toLowerCase())
  );
  
  const score = Math.round((foundKeywords.length / COMMON_ATS_KEYWORDS.length) * 100);
  const suggestions = [];
  
  if (score < 70) {
    suggestions.push('Consider adding more industry-standard section headings to your resume.');
    
    const missingKeywords = COMMON_ATS_KEYWORDS.filter(
      keyword => !foundKeywords.includes(keyword)
    ).slice(0, 3);
    
    if (missingKeywords.length > 0) {
      suggestions.push(`Add these keywords to improve ATS compatibility: ${missingKeywords.join(', ')}.`);
    }
  }
  
  return { score, suggestions };
}

/**
 * Analyzes section presence in the resume
 * @param {string} text - The plain text of the resume
 * @returns {Object} Analysis results
 */
function analyzeSections(text) {
  const textLower = text.toLowerCase();
  const foundSections = EXPECTED_SECTIONS.filter(section => 
    textLower.includes(section.toLowerCase())
  );
  
  const score = Math.round((foundSections.length / EXPECTED_SECTIONS.length) * 100);
  const suggestions = [];
  
  if (score < 70) {
    const missingSections = EXPECTED_SECTIONS.filter(
      section => !foundSections.includes(section)
    ).slice(0, 3);
    
    if (missingSections.length > 0) {
      suggestions.push(`Consider adding these sections to your resume: ${missingSections.join(', ')}.`);
    }
  }
  
  return { score, suggestions };
}

/**
 * Analyzes formatting of the resume
 * @param {string} text - The plain text of the resume
 * @returns {Object} Analysis results
 */
function analyzeFormatting(text) {
  let score = 100;
  const suggestions = [];
  
  // Check for extremely long paragraphs (over 500 characters without breaks)
  const paragraphs = text.split('\n\n');
  const longParagraphs = paragraphs.filter(p => p.length > 500);
  
  if (longParagraphs.length > 0) {
    score -= 20;
    suggestions.push('Break up long paragraphs into shorter, more scannable bullet points.');
  }
  
  // Check for bullet point usage
  const bulletPointCount = (text.match(/•|\*|\-|\–/g) || []).length;
  
  if (bulletPointCount < 5) {
    score -= 20;
    suggestions.push('Use more bullet points to highlight achievements and responsibilities.');
  }
  
  // Check for consistent date formatting
  const dateFormats = [
    /\d{4}-\d{2}/, // YYYY-MM
    /\d{2}\/\d{4}/, // MM/YYYY
    /[A-Z][a-z]+ \d{4}/ // Month YYYY
  ];
  
  let hasConsistentDates = false;
  for (const format of dateFormats) {
    const matches = text.match(new RegExp(format, 'g')) || [];
    if (matches.length >= 2) {
      hasConsistentDates = true;
      break;
    }
  }
  
  if (!hasConsistentDates) {
    score -= 15;
    suggestions.push('Use consistent date formatting throughout your resume (e.g., MM/YYYY or Month YYYY).');
  }
  
  return { score: Math.max(0, score), suggestions };
}

/**
 * Analyzes content quality of the resume
 * @param {string} text - The plain text of the resume
 * @returns {Object} Analysis results
 */
function analyzeContentQuality(text) {
  let score = 100;
  const suggestions = [];
  
  // Check resume length (word count)
  const wordCount = text.split(/\s+/).length;
  
  if (wordCount < 300) {
    score -= 30;
    suggestions.push('Your resume is too short. Aim for 400-600 words for optimal ATS performance.');
  } else if (wordCount > 1000) {
    score -= 20;
    suggestions.push('Your resume is quite long. Consider condensing to 600-800 words for better readability.');
  }
  
  // Check for action verbs
  const actionVerbs = [
    'achieved', 'improved', 'led', 'managed', 'created', 'developed',
    'implemented', 'increased', 'reduced', 'negotiated', 'coordinated'
  ];
  
  const textLower = text.toLowerCase();
  const foundActionVerbs = actionVerbs.filter(verb => textLower.includes(verb));
  
  if (foundActionVerbs.length < 3) {
    score -= 25;
    suggestions.push('Use more action verbs like "achieved," "improved," or "developed" to describe your accomplishments.');
  }
  
  // Check for quantifiable achievements
  const hasNumbers = /\d+%|\d+ percent|\d+\s+percent|increased by \d+|reduced by \d+/.test(textLower);
  
  if (!hasNumbers) {
    score -= 25;
    suggestions.push('Include quantifiable achievements with percentages or numbers to strengthen your resume.');
  }
  
  return { score: Math.max(0, score), suggestions };
}
