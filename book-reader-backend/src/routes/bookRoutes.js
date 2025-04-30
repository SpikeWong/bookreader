// src/routes/bookRoutes.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const bookController = require('../controllers/bookController');
const { authenticateUser } = require('../middleware/auth');
const config = require('../config');

const router = express.Router();

// Ensure uploads directory exists
const uploadsDir = config.uploadsPath;
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueId = uuidv4();
    const fileExtension = path.extname(file.originalname);
    cb(null, `${uniqueId}${fileExtension}`);
  }
});

// File filter function to accept only epub, pdf, txt, html files
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['application/epub+zip', 'application/pdf', 'text/plain', 'text/html'];
  const allowedExtensions = ['.epub', '.pdf', '.txt', '.html'];
  
  const fileExtension = path.extname(file.originalname).toLowerCase();
  
  if (allowedTypes.includes(file.mimetype) || allowedExtensions.includes(fileExtension)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only EPUB, PDF, TXT, and HTML files are allowed.'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

// Public routes
router.get('/', bookController.getAllBooks);
router.get('/:id', bookController.getBookById);

// Protected routes
router.post('/', 
  authenticateUser,
  upload.single('book'),
  bookController.uploadBook
);

router.put('/:id', 
  authenticateUser,
  bookController.updateBook
);

router.delete('/:id', 
  authenticateUser,
  bookController.deleteBook
);

module.exports = router;