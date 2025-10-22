import { Client, Account, Databases, Storage } from 'appwrite';

// Initialize Appwrite Client
const client = new Client();

// Use the NYC endpoint directly to avoid .env issues
const APPWRITE_ENDPOINT = import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://nyc.cloud.appwrite.io/v1';
const APPWRITE_PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID || '68e970330382476bf61';

// Simple configuration - The Dev Key approach is not needed and was causing errors
client
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(APPWRITE_PROJECT_ID);

// If needed, we can set additional headers instead of using dev key
if (typeof window !== 'undefined') {
  // Add SameSite cookie attribute for better security in development
  document.cookie = 'appwrite-cookie=appwrite; SameSite=Lax; secure=false; path=/;';
}

console.log('Appwrite client configured with:', { 
  APPWRITE_ENDPOINT, 
  APPWRITE_PROJECT_ID
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
