// ../react_template/src/utils/api.js
// Real API implementation
const API_URL = 'http://localhost:3000/api';

/**
 * Handle API responses and errors consistently
 * @param {Response} response - Fetch API response
 * @returns {Promise<any>} - Parsed JSON response or throws error
 */
const handleResponse = async (response) => {
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'An error occurred');
  }
  
  return data;
};

/**
 * Get authentication token from local storage
 */
const getAuthToken = () => localStorage.getItem('token');

/**
 * Set authentication headers if token exists
 */
const getAuthHeaders = () => {
  const token = getAuthToken();
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

/**
 * Register a new user
 * @param {string} username - Username
 * @param {string} email - Email address
 * @param {string} password - Password
 */
export const register = async (username, email, password) => {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, email, password }),
  });

  return handleResponse(response);
};

/**
 * Login user and get token
 * @param {string} username - Username or email
 * @param {string} password - Password
 * @returns {Promise<string>} - JWT token
 */
export const login = async (username, password) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  const data = await handleResponse(response);
  localStorage.setItem('token', data.token);
  return data.token;
};

/**
 * Get current logged-in user
 * @returns {Promise<Object>} - User object
 */
export const getCurrentUser = async () => {
  const response = await fetch(`${API_URL}/auth/me`, {
    headers: {
      ...getAuthHeaders(),
    },
  });

  return handleResponse(response);
};

/**
 * Update user profile
 * @param {Object} profileData - Profile data to update
 * @returns {Promise<Object>} - Updated user data
 */
export const updateProfile = async (profileData) => {
  const response = await fetch(`${API_URL}/auth/profile`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(profileData),
  });

  return handleResponse(response);
};

/**
 * Upload a new book
 * @param {FormData} formData - Form data with book file and metadata
 * @returns {Promise<Object>} - Uploaded book data
 */
export const uploadBook = async (formData) => {
  const response = await fetch(`${API_URL}/books`, {
    method: 'POST',
    headers: {
      ...getAuthHeaders(),
    },
    body: formData,
  });

  return handleResponse(response);
};

/**
 * Get all books
 * @returns {Promise<Array>} - List of books
 */
export const getAllBooks = async () => {
  const response = await fetch(`${API_URL}/books`);
  return handleResponse(response);
};

/**
 * Get a specific book by ID
 * @param {string} id - Book ID
 * @returns {Promise<Object>} - Book data
 */
export const getBookById = async (id) => {
  const response = await fetch(`${API_URL}/books/${id}`, {
    headers: {
      ...getAuthHeaders(), // Include token if available for progress
    },
  });
  
  return handleResponse(response);
};

/**
 * Update book details
 * @param {string} id - Book ID
 * @param {Object} bookData - Book data to update
 * @returns {Promise<Object>} - Updated book data
 */
export const updateBook = async (id, bookData) => {
  const response = await fetch(`${API_URL}/books/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(bookData),
  });

  return handleResponse(response);
};

/**
 * Delete a book
 * @param {string} id - Book ID
 * @returns {Promise<Object>} - Success message
 */
export const deleteBook = async (id) => {
  const response = await fetch(`${API_URL}/books/${id}`, {
    method: 'DELETE',
    headers: {
      ...getAuthHeaders(),
    },
  });

  return handleResponse(response);
};

/**
 * Get user's bookshelf
 * @returns {Promise<Array>} - List of books in user's bookshelf
 */
export const getUserBookshelf = async () => {
  const response = await fetch(`${API_URL}/bookshelf`, {
    headers: {
      ...getAuthHeaders(),
    },
  });

  return handleResponse(response);
};

/**
 * Get user's favorite books
 * @returns {Promise<Array>} - List of favorite books
 */
export const getFavoriteBooks = async () => {
  const response = await fetch(`${API_URL}/bookshelf/favorites`, {
    headers: {
      ...getAuthHeaders(),
    },
  });

  return handleResponse(response);
};

/**
 * Add book to user's bookshelf
 * @param {Object} bookshelfData - Bookshelf entry data
 * @returns {Promise<Object>} - Added bookshelf entry
 */
export const addToBookshelf = async (bookshelfData) => {
  const response = await fetch(`${API_URL}/bookshelf`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(bookshelfData),
  });

  return handleResponse(response);
};

/**
 * Update reading progress for a book
 * @param {string} bookId - Book ID
 * @param {number} progress - Reading progress (0-100)
 * @returns {Promise<Object>} - Updated progress data
 */
export const updateProgress = async (bookId, progress) => {
  const response = await fetch(`${API_URL}/bookshelf/${bookId}/progress`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ progress }),
  });

  return handleResponse(response);
};

/**
 * Toggle favorite status for a book
 * @param {string} bookId - Book ID
 * @returns {Promise<Object>} - Updated favorite status
 */
export const toggleFavorite = async (bookId) => {
  const response = await fetch(`${API_URL}/bookshelf/${bookId}/favorite`, {
    method: 'PUT',
    headers: {
      ...getAuthHeaders(),
    },
  });

  return handleResponse(response);
};

/**
 * Update notes for a book
 * @param {string} bookId - Book ID
 * @param {string} notes - Notes text
 * @returns {Promise<Object>} - Updated notes data
 */
export const updateNotes = async (bookId, notes) => {
  const response = await fetch(`${API_URL}/bookshelf/${bookId}/notes`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ notes }),
  });

  return handleResponse(response);
};

/**
 * Remove a book from the user's bookshelf
 * @param {string} bookId - Book ID
 * @returns {Promise<Object>} - Success message
 */
export const removeFromBookshelf = async (bookId) => {
  const response = await fetch(`${API_URL}/bookshelf/${bookId}`, {
    method: 'DELETE',
    headers: {
      ...getAuthHeaders(),
    },
  });

  return handleResponse(response);
};