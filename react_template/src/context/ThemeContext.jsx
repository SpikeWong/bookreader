// src/context/ThemeContext.jsx
import React, { createContext, useState, useEffect } from 'react';

// Create Theme Context
export const ThemeContext = createContext();

// Create Theme Provider Component
const ThemeProvider = ({ children }) => {
  // Check if darkMode is saved in localStorage, default to false
  const savedDarkMode = localStorage.getItem('darkMode') === 'true';
  const [darkMode, setDarkMode] = useState(savedDarkMode);

  // Update localStorage and apply theme when darkMode changes
  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
    
    // Apply dark mode class to html element
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.body.style.backgroundColor = '#111827'; // bg-gray-900
    } else {
      document.documentElement.classList.remove('dark');
      document.body.style.backgroundColor = '#F9FAFB'; // bg-gray-50
    }
  }, [darkMode]);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode);
  };

  // Context value
  const contextValue = {
    darkMode,
    toggleDarkMode
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;