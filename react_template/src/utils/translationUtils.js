// src/utils/translationUtils.js
import { getApiKey } from '../config/apiConfig';

// Google Translate API integration
export const translateText = async (text) => {
  try {
    const apiKey = getApiKey();
    
    if (!apiKey) {
      throw new Error('API key not configured');
    }

    // Set up API parameters
    const targetLang = 'zh-CN'; // Chinese translation
    const sourceLang = 'en'; // English source
    
    // Google Translate API endpoint
    const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;
    
    // API request
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: text,
        source: sourceLang,
        target: targetLang,
        format: 'text'
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Translation API error');
    }

    const data = await response.json();
    
    // Extract translated text from response
    if (data.data && data.data.translations && data.data.translations.length > 0) {
      return data.data.translations[0].translatedText;
    } else {
      throw new Error('Invalid translation response');
    }
  } catch (error) {
    console.error('Translation error:', error);
    
    // Fallback to basic translations for common words (just in case API fails)
    const basicTranslations = {
      'book': '书',
      'read': '读',
      'hello': '你好',
      'world': '世界'
    };
    
    return basicTranslations[text.toLowerCase()] || `Error: ${error.message}`;
  }
};

// Text-to-speech using Web Speech API
export const speakText = (text) => {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  }
};