import { account } from '../config/appwrite';

/**
 * Utility function to clear all Appwrite sessions
 * Use this if you're seeing authentication issues
 */
export const clearAllSessions = async () => {
  try {
    // Try to delete all sessions
    await account.deleteSessions();
    console.log('All sessions cleared successfully');
    
    // Clear localStorage
    localStorage.clear();
    
    // Clear sessionStorage
    sessionStorage.clear();
    
    // Reload the page
    window.location.href = '/';
  } catch (error: any) {
    console.error('Error clearing sessions:', error.message);
    
    // Even if the API call fails, clear local storage
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = '/';
  }
};

// Add to window object for easy access in console
if (typeof window !== 'undefined') {
  (window as any).clearAllSessions = clearAllSessions;
}
