const { Client, Databases, Storage, Account } = require('node-appwrite');

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

// Appwrite configuration constants
const APPWRITE_CONFIG = {
  databaseId: process.env.APPWRITE_DATABASE_ID || 'livecv-db',
  collections: {
    resumes: process.env.APPWRITE_COLLECTION_RESUMES || 'resumes',
    users: process.env.APPWRITE_COLLECTION_USERS || 'users'
  },
  buckets: {
    pdfs: process.env.APPWRITE_BUCKET_PDFS || 'resume-pdfs',
    yamls: process.env.APPWRITE_BUCKET_YAMLS || 'resume-yamls'
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
    
    // Try to list databases to verify connection
    await databases.list();
    console.log('[Appwrite] Connection validated successfully');
    return true;
  } catch (error) {
    console.error('[Appwrite] Connection validation failed:', error.message);
    return false;
  }
}

module.exports = {
  client,
  databases,
  storage,
  account,
  APPWRITE_CONFIG,
  isAppwriteConfigured,
  validateConnection
};
