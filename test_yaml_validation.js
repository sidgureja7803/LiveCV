#!/usr/bin/env node

/**
 * Test YAML validation function
 */

const { validateRenderCVYaml, mapJsonToRenderCVYaml } = require('./server/utils/jsonToYamlMapper');

console.log('='.repeat(60));
console.log('YAML Validation Testing');
console.log('='.repeat(60));
console.log();

// Test cases
const testCases = [
  {
    name: 'Valid YAML - Complete Resume',
    yaml: `cv:
  name: John Doe
  email: john@example.com
  sections:
    summary:
      - "Experienced developer"
design:
  theme: classic`,
    expectedValid: true
  },
  {
    name: 'Invalid YAML - Missing cv.name',
    yaml: `cv:
  email: john@example.com
  sections:
    summary:
      - "Experienced developer"
design:
  theme: classic`,
    expectedValid: false,
    expectedError: 'Missing cv.name'
  },
  {
    name: 'Invalid YAML - Missing cv.email',
    yaml: `cv:
  name: John Doe
  sections:
    summary:
      - "Experienced developer"
design:
  theme: classic`,
    expectedValid: false,
    expectedError: 'Missing cv.email'
  },
  {
    name: 'Invalid YAML - Missing cv section',
    yaml: `design:
  theme: classic`,
    expectedValid: false,
    expectedError: 'Missing required "cv" section'
  },
  {
    name: 'Invalid YAML - Missing design section',
    yaml: `cv:
  name: John Doe
  email: john@example.com`,
    expectedValid: false,
    expectedError: 'Missing required "design" section'
  },
  {
    name: 'Invalid YAML - Malformed syntax',
    yaml: `cv:
  name: John Doe
  email: john@example.com
  sections:
    - invalid: [unclosed bracket
design:
  theme: classic`,
    expectedValid: false,
    expectedError: 'YAML parse error'
  },
  {
    name: 'Valid YAML - Minimal Resume',
    yaml: `cv:
  name: Jane Smith
  email: jane@example.com
design:
  theme: moderncv`,
    expectedValid: true
  }
];

// Run tests
let passed = 0;
let failed = 0;

testCases.forEach((testCase, index) => {
  console.log(`Test ${index + 1}: ${testCase.name}`);
  console.log('-'.repeat(60));
  
  const result = validateRenderCVYaml(testCase.yaml);
  
  console.log(`  Expected valid: ${testCase.expectedValid}`);
  console.log(`  Actual valid: ${result.valid}`);
  
  if (result.errors.length > 0) {
    console.log(`  Errors: ${result.errors.join(', ')}`);
  }
  
  // Check if result matches expectation
  const testPassed = result.valid === testCase.expectedValid;
  
  // If we expect an error, check if the expected error is present
  if (!testCase.expectedValid && testCase.expectedError) {
    const hasExpectedError = result.errors.some(err => 
      err.includes(testCase.expectedError)
    );
    
    if (hasExpectedError) {
      console.log(`  ✓ Expected error found: "${testCase.expectedError}"`);
    } else {
      console.log(`  ✗ Expected error not found: "${testCase.expectedError}"`);
    }
  }
  
  if (testPassed) {
    console.log('  ✅ PASSED');
    passed++;
  } else {
    console.log('  ❌ FAILED');
    failed++;
  }
  
  console.log();
});

// Test JSON to YAML conversion
console.log('='.repeat(60));
console.log('JSON to YAML Conversion Test');
console.log('='.repeat(60));
console.log();

const sampleResumeData = {
  personalInfo: {
    fullName: 'Test User',
    email: 'test@example.com',
    location: 'San Francisco, CA',
    linkedIn: 'linkedin.com/in/testuser',
    github: 'github.com/testuser'
  },
  summary: 'Experienced software engineer',
  experience: [
    {
      company: 'Tech Corp',
      position: 'Software Engineer',
      location: 'SF, CA',
      startDate: '2020-01',
      endDate: '2023-12',
      current: false,
      description: 'Built awesome software'
    }
  ],
  education: [
    {
      institution: 'University',
      degree: 'BS',
      fieldOfStudy: 'Computer Science',
      startDate: '2016-09',
      endDate: '2020-05',
      gpa: '3.8'
    }
  ],
  skills: ['JavaScript', 'Python', 'React'],
  projects: [
    {
      name: 'Cool Project',
      description: 'A cool project',
      technologies: ['React', 'Node.js']
    }
  ]
};

console.log('Converting sample resume data to YAML...');
const generatedYaml = mapJsonToRenderCVYaml(sampleResumeData, 'classic');

console.log('Generated YAML:');
console.log('-'.repeat(60));
console.log(generatedYaml);
console.log('-'.repeat(60));
console.log();

console.log('Validating generated YAML...');
const validationResult = validateRenderCVYaml(generatedYaml);

if (validationResult.valid) {
  console.log('✅ Generated YAML is valid');
  passed++;
} else {
  console.log('❌ Generated YAML is invalid');
  console.log('Errors:', validationResult.errors);
  failed++;
}

console.log();

// Summary
console.log('='.repeat(60));
console.log('Test Summary');
console.log('='.repeat(60));
console.log(`Total tests: ${testCases.length + 1}`);
console.log(`✅ Passed: ${passed}`);
console.log(`❌ Failed: ${failed}`);
console.log();

if (failed === 0) {
  console.log('✅ All tests passed!');
  process.exit(0);
} else {
  console.log('❌ Some tests failed!');
  process.exit(1);
}
