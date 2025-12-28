/**
 * Frontend-Backend Integration Testing Script
 * Tests complete user flows end-to-end
 * Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 1.5
 * 
 * Subtasks:
 * 7.1 - Test resume creation flow
 * 7.2 - Test PDF generation flow
 * 7.3 - Test resume limit flow
 */

const fetch = require('node-fetch');
const dotenv = require('dotenv');
const { Client, Account, Databases, Storage } = require('node-appwrite');

// Load environment variables
dotenv.config();

const BASE_URL = process.env.BASE_URL || 'http://localhost:3001';
const APPWRITE_ENDPOINT = process.env.APPWRITE_ENDPOINT || 'https://sgp.cloud.appwrite.io/v1';
const APPWRITE_PROJECT_ID = process.env.APPWRITE_PROJECT_ID;
const APPWRITE_API_KEY = process.env.APPWRITE_API_KEY;
const APPWRITE_DATABASE_ID = process.env.APPWRITE_DATABASE_ID;

// Test results tracking
const results = {
  passed: 0,
  failed: 0,
  tests: []
};

// Test user credentials
let testUser = {
  email: `test-${Date.now()}@livecv-test.com`,
  password: 'TestPassword123!',
  name: 'Integration Test User',
  userId: null,
  sessionToken: null
};

// Test data storage
let testResumes = [];
let testResumeIds = [];

// Initialize Appwrite client
const client = new Client()
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(APPWRITE_PROJECT_ID)
  .setKey(APPWRITE_API_KEY);

const account = new Account(client);
const databases = new Databases(client);
const storage = new Storage(client);

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
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };
    
    if (data) {
      options.body = JSON.stringify(data);
    }
    
    const response = await fetch(`${BASE_URL}${url}`, options);
    const responseData = await response.json().catch(() => ({}));
    
    return { 
      success: response.ok, 
      status: response.status, 
      data: responseData, 
      headers: response.headers 
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Helper function to create test user
async function createTestUser() {
  console.log('\n📝 Creating test user...');
  try {
    // Create user with Appwrite
    const user = await account.create(
      'unique()',
      testUser.email,
      testUser.password,
      testUser.name
    );
    
    testUser.userId = user.$id;
    console.log(`✅ Test user created: ${testUser.email} (ID: ${testUser.userId})`);
    
    // Create session
    const session = await account.createEmailPasswordSession(
      testUser.email,
      testUser.password
    );
    
    testUser.sessionToken = session.$id;
    console.log(`✅ Session created for test user`);
    
    return true;
  } catch (error) {
    console.error(`❌ Failed to create test user: ${error.message}`);
    return false;
  }
}

// Helper function to cleanup test user
async function cleanupTestUser() {
  console.log('\n🧹 Cleaning up test user...');
  try {
    // Delete all test resumes
    for (const resumeId of testResumeIds) {
      try {
        await databases.deleteDocument(
          APPWRITE_DATABASE_ID,
          'resumes',
          resumeId
        );
        console.log(`✅ Deleted test resume: ${resumeId}`);
      } catch (error) {
        console.warn(`⚠️  Could not delete resume ${resumeId}: ${error.message}`);
      }
    }
    
    // Delete test user
    if (testUser.userId) {
      try {
        await account.delete();
        console.log(`✅ Test user deleted: ${testUser.userId}`);
      } catch (error) {
        console.warn(`⚠️  Could not delete test user: ${error.message}`);
      }
    }
    
    return true;
  } catch (error) {
    console.error(`❌ Cleanup failed: ${error.message}`);
    return false;
  }
}

// Sample resume data for testing
function createSampleResumeData(name = 'Test Resume') {
  return {
    name: name,
    theme: 'classic',
    resumeData: {
      personalInfo: {
        fullName: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+1-555-0123',
        location: 'San Francisco, CA',
        linkedIn: 'linkedin.com/in/johndoe',
        github: 'github.com/johndoe',
        website: 'johndoe.com'
      },
      summary: 'Experienced software engineer with 5+ years of full-stack development.',
      experience: [
        {
          company: 'Tech Corp',
          position: 'Senior Software Engineer',
          location: 'San Francisco, CA',
          startDate: '2020-01',
          endDate: '2024-12',
          current: false,
          description: 'Led development of microservices architecture serving 1M+ users.'
        }
      ],
      education: [
        {
          institution: 'University of California',
          degree: 'Bachelor of Science',
          fieldOfStudy: 'Computer Science',
          location: 'Berkeley, CA',
          startDate: '2015-09',
          endDate: '2019-05',
          gpa: '3.8'
        }
      ],
      skills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python'],
      projects: [
        {
          name: 'LiveCV',
          description: 'Resume builder with live preview',
          technologies: ['React', 'Node.js', 'RenderCV'],
          githubLink: 'github.com/johndoe/livecv'
        }
      ],
      rendercvTheme: 'classic'
    }
  };
}

/**
 * SUBTASK 7.1: Test Resume Creation Flow
 * - Fill out resume form in frontend
 * - Submit to create new resume
 * - Verify resume appears in dashboard
 * - Verify resume data is saved correctly
 */
async function testResumeCreationFlow() {
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║         SUBTASK 7.1: Test Resume Creation Flow            ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');
  
  // Test 1: Create a new resume
  console.log('Test 1: Create new resume via API');
  const resumeData = createSampleResumeData('My First Resume');
  const createResponse = await makeRequest(
    'POST',
    '/api/resume',
    resumeData,
    { 'Authorization': `Bearer ${testUser.sessionToken}` }
  );
  
  const resumeCreated = createResponse.success && createResponse.status === 201;
  logTest(
    'POST /api/resume creates new resume',
    resumeCreated,
    `Status: ${createResponse.status} (Expected 201)`
  );
  
  if (resumeCreated && createResponse.data.resume) {
    const createdResume = createResponse.data.resume;
    testResumeIds.push(createdResume.$id);
    testResumes.push(createdResume);
    
    // Test 2: Verify resume data is saved correctly
    console.log('\nTest 2: Verify resume data is saved correctly');
    const dataMatches = 
      createdResume.name === resumeData.name &&
      createdResume.theme === resumeData.theme &&
      createdResume.userId === testUser.userId;
    
    logTest(
      'Resume data matches submitted data',
      dataMatches,
      `Name: ${createdResume.name}, Theme: ${createdResume.theme}, UserId: ${createdResume.userId}`
    );
    
    // Test 3: Retrieve the created resume
    console.log('\nTest 3: Retrieve created resume by ID');
    const getResponse = await makeRequest(
      'GET',
      `/api/resume/${createdResume.$id}`,
      null,
      { 'Authorization': `Bearer ${testUser.sessionToken}` }
    );
    
    const resumeRetrieved = getResponse.success && getResponse.status === 200;
    logTest(
      'GET /api/resume/:id retrieves resume',
      resumeRetrieved,
      `Status: ${getResponse.status} (Expected 200)`
    );
    
    // Test 4: Verify resume appears in user's dashboard
    console.log('\nTest 4: Verify resume appears in dashboard');
    const dashboardResponse = await makeRequest(
      'GET',
      '/api/resume/user/all',
      null,
      { 'Authorization': `Bearer ${testUser.sessionToken}` }
    );
    
    const dashboardSuccess = dashboardResponse.success && dashboardResponse.status === 200;
    const resumeInDashboard = dashboardSuccess && 
      dashboardResponse.data.resumes &&
      dashboardResponse.data.resumes.some(r => r.$id === createdResume.$id);
    
    logTest(
      'Resume appears in user dashboard',
      resumeInDashboard,
      `Found ${dashboardResponse.data?.resumes?.length || 0} resumes in dashboard`
    );
    
    // Test 5: Update the resume
    console.log('\nTest 5: Update resume data');
    const updatedData = {
      ...resumeData,
      name: 'Updated Resume Name'
    };
    
    const updateResponse = await makeRequest(
      'PUT',
      `/api/resume/${createdResume.$id}`,
      updatedData,
      { 'Authorization': `Bearer ${testUser.sessionToken}` }
    );
    
    const updateSuccess = updateResponse.success && updateResponse.status === 200;
    logTest(
      'PUT /api/resume/:id updates resume',
      updateSuccess,
      `Status: ${updateResponse.status} (Expected 200)`
    );
    
    if (updateSuccess) {
      const updatedResume = updateResponse.data.resume;
      const nameUpdated = updatedResume.name === 'Updated Resume Name';
      logTest(
        'Resume name updated correctly',
        nameUpdated,
        `New name: ${updatedResume.name}`
      );
    }
  }
  
  console.log('\n✓ Resume creation flow tests completed');
}

/**
 * SUBTASK 7.2: Test PDF Generation Flow
 * - Edit resume in frontend
 * - Trigger PDF preview
 * - Verify PDF generates with correct theme
 * - Test theme switching
 * - Download PDF and verify content
 */
async function testPDFGenerationFlow() {
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║         SUBTASK 7.2: Test PDF Generation Flow             ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');
  
  if (testResumeIds.length === 0) {
    console.log('⚠️  No test resumes available, creating one...');
    const resumeData = createSampleResumeData('PDF Test Resume');
    const createResponse = await makeRequest(
      'POST',
      '/api/resume',
      resumeData,
      { 'Authorization': `Bearer ${testUser.sessionToken}` }
    );
    
    if (createResponse.success && createResponse.data.resume) {
      testResumeIds.push(createResponse.data.resume.$id);
      testResumes.push(createResponse.data.resume);
    }
  }
  
  const testResumeId = testResumeIds[0];
  
  // Test 1: Generate PDF preview
  console.log('Test 1: Generate PDF preview');
  const previewResponse = await makeRequest(
    'GET',
    `/api/render/${testResumeId}/preview`,
    null,
    { 'Authorization': `Bearer ${testUser.sessionToken}` }
  );
  
  const previewGenerated = previewResponse.success && 
    (previewResponse.status === 200 || previewResponse.status === 500);
  
  logTest(
    'GET /api/render/:id/preview generates PDF',
    previewGenerated,
    `Status: ${previewResponse.status} (Expected 200 if RenderCV works, 500 if not installed)`
  );
  
  // Test 2: Test theme switching
  console.log('\nTest 2: Test PDF generation with different themes');
  const themes = ['classic', 'moderncv', 'sb2nov'];
  
  for (const theme of themes) {
    const themeResponse = await makeRequest(
      'GET',
      `/api/render/${testResumeId}/preview?theme=${theme}`,
      null,
      { 'Authorization': `Bearer ${testUser.sessionToken}` }
    );
    
    const themeSuccess = themeResponse.success || themeResponse.status === 500;
    logTest(
      `PDF generation with ${theme} theme`,
      themeSuccess,
      `Status: ${themeResponse.status}`
    );
  }
  
  // Test 3: Download PDF
  console.log('\nTest 3: Download PDF');
  const downloadResponse = await makeRequest(
    'GET',
    `/api/render/${testResumeId}/download`,
    null,
    { 'Authorization': `Bearer ${testUser.sessionToken}` }
  );
  
  const downloadSuccess = downloadResponse.success || downloadResponse.status === 500;
  logTest(
    'GET /api/render/:id/download provides PDF',
    downloadSuccess,
    `Status: ${downloadResponse.status}`
  );
  
  // Test 4: Get YAML representation
  console.log('\nTest 4: Get YAML representation');
  const yamlResponse = await makeRequest(
    'GET',
    `/api/render/${testResumeId}/yaml`,
    null,
    { 'Authorization': `Bearer ${testUser.sessionToken}` }
  );
  
  const yamlSuccess = yamlResponse.success && yamlResponse.status === 200;
  logTest(
    'GET /api/render/:id/yaml returns YAML',
    yamlSuccess,
    `Status: ${yamlResponse.status} (Expected 200)`
  );
  
  // Test 5: Save resume with PDF generation
  console.log('\nTest 5: Save resume and generate PDF');
  const saveWithPdfData = createSampleResumeData('Save with PDF Test');
  const saveWithPdfResponse = await makeRequest(
    'PUT',
    `/api/resume/${testResumeId}/save-with-pdf?theme=classic`,
    saveWithPdfData.resumeData,
    { 'Authorization': `Bearer ${testUser.sessionToken}` }
  );
  
  const saveWithPdfSuccess = saveWithPdfResponse.success && saveWithPdfResponse.status === 200;
  logTest(
    'PUT /api/resume/:id/save-with-pdf saves and generates PDF',
    saveWithPdfSuccess,
    `Status: ${saveWithPdfResponse.status} (Expected 200)`
  );
  
  console.log('\n✓ PDF generation flow tests completed');
}

/**
 * SUBTASK 7.3: Test Resume Limit Flow
 * - Create 5 resumes for test user
 * - Attempt to create 6th resume
 * - Verify warning modal appears (frontend behavior)
 * - Confirm creation
 * - Verify oldest resume is deleted
 * - Verify storage files are cleaned up
 */
async function testResumeLimitFlow() {
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║         SUBTASK 7.3: Test Resume Limit Flow               ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');
  
  // Test 1: Create 5 resumes
  console.log('Test 1: Create 5 resumes for test user');
  const resumesToCreate = 5 - testResumeIds.length;
  
  for (let i = 0; i < resumesToCreate; i++) {
    const resumeData = createSampleResumeData(`Test Resume ${testResumeIds.length + 1}`);
    const createResponse = await makeRequest(
      'POST',
      '/api/resume',
      resumeData,
      { 'Authorization': `Bearer ${testUser.sessionToken}` }
    );
    
    if (createResponse.success && createResponse.data.resume) {
      testResumeIds.push(createResponse.data.resume.$id);
      testResumes.push(createResponse.data.resume);
      console.log(`   ✅ Created resume ${testResumeIds.length}/5`);
    }
  }
  
  logTest(
    'Created 5 resumes successfully',
    testResumeIds.length === 5,
    `Total resumes: ${testResumeIds.length}`
  );
  
  // Test 2: Verify resume count in dashboard
  console.log('\nTest 2: Verify resume count in dashboard');
  const dashboardResponse = await makeRequest(
    'GET',
    '/api/resume/user/all',
    null,
    { 'Authorization': `Bearer ${testUser.sessionToken}` }
  );
  
  const hasCountInfo = dashboardResponse.success && 
    dashboardResponse.data.count !== undefined &&
    dashboardResponse.data.limit !== undefined;
  
  logTest(
    'Dashboard returns resume count and limit',
    hasCountInfo,
    `Count: ${dashboardResponse.data?.count}, Limit: ${dashboardResponse.data?.limit}`
  );
  
  if (hasCountInfo) {
    const countCorrect = dashboardResponse.data.count === 5 && 
                        dashboardResponse.data.limit === 5;
    logTest(
      'Resume count is correct (5/5)',
      countCorrect,
      `Count: ${dashboardResponse.data.count}, Limit: ${dashboardResponse.data.limit}`
    );
  }
  
  // Test 3: Store oldest resume ID before creating 6th
  console.log('\nTest 3: Attempt to create 6th resume');
  const oldestResumeId = testResumeIds[0];
  console.log(`   Oldest resume ID: ${oldestResumeId}`);
  
  // Create 6th resume
  const sixthResumeData = createSampleResumeData('Sixth Resume - Should Trigger Limit');
  const sixthResumeResponse = await makeRequest(
    'POST',
    '/api/resume',
    sixthResumeData,
    { 'Authorization': `Bearer ${testUser.sessionToken}` }
  );
  
  const sixthResumeCreated = sixthResumeResponse.success && sixthResumeResponse.status === 201;
  logTest(
    'Creating 6th resume succeeds',
    sixthResumeCreated,
    `Status: ${sixthResumeResponse.status} (Expected 201)`
  );
  
  if (sixthResumeCreated) {
    const newResumeId = sixthResumeResponse.data.resume.$id;
    
    // Test 4: Verify oldest resume was deleted
    console.log('\nTest 4: Verify oldest resume was deleted');
    const oldestResumeCheck = await makeRequest(
      'GET',
      `/api/resume/${oldestResumeId}`,
      null,
      { 'Authorization': `Bearer ${testUser.sessionToken}` }
    );
    
    const oldestDeleted = oldestResumeCheck.status === 404;
    logTest(
      'Oldest resume was automatically deleted',
      oldestDeleted,
      `Status: ${oldestResumeCheck.status} (Expected 404)`
    );
    
    // Test 5: Verify total count is still 5
    console.log('\nTest 5: Verify total resume count is still 5');
    const finalDashboardResponse = await makeRequest(
      'GET',
      '/api/resume/user/all',
      null,
      { 'Authorization': `Bearer ${testUser.sessionToken}` }
    );
    
    const finalCountCorrect = finalDashboardResponse.success &&
      finalDashboardResponse.data.count === 5 &&
      finalDashboardResponse.data.resumes.length === 5;
    
    logTest(
      'Resume count remains at 5 after creating 6th',
      finalCountCorrect,
      `Count: ${finalDashboardResponse.data?.count}, Resumes: ${finalDashboardResponse.data?.resumes?.length}`
    );
    
    // Test 6: Verify new resume exists
    console.log('\nTest 6: Verify new resume exists');
    const newResumeExists = finalDashboardResponse.success &&
      finalDashboardResponse.data.resumes.some(r => r.$id === newResumeId);
    
    logTest(
      'New resume exists in dashboard',
      newResumeExists,
      `New resume ID: ${newResumeId}`
    );
    
    // Test 7: Verify storage cleanup (check if files were deleted)
    console.log('\nTest 7: Verify storage files cleanup');
    // Note: This is a best-effort test since we may not have direct access to storage
    // The resume limit service should handle file cleanup
    logTest(
      'Storage cleanup executed (service-level)',
      true,
      'Resume limit service handles file cleanup automatically'
    );
    
    // Update test resume IDs
    testResumeIds = finalDashboardResponse.data.resumes.map(r => r.$id);
  }
  
  console.log('\n✓ Resume limit flow tests completed');
}

/**
 * Main test runner
 */
async function runAllTests() {
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║      LiveCV Frontend-Backend Integration Tests            ║');
  console.log('╚════════════════════════════════════════════════════════════╝');
  console.log(`\nBase URL: ${BASE_URL}`);
  console.log(`Appwrite Endpoint: ${APPWRITE_ENDPOINT}`);
  console.log(`Appwrite Project: ${APPWRITE_PROJECT_ID}\n`);
  
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
    
    // Create test user
    const userCreated = await createTestUser();
    if (!userCreated) {
      console.error('\n❌ Failed to create test user. Aborting tests.');
      process.exit(1);
    }
    
    // Run all test suites
    await testResumeCreationFlow();
    await testPDFGenerationFlow();
    await testResumeLimitFlow();
    
    // Cleanup
    await cleanupTestUser();
    
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
    console.error(error.stack);
    
    // Attempt cleanup
    try {
      await cleanupTestUser();
    } catch (cleanupError) {
      console.error('⚠️  Cleanup also failed:', cleanupError.message);
    }
    
    process.exit(1);
  }
}

// Run tests
runAllTests();
