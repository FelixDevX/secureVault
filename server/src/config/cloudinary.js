const cloudinary = require('cloudinary').v2;

// Validate required environment variables at startup
const required = ['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'];
const missing = required.filter((key) => !process.env[key]);

if (missing.length > 0) {
  throw new Error(
    `Cloudinary configuration error: Missing environment variables: ${missing.join(', ')}.\n` +
    'Please set them in your server/.env file.'
  );
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure:     true
});

/**
 * Upload a Buffer directly to Cloudinary as a raw resource.
 * @param {Buffer} buffer       - The file buffer to upload
 * @param {string} publicId     - Cloudinary public_id (e.g. "securevault/files/encrypted-xxx.enc")
 * @returns {Promise<Object>}   - Cloudinary upload result
 */
const uploadBufferToCloudinary = (buffer, publicId) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'raw',
        public_id:     publicId,
        overwrite:     false,
        invalidate:    true
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    stream.end(buffer);
  });
};

/**
 * Delete a raw resource from Cloudinary by its public_id.
 * @param {string} publicId - The public_id stored in MongoDB
 * @returns {Promise<Object>}
 */
const deleteFromCloudinary = (publicId) => {
  return cloudinary.uploader.destroy(publicId, { resource_type: 'raw', invalidate: true });
};

module.exports = { cloudinary, uploadBufferToCloudinary, deleteFromCloudinary };
