#!/usr/bin/env node

/**
 * Core Functionality Verification Script
 * Tests all components implemented in tasks 1-3
 */

require('dotenv').config({ path: './server/.env' });

const { validateAllConfig, logValidationResults } = require('../config/validateConfig');
const resumeLimitService = require('../services/resumeLimitService');
const fs = require('fs');
const path = require('path');

console.log('\n╔════════════════════════════════════════════════════════════╗');
console.log('║  LiveCV Core Functionality Verification                   ║');
console.log('╚════════════════════════════════════════════════════════════╝\n');

let allTestsPassed = true;
const results = [];

// Test 1: Configuration Validation
console.log('📋 Test 1: Configuration Validation');
console.log('─────────────────────────────────────────────────────────────');
try {
  const configResult = validateAllConfig();
  
  if (configResult.appwrite.success) {
    console.log('✅ Appwrite configuration is valid');
    results.push({ test: 'Appwrite Config', status: 'PASS' });
  } else {
    console.log('❌ Appwrite configuration is invalid');
    console.log('   Missing:', configResult.appwrite.missing.join(', '));
    results.push({ test: 'Appwrite Config', status: 'FAIL' });
    allTestsPassed = false;
  }
  
  if (configResult.rendercv.success) {
    console.log('✅ RenderCV is installed and accessible');
    results.push({ test: 'RenderCV Installation', status: 'PASS' });
  } else {
    console.log('⚠️  RenderCV is not installed (non-critical)');
    console.log('   Note: PDF generation will not work without RenderCV');
    results.push({ test: 'RenderCV Installation', status: 'WARN' });
  }
  
  if (configResult.criticalFailure) {
    console.log('❌ Critical configuration failure detected');
    allTestsPassed = false;
  }
} catch (error) {
  console.log('❌ Configuration validation failed:', error.message);
  results.push({ test: 'Configuration Validation', status: 'FAIL' });
  allTestsPassed = false;
}

console.log('');

// Test 2: File Structure Cleanup
console.log('📁 Test 2: File Structure Cleanup');
console.log('─────────────────────────────────────────────────────────────');
try {
  // Check for .DS_Store files
  const { execSync } = require('child_process');
  const dsStoreFiles = execSync('find . -name ".DS_Store" -type f 2>/dev/null || true', { encoding: 'utf8' });
  
  if (dsStoreFiles.trim() === '') {
    console.log('✅ No .DS_Store files found in repository');
    results.push({ test: '.DS_Store Cleanup', status: 'PASS' });
  } else {
    console.log('⚠️  .DS_Store files still present:');
    console.log(dsStoreFiles.trim().split('\n').map(f => `   - ${f}`).join('\n'));
    results.push({ test: '.DS_Store Cleanup', status: 'WARN' });
  }
  
  // Check .gitignore
  const gitignorePath = path.join(__dirname, '../../.gitignore');
  if (fs.existsSync(gitignorePath)) {
    const gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
    if (gitignoreContent.includes('.DS_Store')) {
      console.log('✅ .gitignore includes .DS_Store');
      results.push({ test: '.gitignore Updated', status: 'PASS' });
    } else {
      console.log('❌ .gitignore does not include .DS_Store');
      results.push({ test: '.gitignore Updated', status: 'FAIL' });
      allTestsPassed = false;
    }
  } else {
    console.log('❌ .gitignore file not found');
    results.push({ test: '.gitignore Exists', status: 'FAIL' });
    allTestsPassed = false;
  }
  
  // Check cleanup script
  const cleanupScriptPath = path.join(__dirname, 'cleanup.sh');
  if (fs.existsSync(cleanupScriptPath)) {
    const stats = fs.statSync(cleanupScriptPath);
    const isExecutable = (stats.mode & 0o111) !== 0;
    
    if (isExecutable) {
      console.log('✅ Cleanup script exists and is executable');
      results.push({ test: 'Cleanup Script', status: 'PASS' });
    } else {
      console.log('⚠️  Cleanup script exists but is not executable');
      results.push({ test: 'Cleanup Script', status: 'WARN' });
    }
  } else {
    console.log('❌ Cleanup script not found');
    results.push({ test: 'Cleanup Script', status: 'FAIL' });
    allTestsPassed = false;
  }
} catch (error) {
  console.log('❌ File structure cleanup verification failed:', error.message);
  results.push({ test: 'File Structure Cleanup', status: 'FAIL' });
  allTestsPassed = false;
}

console.log('');

// Test 3: Resume Limit Service
console.log('🔢 Test 3: Resume Limit Service');
console.log('─────────────────────────────────────────────────────────────');
try {
  // Check service exports
  const expectedExports = ['RESUME_LIMIT', 'getResumeCount', 'deleteResumeWithFiles', 'enforceResumeLimit'];
  const actualExports = Object.keys(resumeLimitService);
  
  const hasAllExports = expectedExports.every(exp => actualExports.includes(exp));
  
  if (hasAllExports) {
    console.log('✅ Resume limit service exports all required functions');
    results.push({ test: 'Service Exports', status: 'PASS' });
  } else {
    const missing = expectedExports.filter(exp => !actualExports.includes(exp));
    console.log('❌ Resume limit service missing exports:', missing.join(', '));
    results.push({ test: 'Service Exports', status: 'FAIL' });
    allTestsPassed = false;
  }
  
  // Check RESUME_LIMIT constant
  if (resumeLimitService.RESUME_LIMIT === 5) {
    console.log('✅ RESUME_LIMIT is set to 5');
    results.push({ test: 'Resume Limit Constant', status: 'PASS' });
  } else {
    console.log(`❌ RESUME_LIMIT is ${resumeLimitService.RESUME_LIMIT}, expected 5`);
    results.push({ test: 'Resume Limit Constant', status: 'FAIL' });
    allTestsPassed = false;
  }
  
  // Check if service is integrated with controller
  const controllerPath = path.join(__dirname, '../controllers/resumeController.js');
  if (fs.existsSync(controllerPath)) {
    const controllerContent = fs.readFileSync(controllerPath, 'utf8');
    if (controllerContent.includes('enforceResumeLimit')) {
      console.log('✅ Resume limit service is integrated with resume controller');
      results.push({ test: 'Controller Integration', status: 'PASS' });
    } else {
      console.log('❌ Resume limit service not integrated with resume controller');
      results.push({ test: 'Controller Integration', status: 'FAIL' });
      allTestsPassed = false;
    }
  }
} catch (error) {
  console.log('❌ Resume limit service verification failed:', error.message);
  results.push({ test: 'Resume Limit Service', status: 'FAIL' });
  allTestsPassed = false;
}

console.log('');

// Test 4: Frontend Components
console.log('🎨 Test 4: Frontend Components');
console.log('─────────────────────────────────────────────────────────────');
try {
  // Check warning modal component
  const modalPath = path.join(__dirname, '../../client/src/components/ResumeLimitWarningModal.tsx');
  if (fs.existsSync(modalPath)) {
    console.log('✅ Resume limit warning modal component exists');
    results.push({ test: 'Warning Modal Component', status: 'PASS' });
  } else {
    console.log('❌ Resume limit warning modal component not found');
    results.push({ test: 'Warning Modal Component', status: 'FAIL' });
    allTestsPassed = false;
  }
  
  // Check dashboard integration
  const dashboardPath = path.join(__dirname, '../../client/src/pages/Dashboard.tsx');
  if (fs.existsSync(dashboardPath)) {
    const dashboardContent = fs.readFileSync(dashboardPath, 'utf8');
    if (dashboardContent.includes('resumeLimit') || dashboardContent.includes('resume.*count')) {
      console.log('✅ Dashboard shows resume count');
      results.push({ test: 'Dashboard Resume Count', status: 'PASS' });
    } else {
      console.log('⚠️  Dashboard may not show resume count');
      results.push({ test: 'Dashboard Resume Count', status: 'WARN' });
    }
  }
  
  // Check template selector integration
  const templateSelectorPath = path.join(__dirname, '../../client/src/pages/TemplateSelector.tsx');
  if (fs.existsSync(templateSelectorPath)) {
    const templateContent = fs.readFileSync(templateSelectorPath, 'utf8');
    if (templateContent.includes('showLimitWarning') || templateContent.includes('resumeCount')) {
      console.log('✅ Template selector integrates resume limit check');
      results.push({ test: 'Template Selector Integration', status: 'PASS' });
    } else {
      console.log('⚠️  Template selector may not check resume limit');
      results.push({ test: 'Template Selector Integration', status: 'WARN' });
    }
  }
} catch (error) {
  console.log('❌ Frontend components verification failed:', error.message);
  results.push({ test: 'Frontend Components', status: 'FAIL' });
  allTestsPassed = false;
}

console.log('');

// Test 5: Server Startup Integration
console.log('🚀 Test 5: Server Startup Integration');
console.log('─────────────────────────────────────────────────────────────');
try {
  const serverPath = path.join(__dirname, '../server.js');
  if (fs.existsSync(serverPath)) {
    const serverContent = fs.readFileSync(serverPath, 'utf8');
    
    if (serverContent.includes('validateAllConfig')) {
      console.log('✅ Server integrates configuration validation');
      results.push({ test: 'Server Validation Integration', status: 'PASS' });
    } else {
      console.log('❌ Server does not integrate configuration validation');
      results.push({ test: 'Server Validation Integration', status: 'FAIL' });
      allTestsPassed = false;
    }
    
    if (serverContent.includes('criticalFailure') && serverContent.includes('process.exit(1)')) {
      console.log('✅ Server exits on critical configuration failure');
      results.push({ test: 'Critical Failure Handling', status: 'PASS' });
    } else {
      console.log('❌ Server does not handle critical configuration failure');
      results.push({ test: 'Critical Failure Handling', status: 'FAIL' });
      allTestsPassed = false;
    }
  } else {
    console.log('❌ Server file not found');
    results.push({ test: 'Server File', status: 'FAIL' });
    allTestsPassed = false;
  }
} catch (error) {
  console.log('❌ Server startup integration verification failed:', error.message);
  results.push({ test: 'Server Startup Integration', status: 'FAIL' });
  allTestsPassed = false;
}

// Summary
console.log('\n╔════════════════════════════════════════════════════════════╗');
console.log('║  Verification Summary                                      ║');
console.log('╚════════════════════════════════════════════════════════════╝\n');

const passed = results.filter(r => r.status === 'PASS').length;
const failed = results.filter(r => r.status === 'FAIL').length;
const warnings = results.filter(r => r.status === 'WARN').length;

console.log(`Total Tests: ${results.length}`);
console.log(`✅ Passed: ${passed}`);
console.log(`❌ Failed: ${failed}`);
console.log(`⚠️  Warnings: ${warnings}`);

console.log('\nDetailed Results:');
console.log('─────────────────────────────────────────────────────────────');
results.forEach(result => {
  const icon = result.status === 'PASS' ? '✅' : result.status === 'FAIL' ? '❌' : '⚠️';
  console.log(`${icon} ${result.test.padEnd(40)} [${result.status}]`);
});

console.log('\n╔════════════════════════════════════════════════════════════╗');
if (allTestsPassed && failed === 0) {
  console.log('║  ✅ ALL CORE FUNCTIONALITY TESTS PASSED                    ║');
} else {
  console.log('║  ❌ SOME TESTS FAILED - REVIEW REQUIRED                    ║');
}
console.log('╚════════════════════════════════════════════════════════════╝\n');

process.exit(allTestsPassed && failed === 0 ? 0 : 1);
