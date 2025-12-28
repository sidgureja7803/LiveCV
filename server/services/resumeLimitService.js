const Resume = require('../models/Resume');
const appwriteService = require('./appwriteService');
const { APPWRITE_CONFIG } = require('../config/appwrite');
const logger = require('../utils/logger');

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
    logger.debug('Resume count retrieved', { userId, count });
    return count;
  } catch (error) {
    logger.error('Error getting resume count', { userId, error: error.message });
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
      logger.warn('Resume not found for deletion', { resumeId });
      return;
    }
    
    // Delete PDF file from Appwrite storage if it exists
    if (resume.resumeFile && resume.resumeFile.fileId) {
      try {
        await appwriteService.deleteFile(APPWRITE_CONFIG.buckets.pdfs, resume.resumeFile.fileId);
        logger.info('Deleted PDF file from storage', { 
          resumeId, 
          fileId: resume.resumeFile.fileId 
        });
      } catch (fileError) {
        // File may not exist in storage, log and continue
        logger.warn('Could not delete PDF file from storage', { 
          resumeId, 
          fileId: resume.resumeFile.fileId,
          error: fileError.message 
        });
      }
    }
    
    // Delete the resume document from database
    await Resume.findByIdAndDelete(resumeId);
    logger.info('Deleted resume from database', { 
      resumeId, 
      title: resume.title 
    });
    
  } catch (error) {
    logger.error('Error deleting resume with files', { 
      resumeId, 
      error: error.message 
    });
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
      
      logger.logResumeLimitEnforcement(userId, 'deleting_oldest_resumes', {
        currentCount,
        deleteCount,
        limit: RESUME_LIMIT
      });
      
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
          logger.error('Failed to delete resume during limit enforcement', {
            userId,
            resumeId: resume._id.toString(),
            error: deleteError.message
          });
          // Continue with other deletions even if one fails
        }
      }
      
      logger.logResumeLimitEnforcement(userId, 'deletion_complete', {
        deletedCount: deletedResumes.length,
        deletedResumes: deletedResumes.map(r => ({ id: r.id, title: r.title }))
      });
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
    logger.error('Error enforcing resume limit', { 
      userId, 
      error: error.message 
    });
    throw error;
  }
}

module.exports = {
  RESUME_LIMIT,
  getResumeCount,
  deleteResumeWithFiles,
  enforceResumeLimit
};
