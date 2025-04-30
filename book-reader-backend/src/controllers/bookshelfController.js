// src/controllers/bookshelfController.js
const Book = require('../models/bookModel');
const Bookshelf = require('../models/bookshelfModel');

/**
 * Add a book to the user's bookshelf or update if already exists
 * @route POST /api/bookshelf
 */
exports.addToBookshelf = async (req, res) => {
  try {
    const { bookId, progress, isFavorite, notes } = req.body;
    const userId = req.user.id;

    // Validate book existence
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    // Check if book already in bookshelf
    let bookshelfEntry = await Bookshelf.findOne({ userId, bookId });

    if (bookshelfEntry) {
      // Update existing entry
      if (progress !== undefined) bookshelfEntry.progress = progress;
      if (isFavorite !== undefined) bookshelfEntry.isFavorite = isFavorite;
      if (notes !== undefined) bookshelfEntry.notes = notes;

      bookshelfEntry.lastRead = new Date();
      await bookshelfEntry.save();
    } else {
      // Create new entry
      bookshelfEntry = new Bookshelf({
        userId,
        bookId,
        progress: progress || 0,
        isFavorite: isFavorite || false,
        notes: notes || '',
        lastRead: new Date()
      });

      await bookshelfEntry.save();
    }

    res.status(200).json({
      message: 'Book added to bookshelf successfully',
      bookshelf: {
        id: bookshelfEntry._id,
        bookId: bookshelfEntry.bookId,
        progress: bookshelfEntry.progress,
        isFavorite: bookshelfEntry.isFavorite,
        notes: bookshelfEntry.notes,
        lastRead: bookshelfEntry.lastRead
      }
    });
  } catch (error) {
    console.error('Add to bookshelf error:', error);
    res.status(500).json({ error: error.message || 'Failed to add book to bookshelf' });
  }
};

/**
 * Get all books in user's bookshelf
 * @route GET /api/bookshelf
 */
exports.getUserBookshelf = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get user's bookshelf with populated book data
    const bookshelfEntries = await Bookshelf.find({ userId })
      .populate({
        path: 'bookId',
        select: 'title author description coverImage fileType wordCount createdAt'
      })
      .sort({ lastRead: -1 });

    // Transform data to expected format
    const userBooks = bookshelfEntries.map(entry => ({
      id: entry.bookId._id,
      title: entry.bookId.title,
      author: entry.bookId.author,
      description: entry.bookId.description,
      coverImage: entry.bookId.coverImage,
      fileType: entry.bookId.fileType,
      wordCount: entry.bookId.wordCount,
      addedAt: entry.bookId.createdAt,
      progress: entry.progress,
      isFavorite: entry.isFavorite,
      lastRead: entry.lastRead,
      notes: entry.notes,
      bookshelfId: entry._id
    }));

    res.json(userBooks);
  } catch (error) {
    console.error('Get user bookshelf error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch bookshelf' });
  }
};

/**
 * Update reading progress for a book
 * @route PUT /api/bookshelf/:bookId/progress
 */
exports.updateProgress = async (req, res) => {
  try {
    const { bookId } = req.params;
    const { progress } = req.body;
    const userId = req.user.id;

    // Validate progress value
    if (progress < 0 || progress > 100) {
      return res.status(400).json({ error: 'Progress must be between 0 and 100' });
    }

    // Find book in user's bookshelf
    const bookshelfEntry = await Bookshelf.findOne({ userId, bookId });
    
    if (!bookshelfEntry) {
      // Create new entry if book not in bookshelf yet
      const newEntry = new Bookshelf({
        userId,
        bookId,
        progress,
        lastRead: new Date()
      });
      
      await newEntry.save();
      
      return res.json({
        message: 'Book progress updated successfully',
        progress
      });
    }

    // Update progress and last read date
    bookshelfEntry.progress = progress;
    bookshelfEntry.lastRead = new Date();
    await bookshelfEntry.save();

    res.json({
      message: 'Book progress updated successfully',
      progress: bookshelfEntry.progress
    });
  } catch (error) {
    console.error('Update progress error:', error);
    res.status(500).json({ error: error.message || 'Failed to update progress' });
  }
};

/**
 * Toggle favorite status for a book
 * @route PUT /api/bookshelf/:bookId/favorite
 */
exports.toggleFavorite = async (req, res) => {
  try {
    const { bookId } = req.params;
    const userId = req.user.id;

    // Find book in user's bookshelf
    let bookshelfEntry = await Bookshelf.findOne({ userId, bookId });
    
    if (!bookshelfEntry) {
      // Create new entry if book not in bookshelf yet
      bookshelfEntry = new Bookshelf({
        userId,
        bookId,
        isFavorite: true
      });
    } else {
      // Toggle favorite status
      bookshelfEntry.isFavorite = !bookshelfEntry.isFavorite;
    }
    
    await bookshelfEntry.save();

    res.json({
      message: `Book ${bookshelfEntry.isFavorite ? 'added to' : 'removed from'} favorites`,
      isFavorite: bookshelfEntry.isFavorite
    });
  } catch (error) {
    console.error('Toggle favorite error:', error);
    res.status(500).json({ error: error.message || 'Failed to update favorite status' });
  }
};

/**
 * Update notes for a book
 * @route PUT /api/bookshelf/:bookId/notes
 */
exports.updateNotes = async (req, res) => {
  try {
    const { bookId } = req.params;
    const { notes } = req.body;
    const userId = req.user.id;

    // Find book in user's bookshelf
    let bookshelfEntry = await Bookshelf.findOne({ userId, bookId });
    
    if (!bookshelfEntry) {
      // Create new entry if book not in bookshelf yet
      bookshelfEntry = new Bookshelf({
        userId,
        bookId,
        notes
      });
    } else {
      // Update notes
      bookshelfEntry.notes = notes;
    }
    
    await bookshelfEntry.save();

    res.json({
      message: 'Book notes updated successfully',
      notes: bookshelfEntry.notes
    });
  } catch (error) {
    console.error('Update notes error:', error);
    res.status(500).json({ error: error.message || 'Failed to update notes' });
  }
};

/**
 * Remove a book from the user's bookshelf
 * @route DELETE /api/bookshelf/:bookId
 */
exports.removeFromBookshelf = async (req, res) => {
  try {
    const { bookId } = req.params;
    const userId = req.user.id;

    // Delete the bookshelf entry
    const result = await Bookshelf.findOneAndDelete({ userId, bookId });
    
    if (!result) {
      return res.status(404).json({ error: 'Book not found in bookshelf' });
    }

    res.json({ message: 'Book removed from bookshelf successfully' });
  } catch (error) {
    console.error('Remove from bookshelf error:', error);
    res.status(500).json({ error: error.message || 'Failed to remove book from bookshelf' });
  }
};

/**
 * Get user's favorite books
 * @route GET /api/bookshelf/favorites
 */
exports.getFavorites = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get user's favorite books
    const favorites = await Bookshelf.find({ userId, isFavorite: true })
      .populate({
        path: 'bookId',
        select: 'title author description coverImage fileType wordCount createdAt'
      })
      .sort({ lastRead: -1 });

    // Transform data to expected format
    const favoriteBooks = favorites.map(entry => ({
      id: entry.bookId._id,
      title: entry.bookId.title,
      author: entry.bookId.author,
      description: entry.bookId.description,
      coverImage: entry.bookId.coverImage,
      fileType: entry.bookId.fileType,
      wordCount: entry.bookId.wordCount,
      addedAt: entry.bookId.createdAt,
      progress: entry.progress,
      lastRead: entry.lastRead,
      bookshelfId: entry._id
    }));

    res.json(favoriteBooks);
  } catch (error) {
    console.error('Get favorites error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch favorite books' });
  }
};