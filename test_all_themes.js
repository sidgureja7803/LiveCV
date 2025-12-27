#!/usr/bin/env node

/**
 * Test PDF generation for all RenderCV themes
 */

const fs = require('fs').promises;
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

// Sample resume data
const sampleResumeData = {
  cv: {
    name: "John Doe",
    location: "San Francisco, CA",
    email: "john.doe@example.com",
    phone: "+1 234 567 8900",
    website: "https://johndoe.com",
    social_networks: [
      { network: "LinkedIn", username: "johndoe" },
      { network: "GitHub", username: "johndoe" }
    ],
    sections: {
      Summary: [
        "Experienced software engineer with 5+ years in full-stack development, specializing in React, Node.js, and cloud technologies."
      ],
      Education: [
        {
          institution: "University of California, Berkeley",
          area: "Computer Science",
          degree: "BS",
          start_date: "2015-09",
          end_date: "2019-05",
          highlights: [
            "GPA: 3.8/4.0",
            "Dean's List all semesters"
          ]
        }
      ],
      Experience: [
        {
          company: "Tech Innovations Inc",
          position: "Senior Software Engineer",
          location: "San Francisco, CA",
          start_date: "2021-03",
          end_date: "present",
          highlights: [
            "Led development of microservices architecture serving 1M+ users",
            "Reduced API response time by 40% through optimization",
            "Mentored team of 5 junior engineers"
          ]
        },
        {
          company: "StartupXYZ",
          position: "Full Stack Developer",
          location: "San Francisco, CA",
          start_date: "2019-06",
          end_date: "2021-02",
          highlights: [
            "Built and deployed responsive web applications using React and Node.js",
            "Implemented CI/CD pipelines reducing deployment time by 60%"
          ]
        }
      ],
      Projects: [
        {
          name: "Open Source Contribution",
          start_date: "2020-01",
          end_date: "present",
          highlights: [
            "Contributed to popular React library with 10k+ stars on GitHub",
            "Implemented new features and fixed critical bugs"
          ]
        }
      ],
      Skills: [
        { label: "Programming", details: "Python, JavaScript, TypeScript, React, Node.js, Express" },
        { label: "Databases", details: "PostgreSQL, MongoDB, Redis" },
        { label: "Tools", details: "Git, Docker, AWS, Kubernetes, CI/CD" },
        { label: "Languages", details: "English (native), Spanish (intermediate)" }
      ]
    }
  },
  design: {
    theme: "classic"  // Will be replaced for each theme
  }
};

// Themes to test
const themes = [
  'classic',
  'moderncv',
  'sb2nov',
  'engineeringresumes',
  'engineeringclassic'
];

async function testTheme(theme) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Testing theme: ${theme}`);
  console.log('='.repeat(60));
  
  try {
    // Update theme in resume data
    const resumeData = JSON.parse(JSON.stringify(sampleResumeData));
    resumeData.design.theme = theme;
    
    // Convert to YAML
    const yaml = require('js-yaml');
    const yamlContent = yaml.dump(resumeData);
    
    // Create temp directory
    const tempDir = `./test-output/${theme}`;
    await fs.mkdir(tempDir, { recursive: true });
    
    // Write YAML file
    const yamlPath = path.join(tempDir, `test_${theme}.yaml`);
    await fs.writeFile(yamlPath, yamlContent, 'utf8');
    console.log(`✓ YAML file created: ${yamlPath}`);
    
    // Render PDF with RenderCV
    console.log('Rendering PDF with RenderCV...');
    const startTime = Date.now();
    
    const command = `cd "${tempDir}" && source ../../venv/bin/activate && rendercv render "test_${theme}.yaml"`;
    const { stdout, stderr } = await execAsync(command, {
      timeout: 60000,
      maxBuffer: 15 * 1024 * 1024,
      shell: '/bin/zsh'
    });
    
    const renderTime = Date.now() - startTime;
    
    // Check if PDF was generated
    const pdfPath = path.join(tempDir, 'rendercv_output', 'John_Doe_CV.pdf');
    const pdfStats = await fs.stat(pdfPath);
    
    console.log(`✅ PDF generated successfully in ${renderTime}ms`);
    console.log(`✓ PDF location: ${pdfPath}`);
    console.log(`✓ PDF size: ${(pdfStats.size / 1024).toFixed(2)} KB`);
    
    // Verify PDF is valid (basic check)
    const pdfBuffer = await fs.readFile(pdfPath);
    const pdfHeader = pdfBuffer.toString('utf8', 0, 5);
    
    if (pdfHeader === '%PDF-') {
      console.log('✓ PDF file is valid (header check passed)');
    } else {
      throw new Error('PDF file appears to be invalid (header check failed)');
    }
    
    return {
      theme,
      success: true,
      renderTime,
      pdfSize: pdfStats.size,
      pdfPath
    };
    
  } catch (error) {
    console.error(`❌ Error testing theme ${theme}:`, error.message);
    return {
      theme,
      success: false,
      error: error.message
    };
  }
}

async function main() {
  console.log('\n' + '='.repeat(60));
  console.log('LiveCV - RenderCV Theme Testing');
  console.log('='.repeat(60));
  
  // Check if js-yaml is installed
  try {
    require('js-yaml');
  } catch (error) {
    console.error('❌ js-yaml is not installed. Installing...');
    await execAsync('npm install js-yaml');
    console.log('✓ js-yaml installed');
  }
  
  const results = [];
  
  for (const theme of themes) {
    const result = await testTheme(theme);
    results.push(result);
  }
  
  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('Test Summary');
  console.log('='.repeat(60));
  
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  
  console.log(`\nTotal themes tested: ${results.length}`);
  console.log(`✅ Successful: ${successful.length}`);
  console.log(`❌ Failed: ${failed.length}`);
  
  if (successful.length > 0) {
    console.log('\nSuccessful themes:');
    successful.forEach(r => {
      console.log(`  ✓ ${r.theme} - ${r.renderTime}ms - ${(r.pdfSize / 1024).toFixed(2)} KB`);
    });
  }
  
  if (failed.length > 0) {
    console.log('\nFailed themes:');
    failed.forEach(r => {
      console.log(`  ✗ ${r.theme} - ${r.error}`);
    });
  }
  
  console.log('\n' + '='.repeat(60));
  
  if (failed.length === 0) {
    console.log('✅ All themes tested successfully!');
    process.exit(0);
  } else {
    console.log('⚠️  Some themes failed. See details above.');
    process.exit(1);
  }
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
