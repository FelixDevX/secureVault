const express  = require('express');
const router   = express.Router();
const multer   = require('multer');
const { protect } = require('../middleware/auth');
const {
  uploadFile,
  getFiles,
  getFile,
  verifyPassword,
  downloadFile,
  deleteFile
} = require('../controllers/fileController');

// Allowed MIME types
const ALLOWED_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
  'image/jpeg',
  'image/jpg',
  'image/png',
  'application/zip',
  'application/x-zip-compressed',
  'application/octet-stream'  // some clients send this for .zip
];

// Multer — memory storage so we can encrypt the buffer before uploading to Cloudinary
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 20 * 1024 * 1024 // 20 MB
  },
  fileFilter: (req, file, cb) => {
    if (ALLOWED_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new multer.MulterError(
          'LIMIT_UNEXPECTED_FILE',
          `File type "${file.mimetype}" is not allowed. ` +
          'Allowed: pdf, doc, docx, txt, jpg, jpeg, png, zip'
        ),
        false
      );
    }
  }
});

// Multer error handler middleware
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ success: false, message: 'File size exceeds the 20MB limit' });
    }
    return res.status(400).json({ success: false, message: err.message });
  }
  next(err);
};

// Protected file routes
router.post('/upload',          protect, upload.single('file'), handleMulterError, uploadFile);
router.get('/files',            protect, getFiles);
router.get('/file/:id',         protect, getFile);
router.post('/verify-password', protect, verifyPassword);
router.get('/download/:id',     protect, downloadFile);
router.delete('/file/:id',      protect, deleteFile);

module.exports = router;
