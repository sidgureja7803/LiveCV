const { Client, Databases, Storage, Account, Users, Functions } = require('node-appwrite');

// Initialize Appwrite client
const client = new Client();

// Set Appwrite configuration from environment variables
client
  .setEndpoint(process.env.APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
  .setProject(process.env.APPWRITE_PROJECT_ID || '')
  .setKey(process.env.APPWRITE_API_KEY || '');

// Initialize Appwrite services
const databases = new Databases(client);
const storage = new Storage(client);
const account = new Account(client);
const users = new Users(client);
const functions = new Functions(client);

// Appwrite configuration constants
const APPWRITE_CONFIG = {
  databaseId: process.env.APPWRITE_DATABASE_ID || 'livecv-production',
  collections: {
    users: process.env.APPWRITE_COLLECTION_USERS || 'users',
    resumes: process.env.APPWRITE_COLLECTION_RESUMES || 'resumes',
    templates: process.env.APPWRITE_COLLECTION_TEMPLATES || 'templates',
    atsScores: process.env.APPWRITE_COLLECTION_ATS_SCORES || 'ats_scores',
    jobMatches: process.env.APPWRITE_COLLECTION_JOB_MATCHES || 'job_matches'
  },
  buckets: {
    pdfs: process.env.APPWRITE_BUCKET_PDFS || 'resume-pdfs',
    yamls: process.env.APPWRITE_BUCKET_YAMLS || 'resume-yamls',
    avatars: process.env.APPWRITE_BUCKET_AVATARS || 'user-avatars',
    templates: process.env.APPWRITE_BUCKET_TEMPLATES || 'template-files'
  }
};

/**
 * Check if Appwrite is configured
 * @returns {boolean}
 */
function isAppwriteConfigured() {
  return !!(
    process.env.APPWRITE_PROJECT_ID &&
    process.env.APPWRITE_API_KEY &&
    process.env.APPWRITE_ENDPOINT
  );
}

/**
 * Validate Appwrite connection
 * @returns {Promise<boolean>}
 */
async function validateConnection() {
  try {
    if (!isAppwriteConfigured()) {
      console.warn('[Appwrite] Not configured - missing environment variables');
      return false;
    }
    
    try {
      // Use a simple API call that doesn't require a request body
      // Get the health status endpoint which is a GET request
      const response = await client.call('get', '/health');
      console.log('[Appwrite] Connection validated successfully');
      return true;
    } catch (healthError) {
      console.error('[Appwrite] Health check failed:', healthError.message || healthError);
      return false;
    }
  } catch (error) {
    console.error('[Appwrite] Connection validation failed:', error.message || error);
    return false;
  }
}

module.exports = {
  client,
  databases,
  storage,
  account,
  users,
  functions,
  APPWRITE_CONFIG,
  isAppwriteConfigured,
  validateConnection
};
