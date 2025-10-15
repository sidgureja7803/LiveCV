const { databases, storage, APPWRITE_CONFIG, isAppwriteConfigured } = require('../config/appwrite');
const { ID, Query, Permission, Role } = require('node-appwrite');
const fs = require('fs').promises;

/**
 * Appwrite service for resume persistence
 * Handles database operations and storage for YAML/PDF files
 */

/**
 * Save resume metadata to Appwrite database
 * @param {Object} resumeData - Resume data
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Created document
 */
async function saveResumeMetadata(resumeData, userId) {
  if (!isAppwriteConfigured()) {
    throw new Error('Appwrite is not configured');
  }
  
  try {
    const document = await databases.createDocument(
      APPWRITE_CONFIG.databaseId,
      APPWRITE_CONFIG.collections.resumes,
      ID.unique(),
      {
        userId,
        name: resumeData.personalInfo?.fullName || 'Untitled Resume',
        theme: resumeData.rendercvTheme || 'classic',
        yamlContent: resumeData.yamlContent || null,
        lastPdfUrl: resumeData.lastPdfMetadata?.url || null,
        lastPdfFileSize: resumeData.lastPdfMetadata?.fileSize || 0,
        contentHash: resumeData.lastPdfMetadata?.contentHash || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      [
        Permission.read(Role.user(userId)),
        Permission.update(Role.user(userId)),
        Permission.delete(Role.user(userId))
      ]
    );
    
    return document;
  } catch (error) {
    console.error('[Appwrite] Error saving resume metadata:', error);
    throw error;
  }
}

/**
 * Update resume metadata
 * @param {string} documentId - Document ID
 * @param {Object} updates - Fields to update
 * @returns {Promise<Object>} Updated document
 */
async function updateResumeMetadata(documentId, updates) {
  if (!isAppwriteConfigured()) {
    throw new Error('Appwrite is not configured');
  }
  
  try {
    const document = await databases.updateDocument(
      APPWRITE_CONFIG.databaseId,
      APPWRITE_CONFIG.collections.resumes,
      documentId,
      {
        ...updates,
        updatedAt: new Date().toISOString()
      }
    );
    
    return document;
  } catch (error) {
    console.error('[Appwrite] Error updating resume metadata:', error);
    throw error;
  }
}

/**
 * Get resume metadata by ID
 * @param {string} documentId - Document ID
 * @returns {Promise<Object>} Document
 */
async function getResumeMetadata(documentId) {
  if (!isAppwriteConfigured()) {
    throw new Error('Appwrite is not configured');
  }
  
  try {
    const document = await databases.getDocument(
      APPWRITE_CONFIG.databaseId,
      APPWRITE_CONFIG.collections.resumes,
      documentId
    );
    
    return document;
  } catch (error) {
    console.error('[Appwrite] Error getting resume metadata:', error);
    throw error;
  }
}

/**
 * List resumes for a user
 * @param {string} userId - User ID
 * @returns {Promise<Array>} List of documents
 */
async function listUserResumes(userId) {
  if (!isAppwriteConfigured()) {
    throw new Error('Appwrite is not configured');
  }
  
  try {
    const response = await databases.listDocuments(
      APPWRITE_CONFIG.databaseId,
      APPWRITE_CONFIG.collections.resumes,
      [
        Query.equal('userId', userId),
        Query.orderDesc('updatedAt'),
        Query.limit(100)
      ]
    );
    
    return response.documents;
  } catch (error) {
    console.error('[Appwrite] Error listing resumes:', error);
    throw error;
  }
}

/**
 * Delete resume metadata
 * @param {string} documentId - Document ID
 * @returns {Promise<void>}
 */
async function deleteResumeMetadata(documentId) {
  if (!isAppwriteConfigured()) {
    throw new Error('Appwrite is not configured');
  }
  
  try {
    await databases.deleteDocument(
      APPWRITE_CONFIG.databaseId,
      APPWRITE_CONFIG.collections.resumes,
      documentId
    );
  } catch (error) {
    console.error('[Appwrite] Error deleting resume metadata:', error);
    throw error;
  }
}

/**
 * Upload PDF to Appwrite Storage
 * @param {Buffer} pdfBuffer - PDF buffer
 * @param {string} fileName - File name
 * @param {string} userId - User ID for permissions
 * @returns {Promise<Object>} File metadata
 */
async function uploadPDF(pdfBuffer, fileName, userId) {
  if (!isAppwriteConfigured()) {
    throw new Error('Appwrite is not configured');
  }
  
  try {
    // Write buffer to temporary file
    const tempPath = `/tmp/${fileName}`;
    await fs.writeFile(tempPath, pdfBuffer);
    
    // Upload to storage
    const file = await storage.createFile(
      APPWRITE_CONFIG.buckets.pdfs,
      ID.unique(),
      tempPath,
      [
        Permission.read(Role.user(userId)),
        Permission.delete(Role.user(userId))
      ]
    );
    
    // Clean up temp file
    await fs.unlink(tempPath).catch(() => {});
    
    return {
      fileId: file.$id,
      fileName: file.name,
      fileSize: file.sizeOriginal,
      mimeType: file.mimeType,
      url: `${process.env.APPWRITE_ENDPOINT}/storage/buckets/${APPWRITE_CONFIG.buckets.pdfs}/files/${file.$id}/view`
    };
  } catch (error) {
    console.error('[Appwrite] Error uploading PDF:', error);
    throw error;
  }
}

/**
 * Upload YAML to Appwrite Storage
 * @param {string} yamlContent - YAML content
 * @param {string} fileName - File name
 * @param {string} userId - User ID for permissions
 * @returns {Promise<Object>} File metadata
 */
async function uploadYAML(yamlContent, fileName, userId) {
  if (!isAppwriteConfigured()) {
    throw new Error('Appwrite is not configured');
  }
  
  try {
    // Write to temporary file
    const tempPath = `/tmp/${fileName}`;
    await fs.writeFile(tempPath, yamlContent, 'utf8');
    
    // Upload to storage
    const file = await storage.createFile(
      APPWRITE_CONFIG.buckets.yamls,
      ID.unique(),
      tempPath,
      [
        Permission.read(Role.user(userId)),
        Permission.delete(Role.user(userId))
      ]
    );
    
    // Clean up temp file
    await fs.unlink(tempPath).catch(() => {});
    
    return {
      fileId: file.$id,
      fileName: file.name,
      fileSize: file.sizeOriginal,
      url: `${process.env.APPWRITE_ENDPOINT}/storage/buckets/${APPWRITE_CONFIG.buckets.yamls}/files/${file.$id}/view`
    };
  } catch (error) {
    console.error('[Appwrite] Error uploading YAML:', error);
    throw error;
  }
}

/**
 * Download file from storage
 * @param {string} bucketId - Bucket ID
 * @param {string} fileId - File ID
 * @returns {Promise<Buffer>} File buffer
 */
async function downloadFile(bucketId, fileId) {
  if (!isAppwriteConfigured()) {
    throw new Error('Appwrite is not configured');
  }
  
  try {
    const file = await storage.getFileDownload(bucketId, fileId);
    return Buffer.from(file);
  } catch (error) {
    console.error('[Appwrite] Error downloading file:', error);
    throw error;
  }
}

/**
 * Delete file from storage
 * @param {string} bucketId - Bucket ID
 * @param {string} fileId - File ID
 * @returns {Promise<void>}
 */
async function deleteFile(bucketId, fileId) {
  if (!isAppwriteConfigured()) {
    throw new Error('Appwrite is not configured');
  }
  
  try {
    await storage.deleteFile(bucketId, fileId);
  } catch (error) {
    console.error('[Appwrite] Error deleting file:', error);
    throw error;
  }
}

module.exports = {
  saveResumeMetadata,
  updateResumeMetadata,
  getResumeMetadata,
  listUserResumes,
  deleteResumeMetadata,
  uploadPDF,
  uploadYAML,
  downloadFile,
  deleteFile
};
