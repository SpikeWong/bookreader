// src/components/Bookshelf.jsx
import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { ThemeContext } from '../context/ThemeContext';
import { getAllBooks } from '../utils/api';
import { getBookshelfWithDetails, getFavoriteBooks, getRecentlyReadBooks } from '../models/bookshelf';
import Header from './Header';
import Footer from './Footer';

function Bookshelf() {
  const { user, bookshelf, removeFromBookshelf, toggleFavorite } = useContext(UserContext);
  const { darkMode } = useContext(ThemeContext);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [books, setBooks] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [recentBooks, setRecentBooks] = useState([]);
  const [viewMode, setViewMode] = useState('all'); // 'all', 'favorites', 'recent'
  
  useEffect(() => {
    const loadBooks = async () => {
      if (!user) {
        setBooks([]);
        setLoading(false);
        return;
      }
      
      try {
        const bookshelfWithDetails = await getBookshelfWithDetails(user.id, getAllBooks);
        setBooks(bookshelfWithDetails);
        
        const favoritesData = await getFavoriteBooks(user.id, getAllBooks);
        setFavorites(favoritesData);
        
        const recentData = await getRecentlyReadBooks(user.id, getAllBooks);
        setRecentBooks(recentData);
      } catch (err) {
        setError('Failed to load books');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    loadBooks();
  }, [user, bookshelf]);
  
  const handleRemoveBook = (bookId) => {
    removeFromBookshelf(bookId);
  };
  
  const handleToggleFavorite = (bookId) => {
    toggleFavorite(bookId);
  };
  
  const getBooksToDisplay = () => {
    switch (viewMode) {
      case 'favorites':
        return favorites;
      case 'recent':
        return recentBooks;
      default:
        return books;
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} transition-colors duration-300`}>
      <Header />
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Bookshelf</h1>
            <div className="h-1 w-20 bg-blue-600 rounded"></div>
          </div>
          
          {/* View mode selector */}
          <div className="mt-4 sm:mt-0">
            <div className={`inline-flex rounded-md shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
              <button
                className={`px-4 py-2 text-sm font-medium rounded-l-md ${
                  viewMode === 'all'
                    ? 'bg-blue-600 text-white'
                    : darkMode
                    ? 'text-gray-300 hover:bg-gray-700'
                    : 'text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setViewMode('all')}
              >
                All Books
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium ${
                  viewMode === 'favorites'
                    ? 'bg-blue-600 text-white'
                    : darkMode
                    ? 'text-gray-300 hover:bg-gray-700'
                    : 'text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setViewMode('favorites')}
              >
                Favorites
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium rounded-r-md ${
                  viewMode === 'recent'
                    ? 'bg-blue-600 text-white'
                    : darkMode
                    ? 'text-gray-300 hover:bg-gray-700'
                    : 'text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setViewMode('recent')}
              >
                Recent
              </button>
            </div>
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        ) : getBooksToDisplay().length === 0 ? (
          <div className={`text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'} py-16 px-4`}>
            {viewMode === 'all' ? (
              <>
                <h3 className="text-xl font-medium mb-2">Your bookshelf is empty</h3>
                <p>Browse the library and add books to your collection</p>
                <Link 
                  to="/" 
                  className="mt-4 inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
                >
                  Explore Books
                </Link>
              </>
            ) : viewMode === 'favorites' ? (
              <>
                <h3 className="text-xl font-medium mb-2">No favorite books yet</h3>
                <p>Mark books as favorites to see them here</p>
              </>
            ) : (
              <>
                <h3 className="text-xl font-medium mb-2">No recent books</h3>
                <p>Books you read will appear here</p>
              </>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {getBooksToDisplay().map(book => (
              <div 
                key={book.id}
                className={`relative overflow-hidden rounded-lg shadow-lg transition-transform duration-300 hover:-translate-y-1 ${
                  darkMode ? 'bg-gray-800' : 'bg-white'
                }`}
              >
                <Link to={`/book/${book.id}`} className="block">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={book.coverImage || 'https://via.placeholder.com/400x600/E2E8F0/1A202C?text=Book+Cover'}
                      alt={book.title}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                    
                    {/* Progress bar overlay */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
                      <div 
                        className="h-full bg-blue-600" 
                        style={{ width: `${book.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </Link>
                
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <Link to={`/book/${book.id}`} className="block">
                        <h3 className="text-lg font-semibold mb-1 line-clamp-1">{book.title}</h3>
                      </Link>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>{book.author}</p>
                    </div>
                    
                    {/* Favorite button */}
                    <button
                      onClick={() => handleToggleFavorite(book.id)}
                      className="flex items-center justify-center w-8 h-8 rounded-full focus:outline-none"
                      title={book.isFavorite ? "Remove from favorites" : "Add to favorites"}
                    >
                      {book.isFavorite ? (
                        <svg className="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ) : (
                        <svg className={`w-6 h-6 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} stroke="currentColor" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between mt-4">
                    <div className="text-sm">
                      <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                        Progress: {book.progress || 0}%
                      </span>
                    </div>
                    
                    <button
                      onClick={() => handleRemoveBook(book.id)}
                      className={`text-sm px-3 py-1 rounded ${
                        darkMode
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      } transition-colors duration-200`}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
}

export default Bookshelf;