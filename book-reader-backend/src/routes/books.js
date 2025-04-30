// src/routes/books.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const { authMiddleware } = require('../middlewares/auth');
const { 
  uploadBook, 
  getAllBooks, 
  getBookById, 
  deleteBook 
} = require('../controllers/bookController');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

router.use(authMiddleware);
router.post('/upload', upload.single('book'), uploadBook);
router.get('/', getAllBooks);
router.get('/:id', getBookById);
router.delete('/:id', deleteBook);

module.exports = router;