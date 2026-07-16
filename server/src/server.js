// Load environment variables
require('dotenv').config();

const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  // Connect to Database (with automatic local in-memory fallback)
  await connectDB();

  const server = app.listen(PORT, () => {
    console.log(`SecureVault server listening on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode.`);
  });

  // Handle promise rejections gracefully
  process.on('unhandledRejection', (err, promise) => {
    console.error(`Unhandled Rejection: ${err.message}`);
    // Close server and exit
    server.close(() => process.exit(1));
  });
};

startServer();
