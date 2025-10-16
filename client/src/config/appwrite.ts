import { Client, Account, Databases, Storage } from 'appwrite';

// Initialize Appwrite Client
const client = new Client();

client
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID || '');

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
