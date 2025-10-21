const multer = require('multer');
const path = require('path');

// Configure memory storage for multer (files stored in memory as buffers)
const storage = multer.memoryStorage();

// Create multer upload middleware
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB file size limit
  },
  fileFilter: (req, file, cb) => {
    // Define allowed file extensions
    const allowedFileTypes = ['.pdf', '.doc', '.docx'];
    const ext = path.extname(file.originalname).toLowerCase();
    
    if (!allowedFileTypes.includes(ext)) {
      return cb(new Error('Only PDF, DOC, and DOCX files are allowed'));
    }
    
    cb(null, true);
  }
});

module.exports = {
  resumeUpload: upload.single('file')
};
