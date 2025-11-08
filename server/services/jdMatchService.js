const htmlToText = require('html-to-text');

/**
 * JD Match Service - Analyzes how well a resume matches a job description
 * Uses AIML API for advanced analysis when available
 */
const fetch = require('node-fetch');
require('dotenv').config();

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
    
    // If AIML API key is available, use AI for advanced analysis
    if (process.env.AIML_API_KEY) {
      try {
        results = await analyzeWithAIML(cleanResumeContent, jobDescription);
      } catch (aiError) {
        console.error('Error with AIML analysis, falling back to basic analysis:', aiError);
        results = performBasicAnalysis(cleanResumeContent, jobDescription);
      }
    } else {
      // Fall back to basic analysis if no API key
      console.warn('No AIML API key found, using basic JD match analysis');
      results = performBasicAnalysis(cleanResumeContent, jobDescription);
    }
    
    return results;
  } catch (error) {
    console.error('Error analyzing job match:', error);
    throw new Error('Failed to analyze job match');
  }
};

/**
 * Analyzes job match using AIML API
 * @param {string} resumeText - Plain text resume content
 * @param {string} jobDescription - Job description text
 * @returns {Object} Job match analysis results
 */
async function analyzeWithAIML(resumeText, jobDescription) {
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

Please provide the analysis in a structured JSON format with the following structure:
{
  "matchPercentage": number,
  "matchedSkills": [string],
  "missingSkills": [string],
  "matchedKeywords": [string],
  "missingKeywords": [string],
  "recommendations": [string],
  "strengths": [string],
  "improvements": [string],
  "sectionAnalysis": [{"name": string, "score": number, "feedback": string}]
}`;

    const response = await fetch('https://api.aimlapi.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.AIML_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'openai/gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an expert HR analyst and resume reviewer. Analyze resumes against job descriptions and provide detailed, actionable feedback with specific match percentages and recommendations. Always respond with valid JSON format.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 2000,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      throw new Error(`AIML API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Invalid response format from AIML API');
    }

    // Parse the AI response
    const analysisText = data.choices[0].message.content.trim();
    
    // Try to parse as JSON first
    let analysisResult;
    try {
      // Remove any markdown code blocks if present
      const cleanedText = analysisText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      analysisResult = JSON.parse(cleanedText);
    } catch (parseError) {
      console.warn('Failed to parse JSON response, falling back to text extraction');
      
      // Fallback to text extraction if JSON parsing fails
      const scoreMatch = analysisText.match(/(?:match|score).*?(\d+)%/i);
      const matchPercentage = scoreMatch ? parseInt(scoreMatch[1], 10) : 75;
      
      const matchedSkillsMatch = analysisText.match(/matched skills?:?\s*(.*?)(?:\n\n|missing skills|$)/is);
      const missingSkillsMatch = analysisText.match(/missing skills?:?\s*(.*?)(?:\n\n|matched keywords|$)/is);
      
      const matchedSkills = matchedSkillsMatch ? 
        extractListItems(matchedSkillsMatch[1]) : 
        findMatchedSkills(resumeText, jobDescription);
      
      const missingSkills = missingSkillsMatch ? 
        extractListItems(missingSkillsMatch[1]) : 
        findMissingSkills(resumeText, jobDescription);
      
      const recommendationsMatch = analysisText.match(/recommendations?:?\s*(.*?)(?:\n\n|strengths|$)/is);
      const recommendations = recommendationsMatch ? 
        extractListItems(recommendationsMatch[1]) : 
        ["Focus on highlighting relevant experience", "Add missing technical skills", "Quantify achievements with metrics"];
      
      analysisResult = {
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
        ]
      };
    }
    
    // Ensure all required fields are present and properly formatted
    return {
      matchPercentage: Math.min(100, Math.max(0, analysisResult.matchPercentage || 75)),
      matchedSkills: (analysisResult.matchedSkills || []).slice(0, 10),
      missingSkills: (analysisResult.missingSkills || []).slice(0, 8),
      matchedKeywords: (analysisResult.matchedKeywords || findMatchedKeywords(resumeText, jobDescription)).slice(0, 10),
      missingKeywords: (analysisResult.missingKeywords || findMissingKeywords(resumeText, jobDescription)).slice(0, 8),
      recommendations: (analysisResult.recommendations || [
        "Focus on highlighting relevant experience",
        "Add missing technical skills", 
        "Quantify achievements with metrics"
      ]).slice(0, 6),
      strengths: (analysisResult.strengths || [
        "Strong technical background",
        "Relevant industry experience",
        "Good educational foundation"
      ]).slice(0, 6),
      improvements: (analysisResult.improvements || [
        "Add more specific metrics and achievements",
        "Include missing technical skills",
        "Highlight leadership experience"
      ]).slice(0, 6),
      sectionAnalysis: (analysisResult.sectionAnalysis || [
        { name: 'Technical Skills', score: 75, feedback: 'Technical skill analysis' },
        { name: 'Experience Level', score: 70, feedback: 'Experience level assessment' },
        { name: 'Industry Knowledge', score: 75, feedback: 'Industry knowledge evaluation' },
        { name: 'Education', score: 80, feedback: 'Educational background review' }
      ]).slice(0, 6),
      metadata: {
        timestamp: new Date().toISOString(),
        aiPowered: true,
        wordCount: resumeText.split(/\s+/).length,
        apiProvider: 'AIML'
      }
    };
  } catch (error) {
    console.error('AIML API Error:', error);
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