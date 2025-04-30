// src/config/apiConfig.js
// Default to empty string if environment variable is not defined
export const GOOGLE_TRANSLATE_API_KEY = '';

// Configure API key instructions
export const configureApiKey = (key) => {
  localStorage.setItem('google_translate_api_key', key);
};

export const getApiKey = () => {
  return localStorage.getItem('google_translate_api_key') || GOOGLE_TRANSLATE_API_KEY;
};