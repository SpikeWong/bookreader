// src/utils/fileParser.js
const fs = require('fs').promises;
const path = require('path');
const epub = require('epub');
const pdf = require('pdf-parse');

/**
 * Extract content and calculate word count from various file types
 * @param {string} filePath - Path to the file
 * @param {string} fileType - Type of file (pdf, epub, txt, html)
 * @returns {Promise<Object>} - Object with content and wordCount
 */
exports.extractContent = async (filePath, fileType) => {
  try {
    switch (fileType.toLowerCase()) {
      case 'pdf':
        return await extractFromPDF(filePath);
      case 'epub':
        return await extractFromEPUB(filePath);
      case 'txt':
        return await extractFromTXT(filePath);
      case 'html':
        return await extractFromHTML(filePath);
      default:
        throw new Error(`Unsupported file type: ${fileType}`);
    }
  } catch (error) {
    console.error(`Error extracting content from ${fileType} file:`, error);
    throw error;
  }
};

/**
 * Extract content from PDF file
 */
async function extractFromPDF(filePath) {
  try {
    const dataBuffer = await fs.readFile(filePath);
    const data = await pdf(dataBuffer);
    const content = data.text;
    const wordCount = countWords(content);
    
    return { content, wordCount };
  } catch (error) {
    console.error('Error extracting from PDF:', error);
    throw error;
  }
}

/**
 * Extract content from EPUB file
 */
async function extractFromEPUB(filePath) {
  return new Promise((resolve, reject) => {
    const epubBook = new epub(filePath);
    let content = '';
    
    epubBook.on('end', () => {
      // Get the chapters
      epubBook.flow.forEach((chapter) => {
        if (chapter.id) {
          epubBook.getChapter(chapter.id, (err, text) => {
            if (err) {
              console.error('Error reading chapter:', err);
            } else {
              content += text;
            }
          });
        }
      });
      
      // Wait a bit to ensure all chapters are processed
      setTimeout(() => {
        const wordCount = countWords(content);
        resolve({ content, wordCount });
      }, 1000);
    });
    
    epubBook.on('error', reject);
    epubBook.parse();
  });
}

/**
 * Extract content from TXT file
 */
async function extractFromTXT(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf8');
    const wordCount = countWords(content);
    
    return { content, wordCount };
  } catch (error) {
    console.error('Error extracting from TXT:', error);
    throw error;
  }
}

/**
 * Extract content from HTML file
 */
async function extractFromHTML(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf8');
    // Remove HTML tags to get plain text
    const plainText = content.replace(/<[^>]*>/g, ' ');
    const wordCount = countWords(plainText);
    
    return { content: plainText, wordCount };
  } catch (error) {
    console.error('Error extracting from HTML:', error);
    throw error;
  }
}

/**
 * Count words in a text
 */
function countWords(text) {
  if (!text) return 0;
  
  // Remove extra whitespace and split by spaces
  const words = text.trim().split(/\s+/);
  return words.filter(word => word.length > 0).length;
}