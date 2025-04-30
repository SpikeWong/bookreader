// src/index.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const { connectDB } = require('./config/database');
const config = require('./config');

// Import routes
const authRoutes = require('./routes/authRoutes');
const bookRoutes = require('./routes/bookRoutes');
const bookshelfRoutes = require('./routes/bookshelfRoutes');
const { optionalAuth } = require('./middleware/auth');

// Initialize express app
const app = express();

// Connect to MongoDB
connectDB().catch(err => {
  console.error('Failed to connect to MongoDB:', err);
  process.exit(1);
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(config.uploadsPath));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/books', optionalAuth, bookRoutes); // Use optional auth for books to get user progress
app.use('/api/bookshelf', bookshelfRoutes);

// Handle production deployment
if (config.environment === 'production') {
  // Serve static assets if in production
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

// Start server
const PORT = config.port;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});