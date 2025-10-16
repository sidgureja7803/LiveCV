#!/usr/bin/env node

/**
 * Local RenderCV Testing Script
 * Usage: npm run render:local
 */

const { mapJsonToRenderCVYaml } = require('../utils/jsonToYamlMapper');
const { renderResume, isRenderCVInstalled, getCacheStats } = require('../services/rendercvService');
const fs = require('fs').promises;
const path = require('path');

// Sample resume data
const sampleResumeData = {
  personalInfo: {
    fullName: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1-555-123-4567',
    address: 'San Francisco, CA',
    linkedIn: 'linkedin.com/in/johndoe',
    github: 'github.com/johndoe',
    website: 'johndoe.com'
  },
  summary: 'Experienced software engineer with 5+ years in full-stack development, specializing in React, Node.js, and cloud technologies. Proven track record of building scalable applications.',
  skills: [
    'JavaScript', 'TypeScript', 'React', 'Node.js', 'Express',
    'MongoDB', 'PostgreSQL', 'AWS', 'Docker', 'Git'
  ],
  experience: [
    {
      company: 'Tech Innovations Inc',
      position: 'Senior Software Engineer',
      location: 'San Francisco, CA',
      startDate: '2021-03',
      endDate: 'present',
      current: true,
      description: 'Led development of microservices architecture serving 1M+ users. Reduced API response time by 40% through optimization.'
    },
    {
      company: 'StartupXYZ',
      position: 'Full Stack Developer',
      location: 'San Francisco, CA',
      startDate: '2019-06',
      endDate: '2021-02',
      current: false,
      description: 'Built and deployed responsive web applications using React and Node.js. Implemented CI/CD pipelines.'
    }
  ],
  education: [
    {
      institution: 'University of California, Berkeley',
      degree: 'Bachelor of Science',
      fieldOfStudy: 'Computer Science',
      location: 'Berkeley, CA',
      startDate: '2015-09',
      endDate: '2019-05',
      gpa: '3.8/4.0'
    }
  ],
  projects: [
    {
      name: 'Open Source Project',
      description: 'Contributed to popular open-source React library with 10k+ stars on GitHub',
      technologies: ['React', 'TypeScript', 'Jest'],
      githubLink: 'https://github.com/johndoe/opensource-project',
      liveLink: 'https://demo.example.com'
    }
  ]
};

async function main() {
  console.log('='.repeat(60));
  console.log('LiveCV - RenderCV Local Testing');
  console.log('='.repeat(60));
  console.log();
  
  // Check if RenderCV is installed
  console.log('Checking RenderCV installation...');
  const installed = await isRenderCVInstalled();
  
  if (!installed) {
    console.error('❌ RenderCV is not installed!');
    console.error('');
    console.error('Please install RenderCV:');
    console.error('  pip install rendercv');
    console.error('');
    console.error('Or using the npm script:');
    console.error('  npm run setup:rendercv');
    process.exit(1);
  }
  
  console.log('✅ RenderCV is installed');
  console.log();
  
  // Test themes
  const themes = ['classic', 'moderncv', 'sb2nov', 'engineeringresumes'];
  
  for (const theme of themes) {
    console.log(`Testing theme: ${theme}`);
    console.log('-'.repeat(60));
    
    try {
      // Convert JSON to YAML
      console.log('  Converting JSON to YAML...');
      const yamlContent = mapJsonToRenderCVYaml(sampleResumeData, theme);
      
      // Save YAML for inspection
      const yamlOutputPath = path.join(__dirname, '..', 'test-output', `test_${theme}.yaml`);
      await fs.mkdir(path.dirname(yamlOutputPath), { recursive: true });
      await fs.writeFile(yamlOutputPath, yamlContent, 'utf8');
      console.log(`  ✓ YAML saved: ${yamlOutputPath}`);
      
      // Render PDF
      console.log('  Rendering PDF with RenderCV...');
      const startTime = Date.now();
      const pdfBuffer = await renderResume(yamlContent, theme, { timeout: 60000 });
      const renderTime = Date.now() - startTime;
      
      // Save PDF
      const pdfOutputPath = path.join(__dirname, '..', 'test-output', `test_${theme}.pdf`);
      await fs.writeFile(pdfOutputPath, pdfBuffer);
      
      console.log(`  ✅ PDF generated in ${renderTime}ms`);
      console.log(`  ✓ PDF saved: ${pdfOutputPath}`);
      console.log(`  ✓ Size: ${(pdfBuffer.length / 1024).toFixed(2)} KB`);
      
    } catch (error) {
      console.error(`  ❌ Error: ${error.message}`);
    }
    
    console.log();
  }
  
  // Display cache statistics
  console.log('Cache Statistics:');
  console.log('-'.repeat(60));
  const stats = getCacheStats();
  console.log(`  Total Renders: ${stats.totalRenders}`);
  console.log(`  Cache Hits: ${stats.hits}`);
  console.log(`  Cache Misses: ${stats.misses}`);
  console.log(`  Hit Rate: ${stats.hitRate}`);
  console.log(`  Avg Render Time: ${stats.averageRenderTime.toFixed(2)}ms`);
  console.log();
  
  console.log('='.repeat(60));
  console.log('✅ Testing complete!');
  console.log('='.repeat(60));
}

// Run the test
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
