const { execSync } = require('child_process');

/**
 * Validate Appwrite configuration
 * Checks that all required environment variables are present
 * @returns {Object} Validation result with success status and details
 */
function validateAppwriteConfig() {
  const required = [
    'APPWRITE_ENDPOINT',
    'APPWRITE_PROJECT_ID',
    'APPWRITE_API_KEY',
    'APPWRITE_DATABASE_ID',
    'APPWRITE_BUCKET_PDFS',
    'APPWRITE_BUCKET_YAMLS'
  ];

  const missing = [];
  const present = [];
  const details = {};

  required.forEach(key => {
    if (!process.env[key] || process.env[key].trim() === '') {
      missing.push(key);
      details[key] = 'Missing';
    } else {
      present.push(key);
      details[key] = 'Present';
    }
  });

  const success = missing.length === 0;

  return {
    success,
    service: 'Appwrite',
    message: success 
      ? 'All required Appwrite configuration variables are present'
      : `Missing required Appwrite configuration: ${missing.join(', ')}`,
    missing,
    present,
    details
  };
}

/**
 * Validate RenderCV installation
 * Checks if RenderCV is installed and accessible
 * @returns {Object} Validation result with success status and details
 */
function validateRenderCVConfig() {
  try {
    // Try to execute rendercv --version
    const output = execSync('rendercv --version', { 
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe']
    });
    
    const version = output.trim();
    
    return {
      success: true,
      service: 'RenderCV',
      message: `RenderCV is installed: ${version}`,
      version,
      installed: true
    };
  } catch (error) {
    // RenderCV is not installed or not in PATH
    return {
      success: false,
      service: 'RenderCV',
      message: 'RenderCV is not installed or not accessible in PATH',
      error: error.message,
      installed: false,
      installInstructions: 'Install RenderCV using: pip install rendercv'
    };
  }
}

/**
 * Validate all configuration
 * Runs all validation checks and returns combined results
 * @returns {Object} Combined validation results
 */
function validateAllConfig() {
  const appwriteResult = validateAppwriteConfig();
  const rendercvResult = validateRenderCVConfig();

  const allSuccess = appwriteResult.success && rendercvResult.success;
  const criticalFailure = !appwriteResult.success; // Appwrite is critical

  return {
    success: allSuccess,
    criticalFailure,
    appwrite: appwriteResult,
    rendercv: rendercvResult,
    summary: {
      total: 2,
      passed: [appwriteResult.success, rendercvResult.success].filter(Boolean).length,
      failed: [appwriteResult.success, rendercvResult.success].filter(x => !x).length
    }
  };
}

/**
 * Log validation results in a formatted way
 * @param {Object} results - Validation results from validateAllConfig()
 */
function logValidationResults(results) {
  console.log('\n========================================');
  console.log('Configuration Validation Results');
  console.log('========================================\n');

  // Appwrite validation
  console.log(`[${results.appwrite.success ? '✅' : '❌'}] ${results.appwrite.service}: ${results.appwrite.message}`);
  if (!results.appwrite.success && results.appwrite.missing.length > 0) {
    console.log(`   Missing variables: ${results.appwrite.missing.join(', ')}`);
  }

  // RenderCV validation
  console.log(`[${results.rendercv.success ? '✅' : '⚠️'}] ${results.rendercv.service}: ${results.rendercv.message}`);
  if (!results.rendercv.success && results.rendercv.installInstructions) {
    console.log(`   ${results.rendercv.installInstructions}`);
  }

  console.log('\n========================================');
  console.log(`Summary: ${results.summary.passed}/${results.summary.total} checks passed`);
  console.log('========================================\n');

  if (results.criticalFailure) {
    console.error('❌ CRITICAL: Server cannot start due to missing critical configuration');
  } else if (!results.success) {
    console.warn('⚠️ WARNING: Some non-critical configuration is missing, some features may not work');
  } else {
    console.log('✅ All configuration checks passed successfully');
  }
}

module.exports = {
  validateAppwriteConfig,
  validateRenderCVConfig,
  validateAllConfig,
  logValidationResults
};
