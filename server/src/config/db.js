const mongoose = require('mongoose');

const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    console.error('');
    console.error('╔══════════════════════════════════════════════════════════════╗');
    console.error('║  ERROR: MONGODB_URI is not set in your .env file             ║');
    console.error('║                                                              ║');
    console.error('║  Please do one of the following:                             ║');
    console.error('║  1. Install MongoDB locally: https://www.mongodb.com/try/download/community');
    console.error('║  2. Use a free cloud cluster: https://www.mongodb.com/atlas  ║');
    console.error('║  3. Set MONGODB_URI=mongodb://localhost:27017/securevault    ║');
    console.error('║     in your server/.env file and start MongoDB service       ║');
    console.error('╚══════════════════════════════════════════════════════════════╝');
    console.error('');
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(mongoUri);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.error('Please verify your MONGODB_URI in server/.env and ensure MongoDB is running.');
    process.exit(1);
  }
};

module.exports = connectDB;
