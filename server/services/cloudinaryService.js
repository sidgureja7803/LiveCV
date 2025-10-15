const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const path = require('path');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Create storage engine
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'livecv-resumes',
    allowed_formats: ['pdf', 'doc', 'docx'],
    resource_type: 'raw',
    // Use filename as public_id to avoid duplicate files
    public_id: (req, file) => {
      const userId = req.clerkId || 'anonymous';
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const filename = file.originalname.split('.')[0];
      return `${userId}/${filename}-${uniqueSuffix}`;
    }
  }
});

// Initialize upload middleware
const uploadResume = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const filetypes = /pdf|doc|docx/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Error: Only PDF, DOC, or DOCX files are allowed!'));
    }
  }
}).single('resume');

/**
 * Upload a file to Cloudinary
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} Upload result with URL and public ID
 */
exports.uploadFile = (req, res) => {
  return new Promise((resolve, reject) => {
    uploadResume(req, res, (err) => {
      if (err) {
        return reject(err);
      }
      if (!req.file) {
        return reject(new Error('No file uploaded'));
      }
      
      resolve({
        url: req.file.path,
        publicId: req.file.filename
      });
    });
  });
};

/**
 * Delete a file from Cloudinary
 * @param {string} publicId - The public ID of the file to delete
 * @returns {Promise<Object>} Deletion result
 */
exports.deleteFile = async (publicId) => {
  try {
    return await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' });
  } catch (error) {
    console.error('Error deleting file from Cloudinary:', error);
    throw error;
  }
};

module.exports = {
  uploadFile: exports.uploadFile,
  deleteFile: exports.deleteFile,
  uploadResume
};
