// src/controllers/bookController.js
const fs = require('fs').promises;
const path = require('path');
const Book = require('../models/bookModel');
const Bookshelf = require('../models/bookshelfModel');
const config = require('../config');

/**
 * Upload a new book
 * @route POST /api/books
 */
exports.uploadBook = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { title, author, description } = req.body;
    const file = req.file;
    
    // Default values if not provided
    const bookTitle = title || path.parse(file.originalname).name;
    const bookAuthor = author || 'Unknown Author';
    
    // Extract file type
    const fileType = path.extname(file.originalname).substring(1).toLowerCase();
    
    // Create a book document
    const newBook = new Book({
      title: bookTitle,
      author: bookAuthor,
      description: description || `${bookTitle} by ${bookAuthor}`,
      filePath: file.path,
      fileType: fileType,
      content: '', // Will be populated by file parser utility
      uploadedBy: req.user.id,
      coverImage: '/assets/default-cover.jpg' // Default cover image
    });

    // Here you would use a file parser utility to extract content and word count
    // For now, we'll just use a placeholder wordCount
    newBook.wordCount = Math.floor(Math.random() * 50000) + 10000;
    
    await newBook.save();

    res.status(201).json({
      message: 'Book uploaded successfully',
      book: {
        id: newBook._id,
        title: newBook.title,
        author: newBook.author,
        description: newBook.description,
        coverImage: newBook.coverImage,
        fileType: newBook.fileType,
        wordCount: newBook.wordCount
      }
    });
  } catch (error) {
    console.error('Book upload error:', error);
    res.status(500).json({ error: error.message || 'Failed to upload book' });
  }
};

/**
 * Get all books
 * @route GET /api/books
 */
exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.find({})
      .select('title author description coverImage fileType wordCount createdAt')
      .sort({ createdAt: -1 });
    
    // Transform MongoDB documents to the expected format
    const formattedBooks = books.map(book => ({
      id: book._id,
      title: book.title,
      author: book.author,
      description: book.description,
      coverImage: book.coverImage,
      fileType: book.fileType,
      wordCount: book.wordCount,
      addedAt: book.createdAt
    }));

    res.json(formattedBooks);
  } catch (error) {
    console.error('Get all books error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch books' });
  }
};

/**
 * Get a book by ID
 * @route GET /api/books/:id
 */
exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    // Get user's reading progress if user is authenticated
    let progress = 0;
    if (req.user) {
      const bookshelfEntry = await Bookshelf.findOne({ 
        userId: req.user.id, 
        bookId: book._id 
      });
      
      if (bookshelfEntry) {
        progress = bookshelfEntry.progress;
      }
    }

    res.json({
      id: book._id,
      title: book.title,
      author: book.author,
      description: book.description,
      coverImage: book.coverImage,
      fileType: book.fileType,
      filePath: book.filePath,
      content: book.content,
      wordCount: book.wordCount,
      addedAt: book.createdAt,
      progress
    });
  } catch (error) {
    console.error('Get book by ID error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch book' });
  }
};

/**
 * Update a book
 * @route PUT /api/books/:id
 */
exports.updateBook = async (req, res) => {
  try {
    const { title, author, description } = req.body;
    const bookId = req.params.id;

    // Find the book and check if it exists
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    // Check if the user is the uploader of the book
    if (book.uploadedBy.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to update this book' });
    }

    // Update the book fields if provided
    if (title) book.title = title;
    if (author) book.author = author;
    if (description) book.description = description;

    await book.save();

    res.json({
      message: 'Book updated successfully',
      book: {
        id: book._id,
        title: book.title,
        author: book.author,
        description: book.description
      }
    });
  } catch (error) {
    console.error('Update book error:', error);
    res.status(500).json({ error: error.message || 'Failed to update book' });
  }
};

/**
 * Delete a book
 * @route DELETE /api/books/:id
 */
exports.deleteBook = async (req, res) => {
  try {
    const bookId = req.params.id;

    // Find the book and check if it exists
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    // Check if the user is the uploader of the book
    if (book.uploadedBy.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to delete this book' });
    }

    // Delete the physical file
    try {
      await fs.unlink(book.filePath);
    } catch (fileError) {
      console.error('Error deleting file:', fileError);
      // Continue even if file deletion fails
    }

    // Delete the book from the database
    await Book.findByIdAndDelete(bookId);

    // Delete all bookshelf entries related to this book
    await Bookshelf.deleteMany({ bookId });

    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    console.error('Delete book error:', error);
    res.status(500).json({ error: error.message || 'Failed to delete book' });
  }
};