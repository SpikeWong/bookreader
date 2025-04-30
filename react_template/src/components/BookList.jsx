// src/components/BookList.jsx
import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { getAllBooks } from '../utils/api';
import { ThemeContext } from '../context/ThemeContext';
import Header from './Header';
import Footer from './Footer';

function BookList() {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [hoveredBook, setHoveredBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('title');
  const { darkMode } = useContext(ThemeContext);

  useEffect(() => {
    loadBooks();
  }, []);

  useEffect(() => {
    filterBooks();
  }, [books, searchTerm, sortBy]);

  const loadBooks = async () => {
    try {
      const booksList = await getAllBooks();
      setBooks(booksList);
      setFilteredBooks(booksList);
    } catch (err) {
      setError('Failed to load books');
    } finally {
      setLoading(false);
    }
  };

  const filterBooks = () => {
    let result = [...books];
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(
        book => 
          book.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
          book.author.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply sorting
    switch(sortBy) {
      case 'title':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'author':
        result.sort((a, b) => a.author.localeCompare(b.author));
        break;
      default:
        break;
    }
    
    setFilteredBooks(result);
  };

  if (loading) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} transition-colors duration-300`}>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className={`text-4xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'} text-center`}>
            English Book Collection
          </h1>
          <p className={`text-xl ${darkMode ? 'text-gray-300' : 'text-gray-600'} text-center max-w-2xl mx-auto`}>
            Explore our collection of English books to improve your reading skills and vocabulary.
          </p>
        </div>
        
        <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <div className="md:col-span-2 relative">
            <input
              type="text"
              placeholder="Search by title or author..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full p-3 pr-10 rounded-lg ${
                darkMode 
                  ? 'bg-gray-800 text-white border-gray-700 focus:border-blue-500' 
                  : 'bg-white text-gray-900 border-gray-200 focus:border-blue-600'
              } border focus:outline-none focus:ring-2 focus:ring-opacity-50`}
            />
            <svg 
              className={`w-5 h-5 absolute right-3 top-3.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
          
          <div className="flex items-center justify-end gap-2">
            <label className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} font-medium`}>
              Sort by:
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={`p-2 rounded-md ${
                darkMode 
                  ? 'bg-gray-800 text-white border-gray-700' 
                  : 'bg-white text-gray-900 border-gray-200'
              } border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
            >
              <option value="title">Title</option>
              <option value="author">Author</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="text-center text-red-500 mb-8 p-4 bg-red-100 rounded-lg">
            {error}
          </div>
        )}
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBooks.map((book) => (
            <Link
              key={book.id}
              to={`/book/${book.id}`}
              className={`group relative overflow-hidden rounded-lg shadow-lg transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl ${
                darkMode ? 'bg-gray-800' : 'bg-white'
              }`}
              onMouseEnter={() => setHoveredBook(book.id)}
              onMouseLeave={() => setHoveredBook(null)}
            >
              <div className="relative h-64">
                <img
                  src={book.coverImage || 'https://via.placeholder.com/400x600/E2E8F0/1A202C?text=Book+Cover'}
                  alt={book.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${
                  darkMode ? 'from-gray-900' : 'from-black'
                } opacity-60 group-hover:opacity-80 transition-opacity duration-300`}></div>
                <div className="absolute bottom-0 left-0 p-4 text-white">
                  <h2 className="text-xl font-bold mb-1">{book.title}</h2>
                  <p className="text-sm opacity-90">{book.author}</p>
                </div>
              </div>
              
              {/* Hover overlay with description */}
              <div 
                className={`absolute inset-0 bg-black bg-opacity-80 text-white p-6 flex flex-col justify-center transform transition-all duration-300 ${
                  hoveredBook === book.id ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
              >
                <h3 className="text-2xl font-bold mb-3">{book.title}</h3>
                <p className="text-sm mb-4">{book.description || 'No description available'}</p>
                <p className="mt-auto text-blue-400 font-semibold flex items-center">
                  Read now 
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                  </svg>
                </p>
              </div>
            </Link>
          ))}
        </div>

        {filteredBooks.length === 0 && (
          <div className={`text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-16 mb-16`}>
            {searchTerm 
              ? <p className="text-xl">No books matching your search. Try different keywords.</p>
              : <p className="text-xl">No books available yet. Please login as admin to add books.</p>
            }
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default BookList;