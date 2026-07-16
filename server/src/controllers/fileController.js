const File        = require('../models/File');
const cryptoUtils = require('../utils/crypto');
const bcrypt      = require('bcryptjs');
const axios       = require('axios');
const path        = require('path');
const {
  uploadBufferToCloudinary,
  deleteFromCloudinary
} = require('../config/cloudinary');

// Cloudinary folder for all encrypted files
const CLOUDINARY_FOLDER = 'securevault/files';

// ──────────────────────────────────────────────────────────────────────────────
// @desc    Upload & encrypt file → store encrypted blob on Cloudinary
// @route   POST /api/upload
// @access  Private
// ──────────────────────────────────────────────────────────────────────────────
const uploadFile = async (req, res) => {
  try {
    const { password, fileName } = req.body;

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    if (!password) {
      return res.status(400).json({
        success:  false,
        message:  'A file password is required to encrypt this file'
      });
    }

    // 1. Encrypt the raw file buffer in-memory (never written to disk)
    const { encryptedBuffer, salt, iv, authTag } = cryptoUtils.encrypt(req.file.buffer, password);

    // 2. Hash the password for future verification
    const passwordHash = await bcrypt.hash(password, 10);

    // 3. Build display name (custom or original)
    const fileExtension   = path.extname(req.file.originalname);
    let   finalFileName   = (fileName && fileName.trim() !== '')
                              ? fileName.trim()
                              : req.file.originalname;
    if (fileExtension && !finalFileName.endsWith(fileExtension)) {
      finalFileName += fileExtension;
    }

    // 4. Build unique Cloudinary public_id
    const uniqueSuffix    = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const encryptedFileName = `encrypted-${uniqueSuffix}.enc`;
    const cloudinaryPublicId = `${CLOUDINARY_FOLDER}/${encryptedFileName}`;

    // 5. Upload encrypted buffer to Cloudinary (resource_type: raw)
    let uploadResult;
    try {
      uploadResult = await uploadBufferToCloudinary(encryptedBuffer, cloudinaryPublicId);
    } catch (cloudinaryErr) {
      console.error('Cloudinary upload error:', cloudinaryErr);
      return res.status(502).json({
        success: false,
        message: 'Failed to upload file to cloud storage. Please try again.'
      });
    }

    // 6. Persist file metadata + crypto params to MongoDB
    const file = await File.create({
      owner:              req.user._id,
      originalFileName:   finalFileName,
      encryptedFileName,
      cloudinaryPublicId: uploadResult.public_id,
      fileType:           req.file.mimetype,
      fileSize:           req.file.size,
      storageUrl:         uploadResult.secure_url,
      passwordHash,
      encryptionSalt:     salt,
      encryptionIv:       iv,
      encryptionTag:      authTag
    });

    return res.status(201).json({
      success: true,
      message: 'File uploaded and encrypted successfully',
      file: {
        id:               file._id,
        originalFileName: file.originalFileName,
        fileType:         file.fileType,
        fileSize:         file.fileSize,
        uploadDate:       file.uploadDate
      }
    });
  } catch (error) {
    console.error('Upload file error:', error);
    return res.status(500).json({ success: false, message: 'Server error during file upload' });
  }
};

// ──────────────────────────────────────────────────────────────────────────────
// @desc    Get all files owned by the requesting user (safe metadata only)
// @route   GET /api/files
// @access  Private
// ──────────────────────────────────────────────────────────────────────────────
const getFiles = async (req, res) => {
  try {
    const files = await File
      .find({ owner: req.user.id })
      .select('originalFileName fileType fileSize uploadDate')
      .sort({ uploadDate: -1 });

    return res.status(200).json({ success: true, files });
  } catch (error) {
    console.error('Get files error:', error);
    return res.status(500).json({ success: false, message: 'Server error retrieving files' });
  }
};

// ──────────────────────────────────────────────────────────────────────────────
// @desc    Get single file metadata (safe — no URLs or crypto params exposed)
// @route   GET /api/file/:id
// @access  Private
// ──────────────────────────────────────────────────────────────────────────────
const getFile = async (req, res) => {
  try {
    const file = await File
      .findOne({ _id: req.params.id, owner: req.user.id })
      .select('originalFileName fileType fileSize uploadDate');

    if (!file) {
      return res.status(404).json({ success: false, message: 'File not found or unauthorized' });
    }

    return res.status(200).json({ success: true, file });
  } catch (error) {
    console.error('Get file error:', error);
    return res.status(500).json({ success: false, message: 'Server error retrieving file' });
  }
};

// ──────────────────────────────────────────────────────────────────────────────
// @desc    Verify file password without decrypting
// @route   POST /api/verify-password
// @access  Private
// ──────────────────────────────────────────────────────────────────────────────
const verifyPassword = async (req, res) => {
  try {
    const { fileId, password } = req.body;

    if (!fileId || !password) {
      return res.status(400).json({ success: false, message: 'Please provide fileId and password' });
    }

    const file = await File.findOne({ _id: fileId, owner: req.user.id });
    if (!file) {
      return res.status(404).json({ success: false, message: 'File not found' });
    }

    const isMatch = await bcrypt.compare(password, file.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Incorrect Password' });
    }

    return res.status(200).json({ success: true, message: 'Password verified successfully' });
  } catch (error) {
    console.error('Verify password error:', error);
    return res.status(500).json({ success: false, message: 'Server error verifying password' });
  }
};

// ──────────────────────────────────────────────────────────────────────────────
// @desc    Decrypt & stream file to client after password verification
// @route   GET /api/download/:id
// @access  Private
// ──────────────────────────────────────────────────────────────────────────────
const downloadFile = async (req, res) => {
  try {
    const fileId   = req.params.id;
    const password = req.headers['x-file-password'];

    if (!password) {
      return res.status(400).json({
        success: false,
        message: 'File password is required (x-file-password header)'
      });
    }

    // Ownership check
    const file = await File.findOne({ _id: fileId, owner: req.user.id });
    if (!file) {
      return res.status(404).json({ success: false, message: 'File not found or unauthorized' });
    }

    // Password verification
    const isMatch = await bcrypt.compare(password, file.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Incorrect Password' });
    }

    // Fetch encrypted blob from Cloudinary using the stored secure_url
    let encryptedBuffer;
    try {
      const response = await axios.get(file.storageUrl, { responseType: 'arraybuffer' });
      encryptedBuffer = Buffer.from(response.data);
    } catch (fetchErr) {
      console.error('Failed to fetch encrypted file from Cloudinary:', fetchErr.message);
      return res.status(502).json({
        success: false,
        message: 'Could not retrieve file from cloud storage. Please try again.'
      });
    }

    // Decrypt in memory
    const decryptedBuffer = cryptoUtils.decrypt(
      encryptedBuffer,
      password,
      file.encryptionSalt,
      file.encryptionIv,
      file.encryptionTag
    );

    // Stream decrypted file back to client
    res.setHeader('Content-Type',        file.fileType);
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(file.originalFileName)}"`);
    res.setHeader('Content-Length',      decryptedBuffer.length);

    return res.send(decryptedBuffer);
  } catch (error) {
    console.error('Download file error:', error);
    return res.status(500).json({ success: false, message: 'Server error decrypting or downloading file' });
  }
};

// ──────────────────────────────────────────────────────────────────────────────
// @desc    Delete file — removes from Cloudinary AND MongoDB
// @route   DELETE /api/file/:id
// @access  Private
// ──────────────────────────────────────────────────────────────────────────────
const deleteFile = async (req, res) => {
  try {
    const file = await File.findOne({ _id: req.params.id, owner: req.user.id });
    if (!file) {
      return res.status(404).json({ success: false, message: 'File not found or unauthorized' });
    }

    // Delete from Cloudinary using the stored public_id
    const publicId = file.cloudinaryPublicId || `${CLOUDINARY_FOLDER}/${file.encryptedFileName}`;
    try {
      await deleteFromCloudinary(publicId);
    } catch (cloudinaryErr) {
      // Log but do not block DB deletion — the user should still be able to remove the record
      console.error('Cloudinary deletion warning:', cloudinaryErr.message);
    }

    // Delete MongoDB record
    await file.deleteOne();

    return res.status(200).json({ success: true, message: 'File deleted successfully' });
  } catch (error) {
    console.error('Delete file error:', error);
    return res.status(500).json({ success: false, message: 'Server error during file deletion' });
  }
};

module.exports = {
  uploadFile,
  getFiles,
  getFile,
  verifyPassword,
  downloadFile,
  deleteFile
};
