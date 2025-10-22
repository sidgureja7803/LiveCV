import { Client, Account, Databases, Storage } from 'appwrite';

// Initialize Appwrite Client
const client = new Client();

// Use the NYC endpoint directly to avoid .env issues
const APPWRITE_ENDPOINT = import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://nyc.cloud.appwrite.io/v1';
const APPWRITE_PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID || '';
// Get Dev Key from environment variable or set directly for testing
// Replace this with your actual Dev Key from Appwrite console
const APPWRITE_DEV_KEY = import.meta.env.VITE_APPWRITE_DEV_KEY || '';
// Configure client with Dev Key for bypass rate limits and CORS during development
client
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(APPWRITE_PROJECT_ID);

// Add Dev Key to bypass rate limits and CORS during development
// Note: Using type assertion since TypeScript definitions might not include setDevKey
try {
  // @ts-ignore - The Dev Key method exists in the latest Appwrite SDK but TypeScript definitions might be outdated
  (client as any).setDevKey(APPWRITE_DEV_KEY);
} catch (err) {
  console.error('Failed to set Dev Key:', err);
}

console.log('Appwrite client configured with:', { 
  APPWRITE_ENDPOINT, 
  APPWRITE_PROJECT_ID,
  devKeyConfigured: !!APPWRITE_DEV_KEY
});

// Initialize Appwrite Services
export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

// Appwrite Configuration Constants
export const APPWRITE_CONFIG = {
  databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID || 'livecv-production',
  collections: {
    users: 'users',
    resumes: 'resumes',
    templates: 'templates',
    atsScores: 'ats_scores',
    jobMatches: 'job_matches'
  },
  buckets: {
    pdfs: 'resume-pdfs',
    yamls: 'resume-yamls',
    avatars: 'user-avatars',
    templates: 'template-files'
  }
};

export default client;
