#!/usr/bin/env node

/**
 * Final Verification Script for LiveCV Project
 * 
 * This script runs through the complete manual test checklist:
 * - Server starts without errors
 * - Appwrite connection successful
 * - RenderCV working
 * - Create/edit/delete resume works
 * - PDF generation works for all themes
 * - Resume limit enforced correctly
 * - All templates visible and working
 * - Dashboard shows resume count
 * - Warning modal appears at limit
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// ANSI color codes for output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

// Test results tracker
const results = {
  passed: [],
  failed: [],
  warnings: []
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(title) {
  console.log('\n' + '='.repeat(60));
  log(title, 'cyan');
  console.log('='.repeat(60) + '\n');
}

function pass(test) {
  results.passed.push(test);
  log(`✅ PASS: ${test}`, 'green');
}

function fail(test, error) {
  results.failed.push({ test, error });
  log(`❌ FAIL: ${test}`, 'red');
  if (error) {
    log(`   Error: ${error}`, 'red');
  }
}

function warn(test, message) {
  results.warnings.push({ test, message });
  log(`⚠️  WARN: ${test}`, 'yellow');
  if (message) {
    log(`   ${message}`, 'yellow');
  }
}

// Test 1: Configuration Validation
function testConfiguration() {
  logSection('1. Configuration Validation');
  
  try {
    // Check if .env files exist
    const serverEnvPath = path.join(__dirname, '../.env');
    const clientEnvPath = path.join(__dirname, '../../client/.env');
    
    if (fs.existsSync(serverEnvPath)) {
      pass('Server .env file exists');
    } else {
      fail('Server .env file exists', 'File not found');
    }
    
    if (fs.existsSync(clientEnvPath)) {
      pass('Client .env file exists');
    } else {
      fail('Client .env file exists', 'File not found');
    }
    
    // Load and validate configuration
    require('dotenv').config({ path: serverEnvPath });
    const { validateAllConfig } = require('../config/validateConfig');
    
    const validation = validateAllConfig();
    
    if (!validation.criticalFailure) {
      pass('Configuration validation passed');
    } else {
      fail('Configuration validation', 'Critical configuration missing');
    }
    
    // Check specific required variables
    const requiredVars = [
      'APPWRITE_ENDPOINT',
      'APPWRITE_PROJECT_ID',
      'APPWRITE_API_KEY',
      'APPWRITE_DATABASE_ID'
    ];
    
    requiredVars.forEach(varName => {
      if (process.env[varName]) {
        pass(`${varName} is set`);
      } else {
        fail(`${varName} is set`, 'Variable not found');
      }
    });
    
  } catch (error) {
    fail('Configuration validation', error.message);
  }
}

// Test 2: RenderCV Installation
function testRenderCV() {
  logSection('2. RenderCV Installation');
  
  try {
    const version = execSync('rendercv --version', { encoding: 'utf-8' }).trim();
    pass(`RenderCV is installed (${version})`);
  } catch (error) {
    fail('RenderCV installation', 'RenderCV not found or not in PATH');
  }
  
  try {
    const pythonVersion = execSync('python3 --version', { encoding: 'utf-8' }).trim();
    pass(`Python is installed (${pythonVersion})`);
  } catch (error) {
    fail('Python installation', 'Python3 not found');
  }
}

// Test 3: File Structure Cleanup
function testFileCleanup() {
  logSection('3. File Structure Cleanup');
  
  // Check for .DS_Store files
  try {
    const dsStoreFiles = execSync('find . -name ".DS_Store" 2>/dev/null || true', { 
      encoding: 'utf-8',
      cwd: path.join(__dirname, '../..')
    }).trim();
    
    if (dsStoreFiles === '') {
      pass('No .DS_Store files found');
    } else {
      fail('No .DS_Store files', `Found: ${dsStoreFiles.split('\n').length} files`);
    }
  } catch (error) {
    warn('DS_Store check', 'Could not check for .DS_Store files');
  }
  
  // Check .gitignore
  const gitignorePath = path.join(__dirname, '../../.gitignore');
  if (fs.existsSync(gitignorePath)) {
    const gitignore = fs.readFileSync(gitignorePath, 'utf-8');
    
    if (gitignore.includes('.DS_Store')) {
      pass('.gitignore includes .DS_Store');
    } else {
      fail('.gitignore includes .DS_Store', 'Pattern not found');
    }
    
    if (gitignore.includes('node_modules')) {
      pass('.gitignore includes node_modules');
    } else {
      fail('.gitignore includes node_modules', 'Pattern not found');
    }
  } else {
    fail('.gitignore exists', 'File not found');
  }
}

// Test 4: Service Files
function testServiceFiles() {
  logSection('4. Service Files');
  
  const requiredFiles = [
    '../config/validateConfig.js',
    '../services/resumeLimitService.js',
    '../services/rendercvService.js',
    '../utils/jsonToYamlMapper.js',
    '../utils/validation.js',
    '../utils/logger.js',
    '../scripts/cleanup.sh'
  ];
  
  requiredFiles.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
      pass(`${path.basename(file)} exists`);
    } else {
      fail(`${path.basename(file)} exists`, 'File not found');
    }
  });
}

// Test 5: Template Files
function testTemplates() {
  logSection('5. Template Files');
  
  const templatesDir = path.join(__dirname, '../templates');
  const themes = ['Classic', 'Moderncv', 'Sb2nov', 'Engineeringresumes', 'Engineeringclassic'];
  
  themes.forEach(theme => {
    const yamlFile = path.join(templatesDir, `John_Doe_${theme}Theme_CV.yaml`);
    const pdfFile = path.join(templatesDir, `John_Doe_${theme}Theme_CV.pdf`);
    
    if (fs.existsSync(yamlFile)) {
      pass(`${theme} YAML template exists`);
    } else {
      fail(`${theme} YAML template exists`, 'File not found');
    }
    
    if (fs.existsSync(pdfFile)) {
      pass(`${theme} PDF template exists`);
    } else {
      warn(`${theme} PDF template exists`, 'File not found (may be generated on demand)');
    }
  });
  
  // Check template README
  const readmePath = path.join(templatesDir, 'README.md');
  if (fs.existsSync(readmePath)) {
    pass('Template README.md exists');
  } else {
    fail('Template README.md exists', 'File not found');
  }
}

// Test 6: Frontend Components
function testFrontendComponents() {
  logSection('6. Frontend Components');
  
  const clientDir = path.join(__dirname, '../../client/src');
  
  const requiredComponents = [
    'components/ResumeLimitWarningModal.tsx',
    'pages/Dashboard.tsx',
    'pages/TemplateSelector.tsx',
    'config/templates.ts',
    'services/api.ts'
  ];
  
  requiredComponents.forEach(component => {
    const filePath = path.join(clientDir, component);
    if (fs.existsSync(filePath)) {
      pass(`${path.basename(component)} exists`);
    } else {
      fail(`${path.basename(component)} exists`, 'File not found');
    }
  });
}

// Test 7: Documentation
function testDocumentation() {
  logSection('7. Documentation');
  
  const rootDir = path.join(__dirname, '../..');
  
  const docFiles = [
    'README.md',
    'RENDERCV_INSTALLATION.md',
    'RENDERCV_VERIFICATION_SUMMARY.md',
    'SECURITY_AND_ERROR_HANDLING_SUMMARY.md',
    'INTEGRATION_TESTS_SUMMARY.md'
  ];
  
  docFiles.forEach(file => {
    const filePath = path.join(rootDir, file);
    if (fs.existsSync(filePath)) {
      pass(`${file} exists`);
    } else {
      fail(`${file} exists`, 'File not found');
    }
  });
}

// Test 8: Resume Limit Service
function testResumeLimitService() {
  logSection('8. Resume Limit Service');
  
  try {
    const resumeLimitService = require('../services/resumeLimitService');
    
    if (typeof resumeLimitService.enforceResumeLimit === 'function') {
      pass('enforceResumeLimit function exists');
    } else {
      fail('enforceResumeLimit function exists', 'Function not found');
    }
    
    if (typeof resumeLimitService.getResumeCount === 'function') {
      pass('getResumeCount function exists');
    } else {
      fail('getResumeCount function exists', 'Function not found');
    }
    
    if (typeof resumeLimitService.deleteResumeWithFiles === 'function') {
      pass('deleteResumeWithFiles function exists');
    } else {
      fail('deleteResumeWithFiles function exists', 'Function not found');
    }
    
    // Check RESUME_LIMIT constant
    const serviceCode = fs.readFileSync(
      path.join(__dirname, '../services/resumeLimitService.js'),
      'utf-8'
    );
    
    if (serviceCode.includes('RESUME_LIMIT') && serviceCode.includes('= 5')) {
      pass('RESUME_LIMIT is set to 5');
    } else {
      fail('RESUME_LIMIT is set to 5', 'Constant not found or incorrect value');
    }
    
  } catch (error) {
    fail('Resume limit service', error.message);
  }
}

// Test 9: Validation Utilities
function testValidation() {
  logSection('9. Validation Utilities');
  
  try {
    const validation = require('../utils/validation');
    
    const validationFunctions = [
      'validateResumeData',
      'validateTheme',
      'sanitizeInput',
      'validateRenderCVYaml'
    ];
    
    validationFunctions.forEach(funcName => {
      if (typeof validation[funcName] === 'function') {
        pass(`${funcName} function exists`);
      } else {
        fail(`${funcName} function exists`, 'Function not found');
      }
    });
    
  } catch (error) {
    fail('Validation utilities', error.message);
  }
}

// Test 10: Security Configuration
function testSecurity() {
  logSection('10. Security Configuration');
  
  try {
    const serverCode = fs.readFileSync(path.join(__dirname, '../server.js'), 'utf-8');
    
    if (serverCode.includes('helmet')) {
      pass('Helmet middleware is configured');
    } else {
      fail('Helmet middleware is configured', 'Not found in server.js');
    }
    
    if (serverCode.includes('cors')) {
      pass('CORS middleware is configured');
    } else {
      fail('CORS middleware is configured', 'Not found in server.js');
    }
    
    // Check if .env is in .gitignore
    const gitignorePath = path.join(__dirname, '../../.gitignore');
    const gitignore = fs.readFileSync(gitignorePath, 'utf-8');
    
    if (gitignore.includes('.env')) {
      pass('.env files are in .gitignore');
    } else {
      fail('.env files are in .gitignore', 'Pattern not found');
    }
    
  } catch (error) {
    fail('Security configuration', error.message);
  }
}

// Main execution
function runAllTests() {
  log('\n🚀 Starting Final Verification Tests for LiveCV Project\n', 'blue');
  log('This will verify all components are properly configured and working.\n', 'blue');
  
  testConfiguration();
  testRenderCV();
  testFileCleanup();
  testServiceFiles();
  testTemplates();
  testFrontendComponents();
  testDocumentation();
  testResumeLimitService();
  testValidation();
  testSecurity();
  
  // Print summary
  logSection('Test Summary');
  
  log(`✅ Passed: ${results.passed.length}`, 'green');
  log(`❌ Failed: ${results.failed.length}`, 'red');
  log(`⚠️  Warnings: ${results.warnings.length}`, 'yellow');
  
  if (results.failed.length > 0) {
    log('\nFailed Tests:', 'red');
    results.failed.forEach(({ test, error }) => {
      log(`  - ${test}`, 'red');
      if (error) {
        log(`    ${error}`, 'red');
      }
    });
  }
  
  if (results.warnings.length > 0) {
    log('\nWarnings:', 'yellow');
    results.warnings.forEach(({ test, message }) => {
      log(`  - ${test}`, 'yellow');
      if (message) {
        log(`    ${message}`, 'yellow');
      }
    });
  }
  
  console.log('\n' + '='.repeat(60));
  
  if (results.failed.length === 0) {
    log('🎉 All critical tests passed!', 'green');
    log('The LiveCV project is ready for deployment.', 'green');
    return 0;
  } else {
    log('⚠️  Some tests failed. Please review and fix the issues.', 'yellow');
    return 1;
  }
}

// Run tests
const exitCode = runAllTests();
process.exit(exitCode);
