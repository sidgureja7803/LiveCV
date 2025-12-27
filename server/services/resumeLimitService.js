const Resume = require('../models/Resume');
const appwriteService = require('./appwriteService');
const { APPWRITE_CONFIG } = require('../config/appwrite');

// Resume limit per user
const RESUME_LIMIT = 5;

/**
 * Get the count of resumes for a user
 * @param {string} userId - User ID (clerkId)
 * @returns {Promise<number>} Number of resumes
 */
async function getResumeCount(userId) {
  try {
    const count = await Resume.countDocuments({ clerkId: userId });
    return count;
  } catch (error) {
    console.error('[Resume Limit] Error getting resume count:', error);
    throw error;
  }
}

/**
 * Delete a resume and its associated files from storage
 * @param {string} resumeId - Resume ID
 * @returns {Promise<void>}
 */
async function deleteResumeWithFiles(resumeId) {
  try {
    // Find the resume
    const resume = await Resume.findById(resumeId);
    
    if (!resume) {
      console.warn(`[Resume Limit] Resume ${resumeId} not found, skipping deletion`);
      return;
    }
    
    // Delete PDF file from Appwrite storage if it exists
    if (resume.resumeFile && resume.resumeFile.fileId) {
      try {
        await appwriteService.deleteFile(APPWRITE_CONFIG.buckets.pdfs, resume.resumeFile.fileId);
        console.log(`[Resume Limit] Deleted PDF file ${resume.resumeFile.fileId} for resume ${resumeId}`);
      } catch (fileError) {
        // File may not exist in storage, log and continue
        console.warn(`[Resume Limit] Could not delete PDF file ${resume.resumeFile.fileId}:`, fileError.message);
      }
    }
    
    // Delete the resume document from database
    await Resume.findByIdAndDelete(resumeId);
    console.log(`[Resume Limit] Deleted resume ${resumeId} (${resume.title})`);
    
  } catch (error) {
    console.error(`[Resume Limit] Error deleting resume ${resumeId}:`, error);
    throw error;
  }
}

/**
 * Enforce resume limit for a user
 * Deletes oldest resumes if user has reached or exceeded the limit
 * @param {string} userId - User ID (clerkId)
 * @returns {Promise<Object>} Object with currentCount, limit, remaining, and deletedResumes
 */
async function enforceResumeLimit(userId) {
  try {
    // Get all resumes for the user, sorted by updatedAt (oldest first)
    const resumes = await Resume.find({ clerkId: userId })
      .sort({ updatedAt: 1 }) // Ascending order - oldest first
      .select('_id title updatedAt');
    
    const currentCount = resumes.length;
    const deletedResumes = [];
    
    // If user has reached or exceeded the limit, delete oldest resumes
    if (currentCount >= RESUME_LIMIT) {
      // Calculate how many resumes to delete to make room for the new one
      const deleteCount = currentCount - RESUME_LIMIT + 1;
      const resumesToDelete = resumes.slice(0, deleteCount);
      
      console.log(`[Resume Limit] User ${userId} has ${currentCount} resumes. Deleting ${deleteCount} oldest resume(s)...`);
      
      // Delete each resume
      for (const resume of resumesToDelete) {
        try {
          await deleteResumeWithFiles(resume._id.toString());
          deletedResumes.push({
            id: resume._id.toString(),
            title: resume.title,
            updatedAt: resume.updatedAt
          });
        } catch (deleteError) {
          console.error(`[Resume Limit] Failed to delete resume ${resume._id}:`, deleteError);
          // Continue with other deletions even if one fails
        }
      }
      
      console.log(`[Resume Limit] Successfully deleted ${deletedResumes.length} resume(s) for user ${userId}`);
    }
    
    // Calculate new counts after deletion
    const newCount = currentCount - deletedResumes.length;
    const remaining = Math.max(0, RESUME_LIMIT - newCount);
    
    return {
      currentCount: newCount,
      limit: RESUME_LIMIT,
      remaining,
      deletedResumes
    };
    
  } catch (error) {
    console.error('[Resume Limit] Error enforcing resume limit:', error);
    throw error;
  }
}

module.exports = {
  RESUME_LIMIT,
  getResumeCount,
  deleteResumeWithFiles,
  enforceResumeLimit
};
