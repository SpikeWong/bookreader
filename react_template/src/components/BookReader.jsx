// src/components/BookReader.jsx
import React, { useState, useEffect, useCallback, useContext, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBookById } from '../utils/api';
import { translateText, speakText } from '../utils/translationUtils';
import { ThemeContext } from '../context/ThemeContext';
import { UserContext } from '../context/UserContext';
import Header from './Header';
import Footer from './Footer';

function BookReader() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { darkMode } = useContext(ThemeContext);
  const contentRef = useRef(null);
  
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [translation, setTranslation] = useState('');
  const [showTranslation, setShowTranslation] = useState(false);
  const [translationPosition, setTranslationPosition] = useState({ x: 0, y: 0 });
  const [fontSize, setFontSize] = useState(16); // Default font size
  const [readingProgress, setReadingProgress] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [sentences, setSentences] = useState([]);

  // Get user context for reading progress management
  const userContext = useContext(UserContext || React.createContext({}));
  const { user, updateReadingProgress, getReadingProgress, addToBookshelf, isInBookshelf } = userContext || {};
  
  // Load book data
  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        const bookData = await getBookById(id);
        setBook(bookData);
        
        // Split content into sentences for text-to-speech navigation
        if (bookData?.content) {
          const sentenceArray = bookData.content
            .replace(/([.!?])\s+/g, "$1\n")
            .split("\n")
            .filter(sentence => sentence.trim() !== "");
          setSentences(sentenceArray);
        }
        
        // Try to load saved reading progress
        // Use user-specific progress if logged in, otherwise fallback to local storage
        let savedProgress;
        if (user) {
          savedProgress = getReadingProgress(id);
          
          // Add book to user's bookshelf if not already there
          if (bookData && !isInBookshelf(id)) {
            addToBookshelf(bookData);
          }
        } else {
          savedProgress = localStorage.getItem(`book-progress-${id}`);
        }
        
        if (savedProgress) {
          setReadingProgress(parseInt(savedProgress));
          
          // Scroll to saved position after content is rendered
          setTimeout(() => {
            if (contentRef.current) {
              const scrollTarget = (contentRef.current.scrollHeight * parseInt(savedProgress)) / 100;
              contentRef.current.scrollTop = scrollTarget;
            }
          }, 100);
        }
      } catch (err) {
        setError('Failed to load book');
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id, user, getReadingProgress, addToBookshelf, isInBookshelf]);

  // Handle scroll to update reading progress
  const handleScroll = useCallback(() => {
    if (!contentRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
    const progress = Math.round((scrollTop / (scrollHeight - clientHeight)) * 100);
    
    if (!isNaN(progress)) {
      setReadingProgress(progress);
      
      // Save progress to user account if logged in, otherwise use localStorage
      if (user) {
        updateReadingProgress(id, progress);
      } else {
        localStorage.setItem(`book-progress-${id}`, progress.toString());
      }
    }
  }, [id, user, updateReadingProgress]);

  useEffect(() => {
    const contentElement = contentRef.current;
    if (contentElement) {
      contentElement.addEventListener('scroll', handleScroll);
      return () => contentElement.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  // Word/Text selection and translation
  const handleWordClick = async (e) => {
    e.preventDefault();
    const word = e.target.textContent;
    const rect = e.target.getBoundingClientRect();
    
    setTranslationPosition({
      x: rect.left,
      y: rect.bottom + window.scrollY
    });
    
    const translatedText = await translateText(word);
    setTranslation(translatedText);
    setShowTranslation(true);
    
    if (!isSpeaking) {
      speakText(word);
    }
  };

  const handleTextSelection = async () => {
    const selectedText = window.getSelection().toString();
    if (selectedText) {
      const translatedText = await translateText(selectedText);
      setTranslation(translatedText);
      const selection = window.getSelection();
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      
      setTranslationPosition({
        x: rect.left,
        y: rect.bottom + window.scrollY
      });
      setShowTranslation(true);
      
      if (!isSpeaking) {
        speakText(selectedText);
      }
    }
  };

  const closeTranslation = useCallback(() => {
    setShowTranslation(false);
  }, []);

  // Text to speech functionality
  const toggleSpeech = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      readCurrentSentence();
    }
  };

  const readCurrentSentence = useCallback(() => {
    if (sentences.length > 0 && currentSentenceIndex < sentences.length) {
      setIsSpeaking(true);
      
      const utterance = new SpeechSynthesisUtterance(sentences[currentSentenceIndex]);
      utterance.lang = 'en-US';
      
      utterance.onend = () => {
        if (currentSentenceIndex < sentences.length - 1) {
          setCurrentSentenceIndex(prev => prev + 1);
        } else {
          setIsSpeaking(false);
        }
      };
      
      window.speechSynthesis.speak(utterance);
    }
  }, [sentences, currentSentenceIndex]);

  // When current sentence index changes, read the next sentence
  useEffect(() => {
    if (isSpeaking && sentences.length > 0) {
      readCurrentSentence();
    }
  }, [currentSentenceIndex, isSpeaking, readCurrentSentence, sentences]);

  // Stop speech synthesis when component unmounts
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  // Event handlers for document clicks
  useEffect(() => {
    document.addEventListener('click', closeTranslation);
    return () => document.removeEventListener('click', closeTranslation);
  }, [closeTranslation]);

  // Font size adjustment
  const increaseFontSize = () => {
    setFontSize(prevSize => Math.min(prevSize + 2, 24));
  };

  const decreaseFontSize = () => {
    setFontSize(prevSize => Math.max(prevSize - 2, 12));
  };

  // Navigation between books
  const goToPreviousBook = () => {
    const prevId = parseInt(id) - 1;
    if (prevId > 0) {
      navigate(`/book/${prevId}`);
    }
  };

  const goToNextBook = () => {
    const nextId = parseInt(id) + 1;
    navigate(`/book/${nextId}`);
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

  if (error || !book) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            {error || "Book not found"}
          </div>
          <button 
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Return to Book List
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} transition-colors duration-300`}>
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Book header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
            <h2 className="text-xl text-gray-600 dark:text-gray-300 mb-2">{book.author}</h2>
          </div>
          
          <div className="flex space-x-2 mt-4 md:mt-0">
            <button
              onClick={() => navigate('/')}
              className={`p-2 rounded-full ${ 
                darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'
              } transition-colors duration-200`}
              title="Back to Library"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
            </button>
            
            <button
              onClick={decreaseFontSize}
              className={`p-2 rounded-full ${ 
                darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'
              } transition-colors duration-200`}
              title="Decrease font size"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4"></path>
              </svg>
            </button>
            
            <button
              onClick={increaseFontSize}
              className={`p-2 rounded-full ${ 
                darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'
              } transition-colors duration-200`}
              title="Increase font size"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
            </button>
            
            <button
              onClick={toggleSpeech}
              className={`p-2 rounded-full ${ 
                isSpeaking
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'
              } transition-colors duration-200`}
              title={isSpeaking ? "Stop reading" : "Read aloud"}
            >
              {isSpeaking ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"></path>
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path>
                </svg>
              )}
            </button>
          </div>
        </div>
        
        {/* Reading progress bar */}
        <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full mb-6">
          <div 
            className="h-full bg-blue-600 rounded-full transition-all duration-300"
            style={{ width: `${readingProgress}%` }}
          ></div>
        </div>
        
        {/* Book content */}
        <div 
          ref={contentRef}
          className={`${
            darkMode 
              ? 'bg-gray-800 text-gray-100 border-gray-700' 
              : 'bg-white text-gray-800 border-gray-200'
          } border rounded-lg p-6 shadow-lg mb-6 max-h-[70vh] overflow-y-auto`}
          style={{ fontSize: `${fontSize}px` }}
        >
          <div 
            className="prose lg:prose-xl mx-auto dark:prose-invert"
            style={{ maxWidth: '100%' }}
            onMouseUp={handleTextSelection}
          >
            {book && book.content ? book.content.split(' ').map((word, index) => (
              <span
                key={index}
                className={`cursor-pointer px-0.5 rounded transition-colors duration-200 ${
                  darkMode 
                    ? 'hover:bg-gray-700' 
                    : 'hover:bg-yellow-100'
                }`}
                onClick={handleWordClick}
              >
                {word}{' '}
              </span>
            )) : <p>No content available</p>}
          </div>
        </div>
        
        {/* Book navigation */}
        <div className="flex justify-between mb-8">
          <button
            onClick={goToPreviousBook}
            className={`px-4 py-2 rounded flex items-center ${ 
              parseInt(id) > 1
                ? darkMode 
                  ? 'bg-gray-800 text-white hover:bg-gray-700' 
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                : 'opacity-50 cursor-not-allowed ' + (darkMode ? 'bg-gray-800' : 'bg-gray-100')
            } transition-colors duration-200`}
            disabled={parseInt(id) <= 1}
          >
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
            </svg>
            Previous Book
          </button>
          
          <button
            onClick={goToNextBook}
            className={`px-4 py-2 rounded flex items-center ${ 
              darkMode 
                ? 'bg-gray-800 text-white hover:bg-gray-700' 
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            } transition-colors duration-200`}
          >
            Next Book
            <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>
        </div>
        
        {/* Translation tooltip */}
        {showTranslation && (
          <div
            className={`fixed bg-white dark:bg-gray-800 p-4 rounded-lg shadow-xl border ${
              darkMode ? 'border-gray-700 text-white' : 'border-gray-200 text-gray-900'
            } z-50`}
            style={{
              left: translationPosition.x,
              top: translationPosition.y,
              maxWidth: '300px'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start">
              <div>
                {translation && translation.startsWith('Error:') ? (
                  <div>
                    <p className="text-red-500">{translation}</p>
                    <p className="text-sm mt-1">Please add your Google Translate API key in settings</p>
                  </div>
                ) : translation && translation === '翻译加载中...' ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-500 mr-2"></div>
                    <span>翻译加载中...</span>
                  </div>
                ) : (
                  <div>{translation}</div>
                )}
              </div>
              <button 
                className="ml-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                onClick={closeTranslation}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}

export default BookReader;