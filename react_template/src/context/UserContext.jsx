// src/context/UserContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import { 
  loginUser as loginUserAPI, 
  registerUser as registerUserAPI,
  updateUserProfile as updateProfileAPI
} from '../models/user';
import {
  getUserBookshelf,
  addBookToBookshelf as addToBookshelfAPI,
  removeBookFromBookshelf as removeFromBookshelfAPI,
  updateBookReadingProgress as updateReadingProgressAPI,
  toggleFavoriteBook
} from '../models/bookshelf.js';

// Create user context
export const UserContext = createContext();

// Create user provider component
const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookshelf, setBookshelf] = useState([]);
  const [error, setError] = useState('');

  // Load user from localStorage on initial render
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const savedUser = localStorage.getItem('bookReaderUser');
        if (savedUser) {
          const userData = JSON.parse(savedUser);
          setUser(userData);
          
          // Also load the user's bookshelf
          const bookshelfData = await getUserBookshelf(userData.id);
          setBookshelf(bookshelfData);
        }
      } catch (err) {
        console.error('Failed to load user data:', err);
        setError('Failed to load user data');
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  // Register a new user
  const register = async (userData) => {
    setLoading(true);
    try {
      const newUser = await registerUserAPI(userData);
      setUser(newUser);
      localStorage.setItem('bookReaderUser', JSON.stringify(newUser));
      return newUser;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Login a user
  const login = async (userData) => {
    setLoading(true);
    try {
      const loggedInUser = await loginUserAPI(userData.username, userData.password);
      setUser(loggedInUser);
      localStorage.setItem('bookReaderUser', JSON.stringify(loggedInUser));
      
      // Load the user's bookshelf
      const bookshelfData = await getUserBookshelf(loggedInUser.id);
      setBookshelf(bookshelfData);
      
      return loggedInUser;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // OAuth login (Google, GitHub)
  const oauthLogin = async (provider, authData) => {
    setLoading(true);
    try {
      // In a real app, we'd call an API endpoint here
      // For now, we'll simulate a successful OAuth login
      const mockOAuthUser = {
        id: `oauth-${Date.now()}`,
        username: authData.username || `user${Math.floor(Math.random() * 10000)}`,
        email: authData.email || `user${Math.floor(Math.random() * 10000)}@example.com`,
        profile: {
          displayName: authData.displayName || authData.username,
          avatarUrl: authData.avatarUrl,
          provider: provider
        }
      };
      
      setUser(mockOAuthUser);
      localStorage.setItem('bookReaderUser', JSON.stringify(mockOAuthUser));
      
      return mockOAuthUser;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout the current user
  const logout = () => {
    setUser(null);
    setBookshelf([]);
    localStorage.removeItem('bookReaderUser');
  };

  // Update user profile
  const updateUserProfile = async (profileData) => {
    if (!user) throw new Error('No user logged in');
    
    setLoading(true);
    try {
      const updatedUser = await updateProfileAPI(user.id, profileData);
      setUser(updatedUser);
      localStorage.setItem('bookReaderUser', JSON.stringify(updatedUser));
      return updatedUser;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Add a book to the user's bookshelf
  const addToBookshelf = async (book) => {
    if (!user) throw new Error('No user logged in');
    
    try {
      await addToBookshelfAPI(user.id, book);
      // Refresh bookshelf
      const updatedBookshelf = await getUserBookshelf(user.id);
      setBookshelf(updatedBookshelf);
      return updatedBookshelf;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Remove a book from the user's bookshelf
  const removeFromBookshelf = async (bookId) => {
    if (!user) throw new Error('No user logged in');
    
    try {
      await removeFromBookshelfAPI(user.id, bookId);
      // Refresh bookshelf
      const updatedBookshelf = await getUserBookshelf(user.id);
      setBookshelf(updatedBookshelf);
      return updatedBookshelf;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Update reading progress for a book
  const updateReadingProgress = async (bookId, progress) => {
    if (!user) throw new Error('No user logged in');
    
    try {
      await updateReadingProgressAPI(user.id, bookId, progress);
      
      // Update the bookshelf state with the new progress
      setBookshelf(prevBookshelf => prevBookshelf.map(book => 
        book.id === bookId ? { ...book, progress, lastRead: Date.now() } : book
      ));
      
      // Refresh bookshelf
      const updatedBookshelf = await getUserBookshelf(user.id);
      setBookshelf(updatedBookshelf);
      return updatedBookshelf.find(book => book.id === bookId) || null;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Toggle favorite status for a book
  const toggleFavorite = async (bookId) => {
    if (!user) throw new Error('No user logged in');
    
    try {
      const isFavorite = await toggleFavoriteBook(user.id, bookId);
      
      // Update the bookshelf state with the new favorite status
      setBookshelf(prevBookshelf => prevBookshelf.map(book => 
        book.id === bookId ? { ...book, isFavorite } : book
      ));
      
      return isFavorite;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Create authentication utility functions
  const isLoggedIn = () => !!user;
  
  // Context value
  const contextValue = {
    user,
    bookshelf,
    loading,
    error,
    register,
    login,
    oauthLogin,
    logout,
    updateUserProfile,
    addToBookshelf,
    removeFromBookshelf,
    updateReadingProgress,
    toggleFavorite,
    isLoggedIn
  };

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;