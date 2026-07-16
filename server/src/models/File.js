const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  owner: {
    type:     mongoose.Schema.Types.ObjectId,
    ref:      'User',
    required: true
  },
  // Display name (original or user-supplied custom name)
  originalFileName: {
    type:     String,
    required: true,
    trim:     true
  },
  // The unique encrypted filename used as Cloudinary public_id leaf
  encryptedFileName: {
    type:     String,
    required: true
  },
  // Cloudinary public_id — used for precise deletion (e.g. "securevault/files/encrypted-xxx.enc")
  cloudinaryPublicId: {
    type:    String,
    default: ''
  },
  // MIME type of the original file
  fileType: {
    type:     String,
    required: true
  },
  // Original file size in bytes (before encryption)
  fileSize: {
    type:     Number,
    required: true
  },
  // Cloudinary secure_url (https) or local path (/uploads/...) for fallback
  storageUrl: {
    type:     String,
    required: true
  },
  // bcrypt hash of the file-specific password
  passwordHash: {
    type:     String,
    required: true
  },
  // AES-256-GCM cryptographic parameters (hex-encoded)
  encryptionSalt: {
    type:     String,
    required: true
  },
  encryptionIv: {
    type:     String,
    required: true
  },
  encryptionTag: {
    type:     String,
    required: true
  },
  uploadDate: {
    type:    Date,
    default: Date.now
  }
});

const File = mongoose.model('File', fileSchema);

module.exports = File;
