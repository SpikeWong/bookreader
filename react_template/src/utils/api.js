// ../react_template/src/utils/api.js
// Mock API implementation for frontend demo purposes
const MOCK_ENABLED = true; // Set to true to use mock API functions
const API_URL = 'http://localhost:3000/api';

// Store books in localStorage to persist data between page refreshes
const initMockStorage = () => {
  if (!localStorage.getItem('mockBooks')) {
    localStorage.setItem('mockBooks', JSON.stringify([]));
  }
};

// Mock login function
const mockLogin = async (username, password) => {
  // For demo purposes, always return a mock token
  return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InNwaWtlV2FuZyIsInJvbGUiOiJhZG1pbiJ9';
};

// Mock upload function
const mockUploadBook = async (formData) => {
  // Create a mock book entry
  const file = formData.get('book');
  if (!file) throw new Error('No file provided');
  
  const books = JSON.parse(localStorage.getItem('mockBooks') || '[]');
  const newId = books.length > 0 ? Math.max(...books.map(b => b.id)) + 1 : 1;
  
  const fileNameParts = file.name.split('.');
  const fileExt = fileNameParts.pop().toLowerCase();
  const fileName = fileNameParts.join('.');
  
  // Create a new book object
  const newBook = {
    id: newId,
    title: fileName,
    author: 'Unknown Author',
    coverImage: 'https://via.placeholder.com/400x600/E2E8F0/1A202C?text=' + encodeURIComponent(fileName),
    fileType: fileExt,
    addedAt: new Date().toISOString(),
    description: `This is a ${fileExt.toUpperCase()} book uploaded by the admin.`,
    wordCount: Math.floor(Math.random() * 50000) + 10000,
    progress: 0
  };
  
  books.push(newBook);
  localStorage.setItem('mockBooks', JSON.stringify(books));
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  return newBook;
};

export const login = async (username, password) => {
  if (MOCK_ENABLED) {
    return mockLogin(username, password);
  }
  
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    throw new Error('Login failed');
  }

  const data = await response.json();
  return data.token;
};

export const uploadBook = async (formData) => {
  if (MOCK_ENABLED) {
    initMockStorage();
    return mockUploadBook(formData);
  }
  
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/books/upload`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Upload failed');
  }

  return await response.json();
};

// Mock get all books function
const mockGetAllBooks = async () => {
  initMockStorage();
  const books = JSON.parse(localStorage.getItem('mockBooks') || '[]');
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  return books;
};

// Mock get book by id function
const mockGetBookById = async (id) => {
  initMockStorage();
  const books = JSON.parse(localStorage.getItem('mockBooks') || '[]');
  const book = books.find(b => b.id === parseInt(id, 10));
  if (!book) {
    throw new Error('Book not found');
  }
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  return book;
};

// Mock delete book function
const mockDeleteBook = async (id) => {
  initMockStorage();
  const books = JSON.parse(localStorage.getItem('mockBooks') || '[]');
  const filteredBooks = books.filter(b => b.id !== parseInt(id, 10));
  localStorage.setItem('mockBooks', JSON.stringify(filteredBooks));
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return true;
};

export const getAllBooks = async () => {
  if (MOCK_ENABLED) {
    return mockGetAllBooks();
  }
  
  const response = await fetch(`${API_URL}/books`);
  if (!response.ok) {
    throw new Error('Failed to fetch books');
  }
  return await response.json();
};

export const getBookById = async (id) => {
  if (MOCK_ENABLED) {
    return mockGetBookById(id);
  }
  
  const response = await fetch(`${API_URL}/books/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch book');
  }
  return await response.json();
};

export const deleteBook = async (id) => {
  if (MOCK_ENABLED) {
    return mockDeleteBook(id);
  }
  
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/books/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Delete failed');
  }
};