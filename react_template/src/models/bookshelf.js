// src/models/bookshelf.js
// Mock bookshelf storage
let bookshelves = {};

// Mock favorites storage
let favorites = {};

// Helper to persist bookshelves to localStorage
const persistBookshelves = () => {
  localStorage.setItem('bookReaderBookshelves', JSON.stringify(bookshelves));
};

// Helper to load bookshelves from localStorage
const loadBookshelves = () => {
  const savedBookshelves = localStorage.getItem('bookReaderBookshelves');
  if (savedBookshelves) {
    bookshelves = JSON.parse(savedBookshelves);
  }
};

// Helper to persist favorites to localStorage
const persistFavorites = () => {
  localStorage.setItem('bookReaderFavorites', JSON.stringify(favorites));
};

// Helper to load favorites from localStorage
const loadFavorites = () => {
  const savedFavorites = localStorage.getItem('bookReaderFavorites');
  if (savedFavorites) {
    favorites = JSON.parse(savedFavorites);
  }
};

// Initialize by loading saved bookshelves and favorites
loadBookshelves();
loadFavorites();

/**
 * Get user's bookshelf
 * @param {string} userId - User ID
 * @returns {Array} - Array of books in the user's bookshelf
 */
export const getUserBookshelf = async (userId) => {
  // If user has no bookshelf yet, initialize it
  if (!bookshelves[userId]) {
    bookshelves[userId] = [];
    persistBookshelves();
  }
  return bookshelves[userId] || [];
};

/**
 * Add a book to user's bookshelf
 * @param {string} userId - User ID
 * @param {Object} book - Book to add
 * @returns {boolean} - Success status
 */
export const addBookToBookshelf = async (userId, book) => {
  // If user has no bookshelf yet, initialize it
  if (!bookshelves[userId]) {
    bookshelves[userId] = [];
  }
  
  // Check if book is already in bookshelf
  const bookExists = bookshelves[userId].some(b => b.id === book.id);
  
  if (!bookExists) {
    // Add book with progress property
    bookshelves[userId].push({
      ...book,
      progress: 0 // Initial reading progress
    });
    persistBookshelves();
  }
  
  return true;
};

/**
 * Remove a book from user's bookshelf
 * @param {string} userId - User ID
 * @param {string} bookId - Book ID to remove
 * @returns {boolean} - Success status
 */
export const removeBookFromBookshelf = async (userId, bookId) => {
  // If user has no bookshelf, nothing to remove
  if (!bookshelves[userId]) {
    return false;
  }
  
  // Filter out the book to remove
  bookshelves[userId] = bookshelves[userId].filter(book => book.id !== bookId);
  persistBookshelves();
  
  return true;
};

/**
 * Check if a book is in the user's bookshelf
 * @param {Array} bookshelf - User's bookshelf array
 * @param {string} bookId - Book ID to check
 * @returns {boolean} - Whether book is in bookshelf
 */
export const isBookInBookshelf = (bookshelf, bookId) => {
  if (!bookshelf || !bookshelf.length) return false;
  return bookshelf.some(book => book.id === bookId);
};

/**
 * Update reading progress for a book
 * @param {string} userId - User ID
 * @param {string} bookId - Book ID
 * @param {number} progress - Reading progress percentage (0-100)
 * @returns {boolean} - Success status
 */
export const updateBookReadingProgress = async (userId, bookId, progress) => {
  // If user has no bookshelf, nothing to update
  if (!bookshelves[userId]) {
    return false;
  }
  
  // Find the book
  const bookIndex = bookshelves[userId].findIndex(book => book.id === bookId);
  
  if (bookIndex === -1) {
    return false;
  }
  
  // Update progress
  bookshelves[userId][bookIndex].progress = progress;
  persistBookshelves();
  
  return true;
};

/**
 * Get reading progress for a book
 * @param {string} userId - User ID
 * @param {string} bookId - Book ID
 * @returns {number|null} - Reading progress percentage or null if not found
 */
export const getBookReadingProgress = async (userId, bookId) => {
  // If user has no bookshelf, no progress data
  if (!bookshelves[userId]) {
    return null;
  }
  
  // Find the book
  const book = bookshelves[userId].find(book => book.id === bookId);
  
  if (!book) {
    return null;
  }
  
  return book.progress;
};

/**
 * Get recently read books (sorted by last read date)
 * @param {string} userId - User ID
 * @param {number} limit - Maximum number of books to return
 * @returns {Array} - Array of recently read books
 */
export const getRecentlyReadBooks = async (userId, limit = 5) => {
  // If user has no bookshelf, no recent books
  if (!bookshelves[userId]) {
    return [];
  }
  
  // Get books with progress > 0, sorted by lastRead time
  const recentBooks = bookshelves[userId]
    .filter(book => book.progress > 0)
    .sort((a, b) => {
      // Sort by lastRead timestamp if available, otherwise by progress
      if (a.lastRead && b.lastRead) {
        return b.lastRead - a.lastRead;
      }
      return b.progress - a.progress;
    })
    .slice(0, limit);
  
  return recentBooks;
};

/**
 * Get bookshelf with additional details fetched from books API
 * @param {string} userId - User ID
 * @param {Function} getAllBooksFunc - Function to get all available books
 * @returns {Array} - Array of books with details
 */
export const getBookshelfWithDetails = async (userId, getAllBooksFunc) => {
  // Get user's bookshelf
  const bookshelf = await getUserBookshelf(userId);
  
  if (!bookshelf.length) {
    return [];
  }
  
  // Get all available books to merge details
  const allBooks = await getAllBooksFunc();
  
  // Map favorite status
  const userFavorites = favorites[userId] || [];
  
  // Merge bookshelf items with full book details
  return bookshelf.map(bookshelfItem => {
    const fullBookDetails = allBooks.find(book => book.id === bookshelfItem.id) || {};
    return {
      ...fullBookDetails,
      ...bookshelfItem,
      isFavorite: userFavorites.includes(bookshelfItem.id)
    };
  });
};

/**
 * Toggle favorite status for a book
 * @param {string} userId - User ID
 * @param {string} bookId - Book ID
 * @returns {boolean} - New favorite status
 */
export const toggleFavoriteBook = async (userId, bookId) => {
  // Initialize favorites for this user if they don't exist
  if (!favorites[userId]) {
    favorites[userId] = [];
  }
  
  // Check if the book is already a favorite
  const index = favorites[userId].indexOf(bookId);
  
  if (index === -1) {
    // Add to favorites
    favorites[userId].push(bookId);
  } else {
    // Remove from favorites
    favorites[userId].splice(index, 1);
  }
  
  persistFavorites();
  
  // Return the new favorite status
  return index === -1; // true if was added, false if was removed
};

/**
 * Get favorite books for a user
 * @param {string} userId - User ID
 * @param {Function} getAllBooksFunc - Function to get all available books
 * @returns {Array} - Array of favorite books with details
 */
export const getFavoriteBooks = async (userId, getAllBooksFunc) => {
  // Get user's bookshelf with details
  const bookshelfWithDetails = await getBookshelfWithDetails(userId, getAllBooksFunc);
  
  // Filter for favorites only
  return bookshelfWithDetails.filter(book => book.isFavorite);
};
