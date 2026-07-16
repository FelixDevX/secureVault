const express    = require('express');
const cors       = require('cors');
const path       = require('path');
const authRoutes = require('./routes/authRoutes');
const fileRoutes = require('./routes/fileRoutes');

// Initialise Cloudinary at app startup — throws if credentials are missing
require('./config/cloudinary');

const app = express();

// Enable CORS for the React client
app.use(cors({
  origin:      process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve /uploads only for profile images (encrypted files are now on Cloudinary)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// API routes
app.use('/api', authRoutes);
app.use('/api', fileRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'SecureVault API is active and secure.' });
});

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: 'Endpoint not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

module.exports = app;
