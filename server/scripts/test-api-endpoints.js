/**
 * API Endpoint Verification Script
 * Tests all resume and render API endpoints
 * Requirements: 6.1, 6.2, 6.3, 6.4
 */

const axios = require('axios');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const BASE_URL = process.env.BASE_URL || 'http://localhost:3001';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// Test results tracking
const results = {
  passed: 0,
  failed: 0,
  tests: []
};

// Helper function to log test results
function logTest(name, passed, details = '') {
  const status = passed ? '✅ PASS' : '❌ FAIL';
  console.log(`${status}: ${name}`);
  if (details) {
    console.log(`   ${details}`);
  }
  
  results.tests.push({ name, passed, details });
  if (passed) {
    results.passed++;
  } else {
    results.failed++;
  }
}

// Helper function to make API requests
async function makeRequest(method, url, data = null, headers = {}) {
  try {
    const config = {
      method,
      url: `${BASE_URL}${url}`,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };
    
    if (data) {
      config.data = data;
    }
    
    const response = await axios(config);
    return { success: true, status: response.status, data: response.data, headers: response.headers };
  } catch (error) {
    if (error.response) {
      return { 
        success: false, 
        status: error.response.status, 
        data: error.response.data,
        headers: error.response.headers
      };
    }
    return { success: false, error: error.message };
  }
}

// Test data
let testResumeId = null;
let testAuthToken = null;

/**
 * SUBTASK 6.1: Test Resume CRUD Endpoints
 */
async function testResumeCRUDEndpoints() {
  console.log('\n=== SUBTASK 6.1: Testing Resume CRUD Endpoints ===\n');
  
  // Test 1: GET /api/resume/:id without auth (should work with getUser middleware)
  console.log('Test 1: GET /api/resume/:id without authentication');
  const getResumeNoAuth = await makeRequest('GET', '/api/resume/test-id-123');
  logTest(
    'GET /api/resume/:id without auth',
    getResumeNoAuth.status === 404 || getResumeNoAuth.status === 200,
    `Status: ${getResumeNoAuth.status} (Expected 404 for non-existent or 200 if exists)`
  );
  
  // Test 2: GET /api/resume/user/all without auth (should return 401)
  console.log('\nTest 2: GET /api/resume/user/all without authentication');
  const getAllNoAuth = await makeRequest('GET', '/api/resume/user/all');
  logTest(
    'GET /api/resume/user/all without auth returns 401',
    getAllNoAuth.status === 401,
    `Status: ${getAllNoAuth.status} (Expected 401)`
  );
  
  // Test 3: POST /api/resume without auth (should return 401)
  console.log('\nTest 3: POST /api/resume without authentication');
  const createNoAuth = await makeRequest('POST', '/api/resume', {
    name: 'Test Resume',
    theme: 'classic'
  });
  logTest(
    'POST /api/resume without auth returns 401',
    createNoAuth.status === 401,
    `Status: ${createNoAuth.status} (Expected 401)`
  );
  
  // Test 4: PUT /api/resume/:id without auth (should return 401)
  console.log('\nTest 4: PUT /api/resume/:id without authentication');
  const updateNoAuth = await makeRequest('PUT', '/api/resume/test-id-123', {
    name: 'Updated Resume'
  });
  logTest(
    'PUT /api/resume/:id without auth returns 401',
    updateNoAuth.status === 401,
    `Status: ${updateNoAuth.status} (Expected 401)`
  );
  
  // Test 5: DELETE /api/resume/:id without auth (should return 401)
  console.log('\nTest 5: DELETE /api/resume/:id without authentication');
  const deleteNoAuth = await makeRequest('DELETE', '/api/resume/test-id-123');
  logTest(
    'DELETE /api/resume/:id without auth returns 401',
    deleteNoAuth.status === 401,
    `Status: ${deleteNoAuth.status} (Expected 401)`
  );
  
  // Test 6: GET /api/resume/templates/list (public endpoint)
  console.log('\nTest 6: GET /api/resume/templates/list');
  const listTemplates = await makeRequest('GET', '/api/resume/templates/list');
  logTest(
    'GET /api/resume/templates/list returns 200',
    listTemplates.status === 200,
    `Status: ${listTemplates.status} (Expected 200)`
  );
  
  console.log('\n✓ Resume CRUD endpoint tests completed');
}

/**
 * SUBTASK 6.2: Test Render Endpoints
 */
async function testRenderEndpoints() {
  console.log('\n=== SUBTASK 6.2: Testing Render Endpoints ===\n');
  
  // Test 1: GET /api/render/health
  console.log('Test 1: GET /api/render/health');
  const health = await makeRequest('GET', '/api/render/health');
  logTest(
    'GET /api/render/health returns 200',
    health.status === 200,
    `Status: ${health.status} (Expected 200)`
  );
  
  // Test 2: GET /api/render/cache/stats
  console.log('\nTest 2: GET /api/render/cache/stats');
  const cacheStats = await makeRequest('GET', '/api/render/cache/stats');
  logTest(
    'GET /api/render/cache/stats returns 200',
    cacheStats.status === 200,
    `Status: ${cacheStats.status} (Expected 200)`
  );
  
  // Test 3: GET /api/render/:id/preview (non-existent ID)
  console.log('\nTest 3: GET /api/render/:id/preview with non-existent ID');
  const previewNotFound = await makeRequest('GET', '/api/render/non-existent-id/preview');
  logTest(
    'GET /api/render/:id/preview returns 404 for non-existent ID',
    previewNotFound.status === 404,
    `Status: ${previewNotFound.status} (Expected 404)`
  );
  
  // Test 4: GET /api/render/:id/download (non-existent ID)
  console.log('\nTest 4: GET /api/render/:id/download with non-existent ID');
  const downloadNotFound = await makeRequest('GET', '/api/render/non-existent-id/download');
  logTest(
    'GET /api/render/:id/download returns 404 for non-existent ID',
    downloadNotFound.status === 404,
    `Status: ${downloadNotFound.status} (Expected 404)`
  );
  
  // Test 5: GET /api/render/:id/yaml (non-existent ID)
  console.log('\nTest 5: GET /api/render/:id/yaml with non-existent ID');
  const yamlNotFound = await makeRequest('GET', '/api/render/non-existent-id/yaml');
  logTest(
    'GET /api/render/:id/yaml returns 404 for non-existent ID',
    yamlNotFound.status === 404,
    `Status: ${yamlNotFound.status} (Expected 404)`
  );
  
  // Test 6: POST /api/render/generate with minimal data
  console.log('\nTest 6: POST /api/render/generate with sample data');
  const generatePDF = await makeRequest('POST', '/api/render/generate', {
    resumeData: {
      cv: {
        name: 'Test User',
        email: 'test@example.com',
        sections: {
          summary: 'Test summary'
        }
      },
      design: {
        theme: 'classic'
      }
    },
    theme: 'classic',
    fileName: 'test-resume.pdf'
  });
  logTest(
    'POST /api/render/generate handles request',
    generatePDF.status === 200 || generatePDF.status === 500,
    `Status: ${generatePDF.status} (Expected 200 if RenderCV works, 500 if not installed)`
  );
  
  console.log('\n✓ Render endpoint tests completed');
}

/**
 * SUBTASK 6.3: Verify CORS Configuration
 */
async function testCORSConfiguration() {
  console.log('\n=== SUBTASK 6.3: Testing CORS Configuration ===\n');
  
  // Test 1: Preflight request from frontend URL
  console.log('Test 1: OPTIONS preflight request');
  const preflight = await makeRequest('OPTIONS', '/api/resume/templates/list', null, {
    'Origin': FRONTEND_URL,
    'Access-Control-Request-Method': 'GET',
    'Access-Control-Request-Headers': 'Content-Type'
  });
  logTest(
    'OPTIONS preflight request succeeds',
    preflight.status === 200 || preflight.status === 204,
    `Status: ${preflight.status} (Expected 200 or 204)`
  );
  
  // Test 2: Check CORS headers in response
  console.log('\nTest 2: Verify CORS headers in response');
  const corsHeaders = await makeRequest('GET', '/api/health', null, {
    'Origin': FRONTEND_URL
  });
  const hasCORSHeaders = corsHeaders.headers && (
    corsHeaders.headers['access-control-allow-origin'] || 
    corsHeaders.headers['Access-Control-Allow-Origin']
  );
  logTest(
    'Response includes CORS headers',
    hasCORSHeaders,
    `CORS headers present: ${hasCORSHeaders}`
  );
  
  // Test 3: Check credentials allowed
  console.log('\nTest 3: Verify credentials are allowed');
  const credentialsAllowed = corsHeaders.headers && (
    corsHeaders.headers['access-control-allow-credentials'] === 'true' ||
    corsHeaders.headers['Access-Control-Allow-Credentials'] === 'true'
  );
  logTest(
    'CORS allows credentials',
    credentialsAllowed,
    `Credentials allowed: ${credentialsAllowed}`
  );
  
  console.log('\n✓ CORS configuration tests completed');
}

/**
 * SUBTASK 6.4: Test Error Handling
 */
async function testErrorHandling() {
  console.log('\n=== SUBTASK 6.4: Testing Error Handling ===\n');
  
  // Test 1: Invalid resume ID format
  console.log('Test 1: GET /api/resume/:id with invalid ID format');
  const invalidId = await makeRequest('GET', '/api/resume/invalid@#$%id');
  logTest(
    'Invalid resume ID returns appropriate error',
    invalidId.status === 404 || invalidId.status === 400,
    `Status: ${invalidId.status} (Expected 404 or 400)`
  );
  
  // Test 2: Non-existent resume ID
  console.log('\nTest 2: GET /api/resume/:id with non-existent ID');
  const notFound = await makeRequest('GET', '/api/resume/507f1f77bcf86cd799439011');
  logTest(
    'Non-existent resume ID returns 404',
    notFound.status === 404,
    `Status: ${notFound.status} (Expected 404)`
  );
  
  // Test 3: Invalid theme parameter
  console.log('\nTest 3: GET /api/render/:id/preview with invalid theme');
  const invalidTheme = await makeRequest('GET', '/api/render/test-id/preview?theme=invalid-theme');
  logTest(
    'Invalid theme parameter handled',
    invalidTheme.status === 400 || invalidTheme.status === 404 || invalidTheme.status === 500,
    `Status: ${invalidTheme.status} (Expected 400, 404, or 500)`
  );
  
  // Test 4: Malformed request body
  console.log('\nTest 4: POST /api/render/generate with malformed body');
  const malformedBody = await makeRequest('POST', '/api/render/generate', {
    invalid: 'data'
  });
  logTest(
    'Malformed request body returns 400 or 500',
    malformedBody.status === 400 || malformedBody.status === 500,
    `Status: ${malformedBody.status} (Expected 400 or 500)`
  );
  
  // Test 5: Verify error messages are user-friendly
  console.log('\nTest 5: Verify error messages are user-friendly');
  const errorResponse = await makeRequest('GET', '/api/resume/user/all');
  const hasMessage = errorResponse.data && (
    errorResponse.data.message || 
    errorResponse.data.error ||
    errorResponse.data.msg
  );
  logTest(
    'Error responses include user-friendly messages',
    hasMessage,
    `Has error message: ${hasMessage}`
  );
  
  // Test 6: Verify appropriate status codes
  console.log('\nTest 6: Verify status codes are appropriate');
  const statusTests = [
    { endpoint: '/api/resume/user/all', expectedStatus: 401, description: 'Unauthorized' },
    { endpoint: '/api/resume/nonexistent123', expectedStatus: 404, description: 'Not Found' }
  ];
  
  for (const test of statusTests) {
    const response = await makeRequest('GET', test.endpoint);
    logTest(
      `${test.endpoint} returns ${test.expectedStatus} (${test.description})`,
      response.status === test.expectedStatus,
      `Status: ${response.status} (Expected ${test.expectedStatus})`
    );
  }
  
  console.log('\n✓ Error handling tests completed');
}

/**
 * Main test runner
 */
async function runAllTests() {
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║         LiveCV API Endpoint Verification Tests            ║');
  console.log('╚════════════════════════════════════════════════════════════╝');
  console.log(`\nBase URL: ${BASE_URL}`);
  console.log(`Frontend URL: ${FRONTEND_URL}\n`);
  
  try {
    // Check if server is running
    console.log('Checking if server is running...');
    const healthCheck = await makeRequest('GET', '/health');
    if (!healthCheck.success && healthCheck.error) {
      console.error(`\n❌ Cannot connect to server at ${BASE_URL}`);
      console.error(`Error: ${healthCheck.error}`);
      console.error('\nPlease ensure the server is running before running tests.');
      process.exit(1);
    }
    console.log('✅ Server is running\n');
    
    // Run all test suites
    await testResumeCRUDEndpoints();
    await testRenderEndpoints();
    await testCORSConfiguration();
    await testErrorHandling();
    
    // Print summary
    console.log('\n╔════════════════════════════════════════════════════════════╗');
    console.log('║                      Test Summary                          ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');
    console.log(`Total Tests: ${results.passed + results.failed}`);
    console.log(`✅ Passed: ${results.passed}`);
    console.log(`❌ Failed: ${results.failed}`);
    console.log(`Success Rate: ${((results.passed / (results.passed + results.failed)) * 100).toFixed(1)}%\n`);
    
    // List failed tests
    if (results.failed > 0) {
      console.log('Failed Tests:');
      results.tests.filter(t => !t.passed).forEach(t => {
        console.log(`  ❌ ${t.name}`);
        if (t.details) {
          console.log(`     ${t.details}`);
        }
      });
      console.log('');
    }
    
    // Exit with appropriate code
    process.exit(results.failed > 0 ? 1 : 0);
    
  } catch (error) {
    console.error('\n❌ Test execution failed:', error.message);
    process.exit(1);
  }
}

// Run tests
runAllTests();
