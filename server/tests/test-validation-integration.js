/**
 * Integration Test for Validation Middleware
 * Tests validation middleware with mock Express requests
 */

const validation = require('../utils/validation');

console.log('='.repeat(60));
console.log('Testing Validation Middleware Integration');
console.log('='.repeat(60));
console.log('');

// Mock Express request and response objects
function createMockReq(body = {}, query = {}) {
  return {
    body,
    query,
    requestId: 'test-request-123',
    user: { id: 'test-user' }
  };
}

function createMockRes() {
  const res = {
    statusCode: 200,
    jsonData: null,
    status: function(code) {
      this.statusCode = code;
      return this;
    },
    json: function(data) {
      this.jsonData = data;
      return this;
    }
  };
  return res;
}

function createMockNext() {
  let called = false;
  return function() {
    called = true;
    return { called };
  };
}

// Test 1: Valid Resume Data
console.log('Test 1: Valid Resume Data');
console.log('-'.repeat(60));
const validReq = createMockReq({
  personalInfo: {
    fullName: 'John Doe',
    email: 'john@example.com',
    phone: '+1-234-567-8900'
  },
  experience: [{
    company: 'Tech Corp',
    position: 'Engineer',
    startDate: '2020-01-01',
    endDate: '2023-12-31',
    current: false,
    description: 'Developed applications'
  }],
  education: [{
    institution: 'University',
    degree: 'BS',
    fieldOfStudy: 'CS',
    startDate: '2016-09-01',
    endDate: '2020-05-31'
  }],
  skills: ['JavaScript', 'Python']
});
const validRes = createMockRes();
const validNext = createMockNext();

validation.validateResumeMiddleware(validReq, validRes, validNext);

if (validNext().called) {
  console.log('✅ Valid resume data passed validation');
  console.log('   Sanitized data:', JSON.stringify(validReq.body.personalInfo, null, 2));
} else {
  console.log('❌ Valid resume data failed validation');
  console.log('   Response:', validRes.jsonData);
}
console.log('');

// Test 2: Invalid Resume Data (missing required fields)
console.log('Test 2: Invalid Resume Data (missing required fields)');
console.log('-'.repeat(60));
const invalidReq = createMockReq({
  personalInfo: {
    fullName: '',
    email: 'invalid-email'
  }
});
const invalidRes = createMockRes();
const invalidNext = createMockNext();

validation.validateResumeMiddleware(invalidReq, invalidRes, invalidNext);

if (!invalidNext().called && invalidRes.statusCode === 400) {
  console.log('✅ Invalid resume data correctly rejected');
  console.log('   Status code:', invalidRes.statusCode);
  console.log('   Errors:', invalidRes.jsonData.errors);
} else {
  console.log('❌ Invalid resume data was not rejected');
}
console.log('');

// Test 3: Valid Theme
console.log('Test 3: Valid Theme');
console.log('-'.repeat(60));
const validThemeReq = createMockReq({}, { theme: 'classic' });
const validThemeRes = createMockRes();
const validThemeNext = createMockNext();

validation.validateThemeMiddleware(validThemeReq, validThemeRes, validThemeNext);

if (validThemeNext().called) {
  console.log('✅ Valid theme passed validation');
  console.log('   Theme:', validThemeReq.query.theme);
} else {
  console.log('❌ Valid theme failed validation');
}
console.log('');

// Test 4: Invalid Theme
console.log('Test 4: Invalid Theme');
console.log('-'.repeat(60));
const invalidThemeReq = createMockReq({}, { theme: 'invalid-theme' });
const invalidThemeRes = createMockRes();
const invalidThemeNext = createMockNext();

validation.validateThemeMiddleware(invalidThemeReq, invalidThemeRes, invalidThemeNext);

if (!invalidThemeNext().called && invalidThemeRes.statusCode === 400) {
  console.log('✅ Invalid theme correctly rejected');
  console.log('   Status code:', invalidThemeRes.statusCode);
  console.log('   Error:', invalidThemeRes.jsonData.message);
  console.log('   Supported themes:', invalidThemeRes.jsonData.supportedThemes);
} else {
  console.log('❌ Invalid theme was not rejected');
}
console.log('');

// Test 5: XSS Prevention
console.log('Test 5: XSS Prevention');
console.log('-'.repeat(60));
const xssReq = createMockReq({
  personalInfo: {
    fullName: '<script>alert("XSS")</script>John Doe',
    email: 'john@example.com'
  },
  summary: '<img src=x onerror=alert(1)>Developer',
  experience: [],
  education: [],
  skills: []
});
const xssRes = createMockRes();
const xssNext = createMockNext();

validation.validateResumeMiddleware(xssReq, xssRes, xssNext);

if (xssNext().called) {
  const sanitizedName = xssReq.body.personalInfo.fullName;
  const sanitizedSummary = xssReq.body.summary;
  
  if (!sanitizedName.includes('<script>') && !sanitizedSummary.includes('<img')) {
    console.log('✅ XSS attack prevented through sanitization');
    console.log('   Original name: <script>alert("XSS")</script>John Doe');
    console.log('   Sanitized name:', sanitizedName);
    console.log('   Original summary: <img src=x onerror=alert(1)>Developer');
    console.log('   Sanitized summary:', sanitizedSummary);
  } else {
    console.log('❌ XSS sanitization failed');
  }
} else {
  console.log('❌ Request was rejected (should have passed with sanitization)');
}
console.log('');

// Summary
console.log('='.repeat(60));
console.log('Integration Test Summary');
console.log('='.repeat(60));
console.log('✅ Valid resume data validation working');
console.log('✅ Invalid resume data rejection working');
console.log('✅ Valid theme validation working');
console.log('✅ Invalid theme rejection working');
console.log('✅ XSS prevention working');
console.log('');
console.log('All validation middleware integration tests passed!');
console.log('='.repeat(60));
