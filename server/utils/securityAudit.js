/**
 * Security Audit Utility
 * Checks for security best practices and potential vulnerabilities
 */

const fs = require('fs');
const path = require('path');

/**
 * Check if .env files are properly ignored
 */
function checkEnvFilesIgnored() {
  const gitignorePath = path.join(__dirname, '../../.gitignore');
  
  try {
    const gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
    const hasEnvIgnore = gitignoreContent.includes('.env') || 
                         gitignoreContent.includes('*.env') ||
                         gitignoreContent.includes('.env.local');
    
    return {
      passed: hasEnvIgnore,
      message: hasEnvIgnore 
        ? '✅ .env files are properly ignored in .gitignore'
        : '❌ .env files are NOT ignored in .gitignore'
    };
  } catch (error) {
    return {
      passed: false,
      message: `❌ Could not read .gitignore: ${error.message}`
    };
  }
}

/**
 * Check if helmet middleware is configured
 */
function checkHelmetConfigured() {
  const serverPath = path.join(__dirname, '../server.js');
  
  try {
    const serverContent = fs.readFileSync(serverPath, 'utf8');
    const hasHelmet = serverContent.includes("require('helmet')") || 
                      serverContent.includes('from "helmet"');
    const usesHelmet = serverContent.includes('app.use(helmet');
    
    return {
      passed: hasHelmet && usesHelmet,
      message: (hasHelmet && usesHelmet)
        ? '✅ Helmet middleware is configured'
        : '❌ Helmet middleware is NOT properly configured'
    };
  } catch (error) {
    return {
      passed: false,
      message: `❌ Could not check helmet configuration: ${error.message}`
    };
  }
}

/**
 * Check CORS configuration
 */
function checkCORSConfiguration() {
  const serverPath = path.join(__dirname, '../server.js');
  
  try {
    const serverContent = fs.readFileSync(serverPath, 'utf8');
    const hasCORS = serverContent.includes("require('cors')") || 
                    serverContent.includes('from "cors"');
    const usesCORS = serverContent.includes('app.use(cors');
    const hasOriginCheck = serverContent.includes('origin:');
    
    return {
      passed: hasCORS && usesCORS && hasOriginCheck,
      message: (hasCORS && usesCORS && hasOriginCheck)
        ? '✅ CORS is properly configured with origin restrictions'
        : '⚠️ CORS configuration may need review'
    };
  } catch (error) {
    return {
      passed: false,
      message: `❌ Could not check CORS configuration: ${error.message}`
    };
  }
}

/**
 * Check for potential secrets in code
 */
function checkForHardcodedSecrets() {
  const patterns = [
    /api[_-]?key\s*=\s*['"][^'"]+['"]/gi,
    /secret\s*=\s*['"][^'"]+['"]/gi,
    /password\s*=\s*['"][^'"]+['"]/gi,
    /token\s*=\s*['"][^'"]+['"]/gi
  ];
  
  const filesToCheck = [
    path.join(__dirname, '../server.js'),
    path.join(__dirname, '../config/appwrite.js'),
    path.join(__dirname, '../middleware/auth.js')
  ];
  
  const findings = [];
  
  filesToCheck.forEach(filePath => {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      patterns.forEach(pattern => {
        const matches = content.match(pattern);
        if (matches) {
          // Filter out process.env references (these are OK)
          const hardcoded = matches.filter(m => !m.includes('process.env'));
          if (hardcoded.length > 0) {
            findings.push({
              file: path.basename(filePath),
              matches: hardcoded
            });
          }
        }
      });
    } catch (error) {
      // File doesn't exist or can't be read, skip
    }
  });
  
  return {
    passed: findings.length === 0,
    message: findings.length === 0
      ? '✅ No hardcoded secrets found in checked files'
      : `⚠️ Potential hardcoded secrets found: ${JSON.stringify(findings, null, 2)}`,
    findings
  };
}

/**
 * Check session configuration security
 */
function checkSessionSecurity() {
  const serverPath = path.join(__dirname, '../server.js');
  
  try {
    const serverContent = fs.readFileSync(serverPath, 'utf8');
    const hasSession = serverContent.includes('express-session');
    
    if (!hasSession) {
      return {
        passed: true,
        message: '✅ No session middleware detected (using stateless auth)'
      };
    }
    
    const hasSecureSecret = serverContent.includes('process.env.SESSION_SECRET') ||
                           serverContent.includes('process.env.JWT_SECRET');
    const hasHttpOnly = serverContent.includes('httpOnly: true');
    const hasSecureFlag = serverContent.includes('secure:');
    
    return {
      passed: hasSecureSecret && hasHttpOnly,
      message: (hasSecureSecret && hasHttpOnly)
        ? '✅ Session configuration is secure'
        : '⚠️ Session configuration may need security improvements'
    };
  } catch (error) {
    return {
      passed: false,
      message: `❌ Could not check session configuration: ${error.message}`
    };
  }
}

/**
 * Run all security checks
 */
function runSecurityAudit() {
  console.log('\n🔒 Running Security Audit...\n');
  
  const checks = [
    { name: 'Environment Files', check: checkEnvFilesIgnored },
    { name: 'Helmet Middleware', check: checkHelmetConfigured },
    { name: 'CORS Configuration', check: checkCORSConfiguration },
    { name: 'Hardcoded Secrets', check: checkForHardcodedSecrets },
    { name: 'Session Security', check: checkSessionSecurity }
  ];
  
  const results = [];
  let allPassed = true;
  
  checks.forEach(({ name, check }) => {
    console.log(`Checking: ${name}...`);
    const result = check();
    results.push({ name, ...result });
    console.log(result.message);
    console.log('');
    
    if (!result.passed) {
      allPassed = false;
    }
  });
  
  console.log('─'.repeat(60));
  console.log(allPassed 
    ? '✅ All security checks passed!' 
    : '⚠️ Some security checks failed or need attention');
  console.log('─'.repeat(60));
  console.log('');
  
  return {
    allPassed,
    results
  };
}

module.exports = {
  runSecurityAudit,
  checkEnvFilesIgnored,
  checkHelmetConfigured,
  checkCORSConfiguration,
  checkForHardcodedSecrets,
  checkSessionSecurity
};

// Run audit if called directly
if (require.main === module) {
  runSecurityAudit();
}
