const { exec } = require('child_process');
const { promisify } = require('util');
const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');
const NodeCache = require('node-cache');
const os = require('os');

const execAsync = promisify(exec);

// Initialize cache with 1 hour TTL and check period of 10 minutes
const pdfCache = new NodeCache({ 
  stdTTL: 3600, 
  checkperiod: 600,
  useClones: false // Store buffers directly
});

// Cache statistics
let cacheStats = {
  hits: 0,
  misses: 0,
  totalRenders: 0,
  averageRenderTime: 0
};

/**
 * Generates a content hash for caching
 * @param {string} yamlContent - YAML content
 * @param {string} theme - Template theme name
 * @returns {string} SHA-256 hash
 */
function generateContentHash(yamlContent, theme) {
  return crypto
    .createHash('sha256')
    .update(yamlContent + theme)
    .digest('hex');
}

/**
 * Renders a resume using RenderCV CLI
 * @param {string} yamlContent - RenderCV YAML content
 * @param {string} theme - Theme name (classic, moderncv, sb2nov, etc.)
 * @param {Object} options - Rendering options
 * @returns {Promise<Buffer>} PDF buffer
 */
async function renderResume(yamlContent, theme = 'classic', options = {}) {
  const startTime = Date.now();
  cacheStats.totalRenders++;
  
  // Generate cache key
  const cacheKey = generateContentHash(yamlContent, theme);
  
  // Check cache first
  if (!options.bypassCache) {
    const cachedPdf = pdfCache.get(cacheKey);
    if (cachedPdf) {
      cacheStats.hits++;
      console.log(`[RenderCV Cache] HIT - Key: ${cacheKey.substring(0, 12)}...`);
      return cachedPdf;
    }
  }
  
  cacheStats.misses++;
  console.log(`[RenderCV Cache] MISS - Rendering new PDF...`);
  
  // Create temporary directory for this render
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'livecv-render-'));
  const yamlPath = path.join(tempDir, 'resume.yaml');
  const outputDir = path.join(tempDir, 'output');
  
  try {
    // Write YAML to temp file
    await fs.writeFile(yamlPath, yamlContent, 'utf8');
    
    // Execute RenderCV command with timeout
    const timeoutMs = options.timeout || 30000; // 30 seconds default
    const renderCommand = `rendercv render "${yamlPath}" --output-dir "${outputDir}"`;
    
    console.log(`[RenderCV] Executing: ${renderCommand}`);
    
    const { stdout, stderr } = await execAsync(renderCommand, {
      timeout: timeoutMs,
      maxBuffer: 10 * 1024 * 1024 // 10MB buffer
    });
    
    if (stderr && !stderr.includes('Warning')) {
      console.warn(`[RenderCV] STDERR: ${stderr}`);
    }
    
    // Find the generated PDF
    const files = await fs.readdir(outputDir);
    const pdfFile = files.find(f => f.endsWith('.pdf'));
    
    if (!pdfFile) {
      throw new Error('RenderCV did not generate a PDF file');
    }
    
    const pdfPath = path.join(outputDir, pdfFile);
    const pdfBuffer = await fs.readFile(pdfPath);
    
    // Cache the result
    pdfCache.set(cacheKey, pdfBuffer);
    
    const renderTime = Date.now() - startTime;
    cacheStats.averageRenderTime = 
      (cacheStats.averageRenderTime * (cacheStats.totalRenders - 1) + renderTime) / 
      cacheStats.totalRenders;
    
    console.log(`[RenderCV] Render complete in ${renderTime}ms (PDF size: ${(pdfBuffer.length / 1024).toFixed(2)} KB)`);
    
    return pdfBuffer;
    
  } catch (error) {
    console.error('[RenderCV] Render error:', error);
    
    // Enhance error message
    if (error.killed) {
      throw new Error(`RenderCV render timeout after ${options.timeout || 30000}ms`);
    }
    
    if (error.code === 127 || error.message.includes('command not found')) {
      throw new Error('RenderCV is not installed. Please install it using: pip install rendercv');
    }
    
    throw new Error(`RenderCV render failed: ${error.message}`);
    
  } finally {
    // Clean up temporary files
    try {
      await fs.rm(tempDir, { recursive: true, force: true });
    } catch (cleanupError) {
      console.warn(`[RenderCV] Cleanup warning: ${cleanupError.message}`);
    }
  }
}

/**
 * Renders a resume with worker pool support (for high concurrency)
 * Note: Basic implementation - can be enhanced with actual worker threads
 * @param {string} yamlContent - RenderCV YAML content
 * @param {string} theme - Theme name
 * @param {Object} options - Rendering options
 * @returns {Promise<Buffer>} PDF buffer
 */
async function renderResumeWithWorker(yamlContent, theme = 'classic', options = {}) {
  // For now, use the same renderResume function
  // In production, this would delegate to a worker thread pool
  return renderResume(yamlContent, theme, options);
}

/**
 * Pre-warms the cache with common templates
 * @param {Array<Object>} sampleResumes - Array of { yamlContent, theme } objects
 */
async function warmCache(sampleResumes = []) {
  console.log('[RenderCV] Warming cache with sample resumes...');
  
  for (const { yamlContent, theme } of sampleResumes) {
    try {
      await renderResume(yamlContent, theme);
    } catch (error) {
      console.error(`[RenderCV] Cache warm failed for theme ${theme}:`, error.message);
    }
  }
  
  console.log('[RenderCV] Cache warming complete');
}

/**
 * Clears the PDF cache
 */
function clearCache() {
  pdfCache.flushAll();
  console.log('[RenderCV] Cache cleared');
}

/**
 * Gets cache statistics
 * @returns {Object} Cache statistics
 */
function getCacheStats() {
  return {
    ...cacheStats,
    cacheSize: pdfCache.keys().length,
    hitRate: cacheStats.totalRenders > 0 
      ? ((cacheStats.hits / cacheStats.totalRenders) * 100).toFixed(2) + '%'
      : '0%'
  };
}

/**
 * Checks if RenderCV is installed
 * @returns {Promise<boolean>}
 */
async function isRenderCVInstalled() {
  try {
    await execAsync('rendercv --version', { timeout: 5000 });
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Gets RenderCV version
 * @returns {Promise<string>}
 */
async function getRenderCVVersion() {
  try {
    const { stdout } = await execAsync('rendercv --version', { timeout: 5000 });
    return stdout.trim();
  } catch (error) {
    return 'Unknown (not installed)';
  }
}

/**
 * Sanitizes YAML content to prevent injection attacks
 * @param {string} yamlContent - YAML content to sanitize
 * @returns {string} Sanitized YAML
 */
function sanitizeYamlContent(yamlContent) {
  // Remove any shell command injection attempts
  const dangerous = ['$(', '`', '&&', '||', ';', '|'];
  let sanitized = yamlContent;
  
  dangerous.forEach(pattern => {
    sanitized = sanitized.replace(new RegExp(pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), '');
  });
  
  return sanitized;
}

/**
 * Validates file path to prevent directory traversal
 * @param {string} filePath - File path to validate
 * @returns {boolean}
 */
function isValidPath(filePath) {
  const normalized = path.normalize(filePath);
  return !normalized.includes('..') && !normalized.startsWith('/etc') && !normalized.startsWith('/root');
}

module.exports = {
  renderResume,
  renderResumeWithWorker,
  warmCache,
  clearCache,
  getCacheStats,
  isRenderCVInstalled,
  getRenderCVVersion,
  sanitizeYamlContent,
  isValidPath,
  generateContentHash
};
