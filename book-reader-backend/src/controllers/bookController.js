// src/controllers/bookController.js
const { Book } = require('../models/book');
const { parseBook } = require('../utils/fileParser');

exports.uploadBook = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const bookData = await parseBook(req.file.path);
    const book = new Book({
      title: bookData.title,
      author: bookData.author,
      content: bookData.content,
      filePath: req.file.path,
      fileType: req.file.mimetype,
      uploadedBy: req.user.id
    });

    await book.save();
    res.status(201).json(book);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.findAll();
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.json(book);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteBook = async (req, res) => {
  try {
    const result = await Book.deleteById(req.params.id);
    if (!result) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};