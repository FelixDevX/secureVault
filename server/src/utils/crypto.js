const crypto = require('crypto');

/**
 * Encrypts a buffer with a password using AES-256-GCM.
 * @param {Buffer} buffer - Plaintext file buffer
 * @param {string} password - File-specific password
 * @returns {Object} { encryptedBuffer, salt, iv, authTag }
 */
const encrypt = (buffer, password) => {
  // Generate random salt and initialization vector (12 bytes is standard for GCM)
  const salt = crypto.randomBytes(32);
  const iv = crypto.randomBytes(12);

  // Derive a 256-bit (32-byte) key from the password and salt
  const key = crypto.scryptSync(password, salt, 32);

  // Create cipher
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);

  // Encrypt the buffer
  const encryptedBuffer = Buffer.concat([cipher.update(buffer), cipher.final()]);

  // Generate authentication tag
  const authTag = cipher.getAuthTag();

  return {
    encryptedBuffer,
    salt: salt.toString('hex'),
    iv: iv.toString('hex'),
    authTag: authTag.toString('hex')
  };
};

/**
 * Decrypts a buffer with a password using AES-256-GCM.
 * @param {Buffer} encryptedBuffer - Encrypted file buffer
 * @param {string} password - File-specific password
 * @param {string} salt - Hex encoded salt
 * @param {string} iv - Hex encoded IV
 * @param {string} authTag - Hex encoded Authentication Tag
 * @returns {Buffer} Decrypted plaintext file buffer
 */
const decrypt = (encryptedBuffer, password, salt, iv, authTag) => {
  const saltBuf = Buffer.from(salt, 'hex');
  const ivBuf = Buffer.from(iv, 'hex');
  const authTagBuf = Buffer.from(authTag, 'hex');

  // Derive the key using the same parameters
  const key = crypto.scryptSync(password, saltBuf, 32);

  // Create decipher
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, ivBuf);
  decipher.setAuthTag(authTagBuf);

  // Decrypt the buffer
  const decryptedBuffer = Buffer.concat([decipher.update(encryptedBuffer), decipher.final()]);

  return decryptedBuffer;
};

module.exports = {
  encrypt,
  decrypt
};
