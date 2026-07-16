const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type:     String,
      required: [true, 'Name is required'],
      trim:     true
    },
    email: {
      type:      String,
      required:  [true, 'Email is required'],
      unique:    true,
      lowercase: true,
      trim:      true,
      match:     [/^\S+@\S+\.\S+$/, 'Please provide a valid email address']
    },
    // Nullable for Google-only accounts
    password: {
      type:      String,
      minlength: [6, 'Password must be at least 6 characters'],
      default:   null
    },
    // Google OAuth fields
    googleId: {
      type:    String,
      default: null
    },
    provider: {
      type:    String,
      enum:    ['local', 'google'],
      default: 'local'
    },
    profileImage: {
      type:    String,
      default: ''
    }
  },
  {
    timestamps: true   // adds createdAt + updatedAt automatically
  }
);

// Hash password before saving — skip if no password (Google users)
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) {
    return next();
  }
  try {
    const salt    = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Compare password — returns false if user has no local password
userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
