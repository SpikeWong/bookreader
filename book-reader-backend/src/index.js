// src/index.js
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const authRoutes = require('./routes/auth');
const bookRoutes = require('./routes/books');

const app = express();
const upload = multer({ dest: 'uploads/' });

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});