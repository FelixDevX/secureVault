const { OAuth2Client } = require('google-auth-library');
const jwt  = require('jsonwebtoken');
const User = require('../models/User');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Helper — identical to the one in authController
const signToken = (id) =>
  jwt.sign(
    { id },
    process.env.JWT_SECRET || 'securevault_default_secret_key_2026_dev_mode',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Verify Google ID token → create or link account → return JWT
// @route   POST /api/auth/google
// @access  Public
// ─────────────────────────────────────────────────────────────────────────────
const googleAuth = async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({ success: false, message: 'Google credential token is required' });
    }

    if (!process.env.GOOGLE_CLIENT_ID) {
      console.error('GOOGLE_CLIENT_ID is not set in environment variables');
      return res.status(500).json({ success: false, message: 'Google authentication is not configured on this server' });
    }

    // Verify the ID token with Google's public keys — never trust client-side data
    let payload;
    try {
      const ticket = await client.verifyIdToken({
        idToken:  credential,
        audience: process.env.GOOGLE_CLIENT_ID
      });
      payload = ticket.getPayload();
    } catch (verifyErr) {
      console.error('Google token verification failed:', verifyErr.message);
      return res.status(401).json({ success: false, message: 'Invalid or expired Google token. Please try again.' });
    }

    const { sub: googleId, email, name, picture } = payload;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Could not retrieve email from Google account' });
    }

    // ── Find or create user ────────────────────────────────────────────────
    let user = await User.findOne({ email });

    if (user) {
      // Existing account — link Google if not already linked
      if (!user.googleId) {
        user.googleId     = googleId;
        user.provider     = user.password ? user.provider : 'google'; // keep 'local' if they have a password
        user.profileImage = user.profileImage || picture || '';
        await user.save();
      }
    } else {
      // New user — create Google-only account (no password)
      user = await User.create({
        name,
        email,
        googleId,
        provider:     'google',
        profileImage: picture || '',
        password:     null
      });
    }

    // Issue the same JWT used by email/password login
    const token = signToken(user._id);

    return res.status(200).json({
      success: true,
      token,
      user: {
        id:           user._id,
        name:         user.name,
        email:        user.email,
        profileImage: user.profileImage,
        provider:     user.provider,
        createdAt:    user.createdAt
      }
    });
  } catch (error) {
    console.error('Google auth error:', error);
    return res.status(500).json({ success: false, message: 'Server error during Google authentication' });
  }
};

module.exports = { googleAuth };
