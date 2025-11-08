/**
 * Test script for JD Match functionality
 * Run with: node scripts/testJDMatch.js
 */
const jdMatchService = require('../services/jdMatchService');

// Sample resume content
const sampleResume = `
John Doe
Software Engineer
john.doe@email.com | (555) 123-4567 | LinkedIn: linkedin.com/in/johndoe

PROFESSIONAL SUMMARY
Experienced full-stack software engineer with 5+ years of experience in web development. 
Proficient in JavaScript, React, Node.js, and Python. Strong background in building scalable 
web applications and RESTful APIs. Experience with cloud platforms and DevOps practices.

TECHNICAL SKILLS
• Programming Languages: JavaScript, TypeScript, Python, Java
• Frontend: React, Vue.js, HTML5, CSS3, Bootstrap
• Backend: Node.js, Express.js, Django, Flask
• Databases: MongoDB, PostgreSQL, MySQL
• Cloud: AWS (EC2, S3, Lambda), Docker
• Tools: Git, Jenkins, Jira, VS Code

PROFESSIONAL EXPERIENCE

Senior Software Engineer | Tech Corp | 2021 - Present
• Led development of microservices architecture serving 1M+ users
• Implemented CI/CD pipelines reducing deployment time by 60%
• Mentored 3 junior developers and conducted technical interviews
• Built responsive web applications using React and Node.js

Full Stack Developer | StartupXYZ | 2019 - 2021
• Developed and maintained web applications using React and Django
• Integrated third-party APIs and payment systems (Stripe, PayPal)
• Collaborated with design team to implement pixel-perfect UI components
• Optimized database queries improving application performance by 40%

EDUCATION
Bachelor of Science in Computer Science
University of Technology | 2015 - 2019
GPA: 3.8/4.0

PROJECTS
E-commerce Platform
• Built full-stack e-commerce platform using React, Node.js, and MongoDB
• Implemented user authentication, payment processing, and inventory management
• Technologies: React, Node.js, MongoDB, Stripe API

Task Management App
• Developed collaborative task management application with real-time updates
• Implemented drag-and-drop functionality and team collaboration features
• Technologies: React, Socket.io, Express, PostgreSQL
`;

// Sample job description
const sampleJobDescription = `
Senior Full Stack Developer - Remote

Company: InnovaTech Solutions
Location: Remote (US timezone)
Salary: $120,000 - $150,000

Job Description:
We are seeking a talented Senior Full Stack Developer to join our growing team. You will be responsible for developing and maintaining web applications, working with modern technologies, and collaborating with cross-functional teams.

Required Skills:
• 4+ years of experience in full-stack web development
• Proficiency in JavaScript, TypeScript, and modern frameworks (React, Angular, or Vue.js)
• Strong backend development skills with Node.js or Python
• Experience with databases (PostgreSQL, MongoDB)
• Knowledge of cloud platforms (AWS, Azure, or Google Cloud)
• Experience with version control systems (Git)
• Understanding of RESTful APIs and microservices architecture
• Familiarity with DevOps practices and CI/CD pipelines

Preferred Skills:
• Experience with Docker and Kubernetes
• Knowledge of GraphQL
• Experience with testing frameworks (Jest, Cypress)
• Familiarity with Agile/Scrum methodologies
• Experience with serverless technologies
• Knowledge of machine learning concepts

Responsibilities:
• Design and develop scalable web applications
• Collaborate with product managers and designers
• Write clean, maintainable, and well-documented code
• Participate in code reviews and technical discussions
• Mentor junior developers
• Stay up-to-date with emerging technologies

Requirements:
• Bachelor's degree in Computer Science or related field
• Strong problem-solving and analytical skills
• Excellent communication and teamwork abilities
• Ability to work independently in a remote environment
• Experience with Agile development methodologies
`;

async function testJDMatch() {
  console.log('🚀 Testing JD Match Service...\n');
  
  try {
    console.log('📄 Sample Resume Length:', sampleResume.length, 'characters');
    console.log('📋 Sample Job Description Length:', sampleJobDescription.length, 'characters\n');
    
    console.log('⏳ Analyzing job match...');
    const startTime = Date.now();
    
    const result = await jdMatchService.analyzeJobMatch(sampleResume, sampleJobDescription);
    
    const endTime = Date.now();
    console.log(`✅ Analysis completed in ${endTime - startTime}ms\n`);
    
    // Display results
    console.log('📊 JOB MATCH RESULTS:');
    console.log('='.repeat(50));
    console.log(`🎯 Match Percentage: ${result.matchPercentage}%`);
    console.log(`🔧 AI Powered: ${result.metadata?.aiPowered ? 'Yes' : 'No'}`);
    console.log(`📝 Resume Word Count: ${result.metadata?.wordCount || 'N/A'}`);
    console.log(`⏰ Analysis Time: ${new Date(result.metadata?.timestamp).toLocaleString()}\n`);
    
    console.log('✅ MATCHED SKILLS:');
    result.matchedSkills.forEach((skill, index) => {
      console.log(`   ${index + 1}. ${skill}`);
    });
    
    console.log('\n❌ MISSING SKILLS:');
    result.missingSkills.forEach((skill, index) => {
      console.log(`   ${index + 1}. ${skill}`);
    });
    
    console.log('\n🔑 MATCHED KEYWORDS:');
    result.matchedKeywords.forEach((keyword, index) => {
      console.log(`   ${index + 1}. ${keyword}`);
    });
    
    console.log('\n💡 RECOMMENDATIONS:');
    result.recommendations.forEach((rec, index) => {
      console.log(`   ${index + 1}. ${rec}`);
    });
    
    console.log('\n💪 STRENGTHS:');
    result.strengths.forEach((strength, index) => {
      console.log(`   ${index + 1}. ${strength}`);
    });
    
    console.log('\n📈 AREAS FOR IMPROVEMENT:');
    result.improvements.forEach((improvement, index) => {
      console.log(`   ${index + 1}. ${improvement}`);
    });
    
    console.log('\n📋 SECTION ANALYSIS:');
    result.sectionAnalysis.forEach((section, index) => {
      console.log(`   ${section.name}: ${section.score}% - ${section.feedback}`);
    });
    
    console.log('\n🎉 Test completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

// Run the test
testJDMatch();