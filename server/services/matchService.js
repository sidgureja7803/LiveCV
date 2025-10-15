const htmlToText = require('html-to-text');

/**
 * Match Service - Compares resume content against job descriptions
 */

/**
 * Calculates match score between resume and job description
 * @param {string} resumeContent - The HTML content of the resume
 * @param {string} jobDescription - The job description text
 * @returns {Object} Match analysis results
 */
exports.calculateMatchScore = async (resumeContent, jobDescription) => {
  try {
    // Extract plain text from HTML if resumeContent is HTML
    const resumeText = resumeContent.startsWith('<') 
      ? htmlToText.convert(resumeContent, { wordwrap: false })
      : resumeContent;
    
    // Perform match analysis
    const results = {
      score: 0,
      keywordMatches: [],
      missedKeywords: [],
      suggestions: []
    };
    
    // Extract keywords from job description
    const jobKeywords = extractKeywords(jobDescription);
    
    // Check for keyword matches in resume
    const { matches, missed } = findKeywordMatches(resumeText, jobKeywords);
    results.keywordMatches = matches;
    results.missedKeywords = missed;
    
    // Calculate match score
    results.score = calculateScore(matches, jobKeywords);
    
    // Generate suggestions
    results.suggestions = generateSuggestions(matches, missed, results.score);
    
    return results;
  } catch (error) {
    console.error('Error calculating match score:', error);
    throw new Error('Failed to calculate match score between resume and job description');
  }
};

/**
 * Extracts important keywords from job description
 * @param {string} jobDescription - The job description text
 * @returns {Array<Object>} Array of keyword objects with type and value
 */
function extractKeywords(jobDescription) {
  const keywords = [];
  const text = jobDescription.toLowerCase();
  
  // Extract technical skills (common programming languages, tools, frameworks)
  const technicalSkills = [
    'javascript', 'python', 'java', 'c++', 'c#', 'ruby', 'php', 'swift',
    'react', 'angular', 'vue', 'node', 'express', 'django', 'flask',
    'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'terraform',
    'sql', 'nosql', 'mongodb', 'postgresql', 'mysql', 'oracle',
    'html', 'css', 'sass', 'less', 'bootstrap', 'tailwind',
    'git', 'jenkins', 'circleci', 'travis', 'jira', 'confluence'
  ];
  
  technicalSkills.forEach(skill => {
    if (text.includes(skill)) {
      keywords.push({ type: 'technical', value: skill });
    }
  });
  
  // Extract soft skills
  const softSkills = [
    'communication', 'teamwork', 'leadership', 'problem-solving',
    'critical thinking', 'time management', 'adaptability', 'creativity',
    'collaboration', 'organization', 'attention to detail', 'project management'
  ];
  
  softSkills.forEach(skill => {
    if (text.includes(skill)) {
      keywords.push({ type: 'soft', value: skill });
    }
  });
  
  // Extract education requirements
  const educationPatterns = [
    /bachelor's degree/i, /master's degree/i, /phd/i, /doctorate/i,
    /bs/i, /ba/i, /ms/i, /ma/i, /mba/i
  ];
  
  educationPatterns.forEach(pattern => {
    const match = text.match(pattern);
    if (match) {
      keywords.push({ type: 'education', value: match[0].toLowerCase() });
    }
  });
  
  // Extract experience requirements
  const experiencePatterns = [
    /(\d+)[\s-]*(year|yr)s?/i,
    /(\d+)\+ (year|yr)s?/i
  ];
  
  experiencePatterns.forEach(pattern => {
    const match = text.match(pattern);
    if (match) {
      keywords.push({ type: 'experience', value: match[0].toLowerCase() });
    }
  });
  
  // Extract certifications
  const certificationPatterns = [
    /certification/i, /certified/i, /certificate/i,
    /aws certified/i, /microsoft certified/i, /google certified/i,
    /pmp/i, /scrum/i, /agile/i, /itil/i, /cissp/i, /cisa/i
  ];
  
  certificationPatterns.forEach(pattern => {
    const match = text.match(pattern);
    if (match) {
      keywords.push({ type: 'certification', value: match[0].toLowerCase() });
    }
  });
  
  // Extract industry-specific keywords
  // This would be expanded based on the specific industry
  const industries = [
    'healthcare', 'finance', 'banking', 'insurance', 'retail',
    'e-commerce', 'manufacturing', 'education', 'government',
    'marketing', 'sales', 'customer service', 'consulting'
  ];
  
  industries.forEach(industry => {
    if (text.includes(industry)) {
      keywords.push({ type: 'industry', value: industry });
    }
  });
  
  return keywords;
}

/**
 * Finds keyword matches between resume and job keywords
 * @param {string} resumeText - The plain text of the resume
 * @param {Array<Object>} jobKeywords - Array of job keywords
 * @returns {Object} Object containing matched and missed keywords
 */
function findKeywordMatches(resumeText, jobKeywords) {
  const resumeTextLower = resumeText.toLowerCase();
  const matches = [];
  const missed = [];
  
  jobKeywords.forEach(keyword => {
    if (resumeTextLower.includes(keyword.value)) {
      matches.push(keyword);
    } else {
      missed.push(keyword);
    }
  });
  
  return { matches, missed };
}

/**
 * Calculates match score based on keyword matches
 * @param {Array<Object>} matches - Array of matched keywords
 * @param {Array<Object>} allKeywords - Array of all job keywords
 * @returns {number} Match score percentage
 */
function calculateScore(matches, allKeywords) {
  if (allKeywords.length === 0) {
    return 0;
  }
  
  // Weight different keyword types
  const weights = {
    technical: 0.4,
    soft: 0.2,
    education: 0.15,
    experience: 0.15,
    certification: 0.05,
    industry: 0.05
  };
  
  // Calculate weighted score
  let totalWeight = 0;
  let weightedMatches = 0;
  
  allKeywords.forEach(keyword => {
    const weight = weights[keyword.type] || 0.1;
    totalWeight += weight;
    
    // Check if this keyword is in the matches
    if (matches.some(match => match.value === keyword.value)) {
      weightedMatches += weight;
    }
  });
  
  // Normalize the score
  const normalizedScore = totalWeight > 0 ? (weightedMatches / totalWeight) * 100 : 0;
  
  // Round to nearest integer
  return Math.round(normalizedScore);
}

/**
 * Generates suggestions based on match analysis
 * @param {Array<Object>} matches - Array of matched keywords
 * @param {Array<Object>} missed - Array of missed keywords
 * @param {number} score - The match score
 * @returns {Array<string>} Array of suggestions
 */
function generateSuggestions(matches, missed, score) {
  const suggestions = [];
  
  // Group missed keywords by type
  const missedByType = missed.reduce((acc, keyword) => {
    acc[keyword.type] = acc[keyword.type] || [];
    acc[keyword.type].push(keyword.value);
    return acc;
  }, {});
  
  // Generate suggestions based on missed keywords
  if (missedByType.technical && missedByType.technical.length > 0) {
    suggestions.push(`Consider adding these technical skills to your resume: ${missedByType.technical.slice(0, 5).join(', ')}.`);
  }
  
  if (missedByType.soft && missedByType.soft.length > 0) {
    suggestions.push(`Highlight these soft skills in your resume: ${missedByType.soft.slice(0, 3).join(', ')}.`);
  }
  
  if (missedByType.education && missedByType.education.length > 0) {
    suggestions.push(`The job requires education credentials: ${missedByType.education.join(', ')}.`);
  }
  
  if (missedByType.experience && missedByType.experience.length > 0) {
    suggestions.push(`The job requires experience: ${missedByType.experience.join(', ')}.`);
  }
  
  if (missedByType.certification && missedByType.certification.length > 0) {
    suggestions.push(`Consider adding these certifications if you have them: ${missedByType.certification.join(', ')}.`);
  }
  
  // General suggestions based on score
  if (score < 30) {
    suggestions.push('Your resume has a low match with this job description. Consider tailoring it specifically for this position.');
  } else if (score < 60) {
    suggestions.push('Your resume has a moderate match. Add more relevant keywords from the job description to improve your chances.');
  } else if (score < 80) {
    suggestions.push('Your resume has a good match. Fine-tune it by addressing the missing keywords mentioned above.');
  } else {
    suggestions.push('Your resume has an excellent match with this job description!');
  }
  
  return suggestions;
}
