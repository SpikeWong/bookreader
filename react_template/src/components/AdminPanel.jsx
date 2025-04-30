// src/components/AdminPanel.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { uploadBook, deleteBook, getAllBooks } from '../utils/api';
import { ThemeContext } from '../context/ThemeContext';
import Header from './Header';
import Footer from './Footer';
import ApiKeyInput from './ApiKeyInput';

function AdminPanel() {
  const [books, setBooks] = useState([]);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [fileType, setFileType] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const navigate = useNavigate();
  const { darkMode } = useContext(ThemeContext);

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      const booksList = await getAllBooks();
      setBooks(booksList);
    } catch (err) {
      setError('Failed to load books');
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      processFile(selectedFile);
    }
  };

  const processFile = (selectedFile) => {
    setFile(selectedFile);
    setFileType(selectedFile.name.split('.').pop().toLowerCase());
    
    // Reset states
    setError('');
    setSuccess('');
    setUploadProgress(0);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles?.length) {
      processFile(droppedFiles[0]);
    }
  };

  const simulateProgress = () => {
    const interval = setInterval(() => {
      setUploadProgress((prevProgress) => {
        if (prevProgress >= 90) {
          clearInterval(interval);
          return prevProgress;
        }
        return prevProgress + 10;
      });
    }, 300);
    
    return () => clearInterval(interval);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setUploadProgress(0);
    
    // Start simulated progress
    const stopProgress = simulateProgress();

    try {
      const formData = new FormData();
      formData.append('book', file);
      await uploadBook(formData);
      
      // Complete the progress
      setUploadProgress(100);
      setSuccess(`Book "${file.name}" uploaded successfully!`);
      
      // Reset form
      setFile(null);
      setFileType('');
      setError('');
      
      // Reload book list
      await loadBooks();
    } catch (err) {
      setError(`Failed to upload book: ${err.message || 'Unknown error'}`);
      setUploadProgress(0);
    } finally {
      stopProgress();
      setLoading(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      try {
        setLoading(true);
        await deleteBook(id);
        setSuccess(`Book "${title}" deleted successfully!`);
        await loadBooks();
      } catch (err) {
        setError('Failed to delete book');
      } finally {
        setLoading(false);
      }
    }
  };

  const getFileIcon = () => {
    switch (fileType) {
      case 'pdf':
        return (
          <svg className="w-12 h-12 text-red-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd"></path>
            <text x="6" y="15" fontSize="6" fill="white">PDF</text>
          </svg>
        );
      case 'epub':
        return (
          <svg className="w-12 h-12 text-blue-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"></path>
          </svg>
        );
      case 'txt':
        return (
          <svg className="w-12 h-12 text-gray-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 3a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm0 3a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm0 3a1 1 0 011-1h3a1 1 0 110 2H7a1 1 0 01-1-1z" clipRule="evenodd"></path>
          </svg>
        );
      default:
        return (
          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"></path>
          </svg>
        );
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} transition-colors duration-300`}>
      <Header />
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <nav className="flex mb-4" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <a href="/" className={`inline-flex items-center text-sm font-medium ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'}`}>
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
                </svg>
                Home
              </a>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                </svg>
                <span className={`ml-1 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Admin Dashboard</span>
              </div>
            </li>
          </ol>
        </nav>
        
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition duration-200"
          >
            Logout
          </button>
        </div>
        
        {/* Status messages */}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6">
            <span className="block sm:inline">{success}</span>
            <button 
              className="absolute top-0 bottom-0 right-0 px-4 py-3"
              onClick={() => setSuccess('')}
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
              </svg>
            </button>
          </div>
        )}
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
            <span className="block sm:inline">{error}</span>
            <button 
              className="absolute top-0 bottom-0 right-0 px-4 py-3"
              onClick={() => setError('')}
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
              </svg>
            </button>
          </div>
        )}

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Translation Settings</h2>
          <ApiKeyInput />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upload section */}
          <div className={`lg:col-span-1 ${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-lg`}>
            <h2 className="text-xl font-semibold mb-4">Upload New Book</h2>
            
            <form onSubmit={handleUpload} className="space-y-6">
              <div 
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                  darkMode 
                    ? dragActive ? 'border-blue-400 bg-gray-700' : 'border-gray-600 bg-gray-800'
                    : dragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300 bg-gray-50'
                }`}
              >
                {file ? (
                  <div className="flex flex-col items-center space-y-3">
                    {getFileIcon()}
                    <span className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                      {file.name}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </span>
                    <button
                      type="button"
                      onClick={() => setFile(null)}
                      className="text-sm text-red-500 hover:text-red-700 dark:hover:text-red-400"
                    >
                      Remove file
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center space-y-2">
                    <svg className={`w-12 h-12 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                    </svg>
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      <span className="font-medium">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      EPUB, PDF, or TXT files are supported
                    </p>
                  </div>
                )}
                <input
                  type="file"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={handleFileChange}
                  accept=".epub,.pdf,.txt"
                />
              </div>

              {uploadProgress > 0 && (
                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              )}
              
              <button
                type="submit"
                disabled={!file || loading}
                className={`w-full px-4 py-2 text-white rounded transition-colors duration-200 ${
                  !file || loading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {loading ? 'Uploading...' : 'Upload Book'}
              </button>
            </form>
          </div>
          
          {/* Book list section */}
          <div className={`lg:col-span-2 ${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-lg`}>
            <h2 className="text-xl font-semibold mb-4">Manage Books</h2>
            
            {books.length === 0 ? (
              <div className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                <p>No books available. Upload your first book to get started!</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                {books.map((book) => (
                  <div 
                    key={book.id} 
                    className={`flex items-center space-x-4 p-4 rounded-lg border ${
                      darkMode 
                        ? 'border-gray-700 hover:bg-gray-700' 
                        : 'border-gray-200 hover:bg-gray-50'
                    } transition-colors duration-200`}
                  >
                    <div className="h-16 w-12 flex-shrink-0 overflow-hidden rounded">
                      <img
                        src={book.coverImage || 'https://via.placeholder.com/400x600/E2E8F0/1A202C?text=Book+Cover'}
                        alt={book.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    
                    <div className="flex-grow">
                      <h3 className="font-medium">{book.title}</h3>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{book.author}</p>
                      {book.description && (
                        <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-500'} line-clamp-1`}>
                          {book.description}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => navigate(`/book/${book.id}`)}
                        className={`p-2 rounded ${
                          darkMode 
                            ? 'bg-gray-700 hover:bg-gray-600 text-blue-400' 
                            : 'bg-gray-100 hover:bg-gray-200 text-blue-600'
                        }`}
                        title="View book"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(book.id, book.title)}
                        className={`p-2 rounded ${
                          darkMode 
                            ? 'bg-gray-700 hover:bg-red-900 text-red-400' 
                            : 'bg-gray-100 hover:bg-red-100 text-red-600'
                        }`}
                        disabled={loading}
                        title="Delete book"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}

export default AdminPanel;