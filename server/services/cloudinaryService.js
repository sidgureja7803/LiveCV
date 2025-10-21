const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const path = require('path');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

/**
 * Configure Cloudinary storage for multer
 */
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'livecv-resumes',
    allowed_formats: ['pdf', 'doc', 'docx'],
    resource_type: 'raw'
  }
});

// Multer upload configuration for files
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB file size limit
  },
  fileFilter: (req, file, cb) => {
    const allowedFileTypes = ['.pdf', '.doc', '.docx'];
    const ext = path.extname(file.originalname).toLowerCase();
    
    if (!allowedFileTypes.includes(ext)) {
      return cb(new Error('Only PDF, DOC, and DOCX files are allowed'));
    }
    
    cb(null, true);
  }
});

/**
 * Upload a file to Cloudinary
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} Upload result object
 */
exports.uploadFile = (req, res) => {
  return new Promise((resolve, reject) => {
    // Use multer middleware to process the upload
    upload.single('file')(req, res, (err) => {
      if (err) {
        return reject(err);
      }
      
      if (!req.file) {
        return reject(new Error('No file uploaded'));
      }
      
      // Return the result with Cloudinary URL and public ID
      resolve({
        url: req.file.path,
        publicId: req.file.filename,
        originalName: req.file.originalname
      });
    });
  });
};

/**
 * Delete a file from Cloudinary by public ID
 * @param {string} publicId - Cloudinary public ID
 * @returns {Promise<Object>} Delete result
 */
exports.deleteFile = async (publicId) => {
  return await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' });
};

/**
 * Upload an image to Cloudinary
 * @param {string} base64Image - Base64 encoded image
 * @param {string} folder - Folder to upload to
 * @returns {Promise<Object>} Upload result
 */
exports.uploadImage = async (base64Image, folder = 'livecv-images') => {
  try {
    const result = await cloudinary.uploader.upload(base64Image, {
      folder: folder,
      resource_type: 'image'
    });
    
    return {
      url: result.secure_url,
      publicId: result.public_id
    };
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error);
    throw error;
  }
};

/**
 * Delete an image from Cloudinary by public ID
 * @param {string} publicId - Cloudinary public ID
 * @returns {Promise<Object>} Delete result
 */
exports.deleteImage = async (publicId) => {
  return await cloudinary.uploader.destroy(publicId);
};
