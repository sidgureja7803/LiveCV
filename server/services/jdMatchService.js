const htmlToText = require('html-to-text');

/**
 * JD Match Service - Analyzes how well a resume matches a job description
 * Uses OpenAI API for advanced analysis when available
 */
const OpenAI = require('openai');
require('dotenv').config();

// Initialize OpenAI API
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'sk-mock-key-for-development',
});

// Common technical skills to look for
const COMMON_SKILLS = [
  // Programming Languages
  'JavaScript', 'Python', 'Java', 'C++', 'C#', 'TypeScript', 'PHP', 'Ruby', 'Go', 'Rust',
  'Swift', 'Kotlin', 'Scala', 'R', 'MATLAB', 'SQL', 'HTML', 'CSS',
  
  // Frameworks & Libraries
  'React', 'Angular', 'Vue.js', 'Node.js', 'Express', 'Django', 'Flask', 'Spring', 'Laravel',
  'jQuery', 'Bootstrap', 'Tailwind', 'Next.js', 'Nuxt.js', 'Svelte',
  
  // Databases
  'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'SQLite', 'Oracle', 'Cassandra', 'DynamoDB',
  
  // Cloud & DevOps
  'AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'Jenkins', 'GitLab CI', 'GitHub Actions',
  'Terraform', 'Ansible', 'Chef', 'Puppet',
  
  // Tools & Technologies
  'Git', 'Linux', 'Unix', 'Bash', 'PowerShell', 'Nginx', 'Apache', 'Elasticsearch', 'Kafka',
  'RabbitMQ', 'GraphQL', 'REST API', 'Microservices', 'Agile', 'Scrum', 'Jira', 'Confluence'
];

// Common soft skills and keywords
const SOFT_SKILLS = [
  'leadership', 'teamwork', 'communication', 'problem solving', 'analytical', 'creative',
  'project management', 'time management', 'collaboration', 'mentoring', 'training',
  'presentation', 'documentation', 'research', 'innovation', 'adaptability'
];

/**
 * Analyzes how well a resume matches a job description
 * @param {string} resumeContent - The plain text content of the resume
 * @param {string} jobDescription - The job description text
 * @returns {Object} Job match analysis results
 */
exports.analyzeJobMatch = async (resumeContent, jobDescription) => {
  try {
    // Clean up the text content
    const cleanResumeContent = typeof resumeContent === 'string' ? resumeContent : 
      htmlToText.convert(resumeContent, { wordwrap: false, preserveNewlines: true });
    
    let results;
    
    // If OpenAI API key is available, use AI for advanced analysis
    if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'sk-mock-key-for-development') {
      try {
        results = await analyzeWithOpenAI(cleanResumeContent, jobDescription);
      } catch (aiError) {
        console.error('Error with OpenAI analysis, falling back to basic analysis:', aiError);
        results = performBasicAnalysis(cleanResumeContent, jobDescription);
      }
    } else {
      // Fall back to basic analysis if no API key
      console.warn('No OpenAI API key found, using basic JD match analysis');
      results = performBasicAnalysis(cleanResumeContent, jobDescription);
    }
    
    return results;
  } catch (error) {
    console.error('Error analyzing job match:', error);
    throw new Error('Failed to analyze job match');
  }
};

/**
 * Analyzes job match using OpenAI GPT API
 * @param {string} resumeText - Plain text resume content
 * @param {string} jobDescription - Job description text
 * @returns {Object} Job match analysis results
 */
async function analyzeWithOpenAI(resumeText, jobDescription) {
  try {
    const prompt = `Analyze how well this resume matches the job description. Provide a detailed analysis with:

1. Overall match percentage (0-100)
2. Matched skills (list)
3. Missing skills (list)
4. Matched keywords (list)
5. Missing keywords (list)
6. Specific recommendations for improvement
7. Strengths of the candidate
8. Areas for improvement
9. Section-by-section analysis with scores

RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}

Please provide the analysis in a structured format with clear sections.`;

    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an expert HR analyst and resume reviewer. Analyze resumes against job descriptions and provide detailed, actionable feedback with specific match percentages and recommendations."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 1500,
      temperature: 0.3,
    });

    // Parse the AI response
    const analysisText = response.choices[0].message.content.trim();
    
    // Extract match percentage
    const scoreMatch = analysisText.match(/(?:match|score).*?(\d+)%/i);
    const matchPercentage = scoreMatch ? parseInt(scoreMatch[1], 10) : 75;
    
    // Extract skills (this is a simplified extraction - in production you'd want more sophisticated parsing)
    const matchedSkillsMatch = analysisText.match(/matched skills?:?\s*(.*?)(?:\n\n|missing skills|$)/is);
    const missingSkillsMatch = analysisText.match(/missing skills?:?\s*(.*?)(?:\n\n|matched keywords|$)/is);
    
    const matchedSkills = matchedSkillsMatch ? 
      extractListItems(matchedSkillsMatch[1]) : 
      findMatchedSkills(resumeText, jobDescription);
    
    const missingSkills = missingSkillsMatch ? 
      extractListItems(missingSkillsMatch[1]) : 
      findMissingSkills(resumeText, jobDescription);
    
    // Extract recommendations
    const recommendationsMatch = analysisText.match(/recommendations?:?\s*(.*?)(?:\n\n|strengths|$)/is);
    const recommendations = recommendationsMatch ? 
      extractListItems(recommendationsMatch[1]) : 
      ["Focus on highlighting relevant experience", "Add missing technical skills", "Quantify achievements with metrics"];
    
    return {
      matchPercentage: Math.min(100, Math.max(0, matchPercentage)),
      matchedSkills: matchedSkills.slice(0, 10),
      missingSkills: missingSkills.slice(0, 8),
      matchedKeywords: findMatchedKeywords(resumeText, jobDescription).slice(0, 10),
      missingKeywords: findMissingKeywords(resumeText, jobDescription).slice(0, 8),
      recommendations: recommendations.slice(0, 6),
      strengths: [
        "Strong technical background",
        "Relevant industry experience",
        "Good educational foundation",
        "Demonstrated problem-solving skills"
      ],
      improvements: [
        "Add more specific metrics and achievements",
        "Include missing technical skills",
        "Highlight leadership experience",
        "Add relevant certifications"
      ],
      sectionAnalysis: [
        { name: 'Technical Skills', score: Math.min(100, matchPercentage + 5), feedback: 'Good technical skill alignment' },
        { name: 'Experience Level', score: Math.max(60, matchPercentage - 10), feedback: 'Experience level matches requirements' },
        { name: 'Industry Knowledge', score: matchPercentage, feedback: 'Relevant industry background' },
        { name: 'Education', score: Math.min(95, matchPercentage + 10), feedback: 'Educational background is suitable' }
      ],
      metadata: {
        timestamp: new Date().toISOString(),
        aiPowered: true,
        wordCount: resumeText.split(/\s+/).length
      }
    };
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw new Error('Failed to analyze job match using AI');
  }
}

/**
 * Performs basic job match analysis without AI
 * @param {string} resumeText - Plain text resume content
 * @param {string} jobDescription - Job description text
 * @returns {Object} Basic job match analysis results
 */
function performBasicAnalysis(resumeText, jobDescription) {
  const resumeLower = resumeText.toLowerCase();
  const jobLower = jobDescription.toLowerCase();
  
  // Find matched and missing skills
  const matchedSkills = findMatchedSkills(resumeText, jobDescription);
  const missingSkills = findMissingSkills(resumeText, jobDescription);
  
  // Find matched and missing keywords
  const matchedKeywords = findMatchedKeywords(resumeText, jobDescription);
  const missingKeywords = findMissingKeywords(resumeText, jobDescription);
  
  // Calculate match percentage based on various factors
  const skillsScore = matchedSkills.length > 0 ? (matchedSkills.length / (matchedSkills.length + missingSkills.length)) * 100 : 50;
  const keywordScore = matchedKeywords.length > 0 ? (matchedKeywords.length / (matchedKeywords.length + missingKeywords.length)) * 100 : 50;
  
  // Simple keyword overlap calculation
  const jobWords = jobLower.split(/\s+/).filter(word => word.length > 3);
  const resumeWords = resumeLower.split(/\s+/).filter(word => word.length > 3);
  const commonWords = jobWords.filter(word => resumeWords.includes(word));
  const overlapScore = (commonWords.length / jobWords.length) * 100;
  
  // Weighted average
  const matchPercentage = Math.round((skillsScore * 0.4) + (keywordScore * 0.3) + (overlapScore * 0.3));
  
  return {
    matchPercentage: Math.min(100, Math.max(30, matchPercentage)),
    matchedSkills: matchedSkills.slice(0, 10),
    missingSkills: missingSkills.slice(0, 8),
    matchedKeywords: matchedKeywords.slice(0, 10),
    missingKeywords: missingKeywords.slice(0, 8),
    recommendations: generateRecommendations(matchedSkills, missingSkills, matchPercentage),
    strengths: generateStrengths(matchedSkills, matchedKeywords),
    improvements: generateImprovements(missingSkills, missingKeywords),
    sectionAnalysis: [
      { name: 'Technical Skills', score: Math.min(100, skillsScore), feedback: `Found ${matchedSkills.length} matching technical skills` },
      { name: 'Experience Level', score: Math.max(50, matchPercentage - 10), feedback: 'Experience level assessment based on content analysis' },
      { name: 'Industry Knowledge', score: Math.min(90, overlapScore + 20), feedback: `${Math.round(overlapScore)}% keyword overlap with job description` },
      { name: 'Education', score: resumeLower.includes('degree') || resumeLower.includes('university') ? 85 : 70, feedback: 'Educational background detected' }
    ],
    metadata: {
      timestamp: new Date().toISOString(),
      aiPowered: false,
      wordCount: resumeText.split(/\s+/).length
    }
  };
}

/**
 * Find skills that match between resume and job description
 */
function findMatchedSkills(resumeText, jobDescription) {
  const resumeLower = resumeText.toLowerCase();
  const jobLower = jobDescription.toLowerCase();
  
  return COMMON_SKILLS.filter(skill => 
    resumeLower.includes(skill.toLowerCase()) && jobLower.includes(skill.toLowerCase())
  );
}

/**
 * Find skills mentioned in job description but missing from resume
 */
function findMissingSkills(resumeText, jobDescription) {
  const resumeLower = resumeText.toLowerCase();
  const jobLower = jobDescription.toLowerCase();
  
  return COMMON_SKILLS.filter(skill => 
    jobLower.includes(skill.toLowerCase()) && !resumeLower.includes(skill.toLowerCase())
  );
}

/**
 * Find keywords that match between resume and job description
 */
function findMatchedKeywords(resumeText, jobDescription) {
  const resumeLower = resumeText.toLowerCase();
  const jobLower = jobDescription.toLowerCase();
  
  return SOFT_SKILLS.filter(keyword => 
    resumeLower.includes(keyword.toLowerCase()) && jobLower.includes(keyword.toLowerCase())
  );
}

/**
 * Find keywords mentioned in job description but missing from resume
 */
function findMissingKeywords(resumeText, jobDescription) {
  const resumeLower = resumeText.toLowerCase();
  const jobLower = jobDescription.toLowerCase();
  
  return SOFT_SKILLS.filter(keyword => 
    jobLower.includes(keyword.toLowerCase()) && !resumeLower.includes(keyword.toLowerCase())
  );
}

/**
 * Generate recommendations based on analysis
 */
function generateRecommendations(matchedSkills, missingSkills, matchPercentage) {
  const recommendations = [];
  
  if (missingSkills.length > 0) {
    recommendations.push(`Add these missing skills to your resume: ${missingSkills.slice(0, 3).join(', ')}`);
  }
  
  if (matchPercentage < 70) {
    recommendations.push('Include more keywords from the job description naturally in your resume');
    recommendations.push('Quantify your achievements with specific numbers and metrics');
  }
  
  if (matchedSkills.length > 0) {
    recommendations.push(`Highlight your experience with ${matchedSkills.slice(0, 2).join(' and ')} more prominently`);
  }
  
  recommendations.push('Tailor your professional summary to match the job requirements');
  recommendations.push('Include relevant projects that demonstrate the required skills');
  
  return recommendations;
}

/**
 * Generate strengths based on matched skills and keywords
 */
function generateStrengths(matchedSkills, matchedKeywords) {
  const strengths = [];
  
  if (matchedSkills.length >= 5) {
    strengths.push('Strong technical skill alignment with job requirements');
  }
  
  if (matchedKeywords.length >= 3) {
    strengths.push('Good soft skills match for the role');
  }
  
  strengths.push('Relevant professional background');
  strengths.push('Demonstrates required competencies');
  
  return strengths;
}

/**
 * Generate improvement suggestions
 */
function generateImprovements(missingSkills, missingKeywords) {
  const improvements = [];
  
  if (missingSkills.length > 0) {
    improvements.push(`Consider gaining experience with ${missingSkills.slice(0, 2).join(' and ')}`);
  }
  
  if (missingKeywords.length > 0) {
    improvements.push(`Highlight your ${missingKeywords.slice(0, 2).join(' and ')} experience`);
  }
  
  improvements.push('Add more quantifiable achievements and metrics');
  improvements.push('Include relevant certifications or training');
  
  return improvements;
}

/**
 * Extract list items from AI response text
 */
function extractListItems(text) {
  if (!text) return [];
  
  return text
    .split(/[,\n•\-\*]/)
    .map(item => item.trim())
    .filter(item => item.length > 2 && item.length < 50)
    .slice(0, 10);
}