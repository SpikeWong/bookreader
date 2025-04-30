// Configuration file for the book reader application
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

// Export all configuration variables
module.exports = {
  port: process.env.PORT || 3000,
  mongoURI: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
  jwtExpire: process.env.JWT_EXPIRE || '24h',
  uploadsPath: process.env.UPLOADS_PATH || path.join(__dirname, '../../uploads'),
  environment: process.env.NODE_ENV || 'development'
};