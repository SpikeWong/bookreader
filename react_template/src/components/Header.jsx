// src/components/Header.jsx
import React, { useContext, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';
// Import UserContext but handle the case where it might not be available yet
import { UserContext } from '../context/UserContext';

function Header() {
  const location = useLocation();
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);
  const { user, logout } = useContext(UserContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className={`sticky top-0 z-10 ${
      darkMode ? 'bg-gray-900 text-white shadow-md' : 'bg-white text-gray-900 shadow-sm'
    } transition-colors duration-300`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <svg 
                className="w-6 h-6 text-white" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                ></path>
              </svg>
            </div>
            <span className="text-2xl font-bold">BookReader</span>
          </Link>

          <div className="flex items-center space-x-4">
            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-6 mr-4">
              <Link 
                to="/" 
                className={`font-medium transition-colors duration-200 ${
                  location.pathname === '/' 
                    ? 'text-blue-600 dark:text-blue-400' 
                    : darkMode ? 'text-gray-200 hover:text-blue-400' : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                Books
              </Link>
              
              {user ? (
                <>
                  <Link 
                    to="/bookshelf" 
                    className={`font-medium transition-colors duration-200 ${
                      location.pathname === '/bookshelf' 
                        ? 'text-blue-600 dark:text-blue-400' 
                        : darkMode ? 'text-gray-200 hover:text-blue-400' : 'text-gray-700 hover:text-blue-600'
                    }`}
                  >
                    My Bookshelf
                  </Link>
                  
                  <Link 
                    to="/profile" 
                    className={`font-medium transition-colors duration-200 ${
                      location.pathname === '/profile' 
                        ? 'text-blue-600 dark:text-blue-400' 
                        : darkMode ? 'text-gray-200 hover:text-blue-400' : 'text-gray-700 hover:text-blue-600'
                    }`}
                  >
                    Profile
                  </Link>
                  
                  <button 
                    onClick={logout}
                    className={`font-medium transition-colors duration-200 ${
                      darkMode ? 'text-gray-200 hover:text-blue-400' : 'text-gray-700 hover:text-blue-600'
                    }`}
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className={`font-medium transition-colors duration-200 ${
                      location.pathname === '/login' 
                        ? 'text-blue-600 dark:text-blue-400' 
                        : darkMode ? 'text-gray-200 hover:text-blue-400' : 'text-gray-700 hover:text-blue-600'
                    }`}
                  >
                    Sign In
                  </Link>
                </>
              )}
              
              {/* Admin link always available */}
              <Link 
                to="/admin" 
                className={`font-medium transition-colors duration-200 ${
                  location.pathname === '/admin' 
                    ? 'text-blue-600 dark:text-blue-400' 
                    : darkMode ? 'text-gray-200 hover:text-blue-400' : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                Admin
              </Link>
            </nav>

            {/* User Avatar (if logged in) */}
            {user && (
              <Link to="/profile" className="hidden md:block">
                <img 
                  src={user.profile.avatarUrl} 
                  alt={user.profile.displayName}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-500"
                />
              </Link>
            )}

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-full ${
                darkMode 
                  ? 'bg-gray-800 text-yellow-300 hover:bg-gray-700' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              } transition-colors duration-200`}
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path
                    fillRule="evenodd"
                    d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
                </svg>
              )}
            </button>

            {/* Mobile menu button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
              aria-label="Open menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>
        </div>
        
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className={`md:hidden py-4 px-2 mb-4 rounded-lg ${
            darkMode ? 'bg-gray-800' : 'bg-gray-100'
          }`}>
            <nav className="flex flex-col space-y-4">
              <Link 
                to="/" 
                className={`px-3 py-2 rounded-md font-medium ${
                  location.pathname === '/' 
                    ? 'bg-blue-600 text-white' 
                    : darkMode ? 'text-gray-200 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-200'
                }`}
                onClick={toggleMobileMenu}
              >
                Books
              </Link>
              
              {user ? (
                <>
                  <Link 
                    to="/bookshelf" 
                    className={`px-3 py-2 rounded-md font-medium ${
                      location.pathname === '/bookshelf' 
                        ? 'bg-blue-600 text-white' 
                        : darkMode ? 'text-gray-200 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-200'
                    }`}
                    onClick={toggleMobileMenu}
                  >
                    My Bookshelf
                  </Link>
                  
                  <Link 
                    to="/profile" 
                    className={`px-3 py-2 rounded-md font-medium ${
                      location.pathname === '/profile' 
                        ? 'bg-blue-600 text-white' 
                        : darkMode ? 'text-gray-200 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-200'
                    }`}
                    onClick={toggleMobileMenu}
                  >
                    Profile
                  </Link>
                  
                  <button 
                    onClick={() => { logout(); toggleMobileMenu(); }}
                    className={`px-3 py-2 rounded-md font-medium text-left ${
                      darkMode ? 'text-gray-200 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className={`px-3 py-2 rounded-md font-medium ${
                      location.pathname === '/login' 
                        ? 'bg-blue-600 text-white' 
                        : darkMode ? 'text-gray-200 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-200'
                    }`}
                    onClick={toggleMobileMenu}
                  >
                    Sign In
                  </Link>
                </>
              )}
              
              {/* Admin link always available */}
              <Link 
                to="/admin" 
                className={`px-3 py-2 rounded-md font-medium ${
                  location.pathname === '/admin' 
                    ? 'bg-blue-600 text-white' 
                    : darkMode ? 'text-gray-200 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-200'
                }`}
                onClick={toggleMobileMenu}
              >
                Admin
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;