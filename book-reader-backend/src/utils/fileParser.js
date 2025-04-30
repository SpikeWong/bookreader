// src/utils/fileParser.js
const fs = require('fs').promises;
const EPub = require('epub');
const pdf = require('pdf-parse');

exports.parseBook = async (filePath) => {
  const extension = filePath.split('.').pop().toLowerCase();
  
  switch (extension) {
    case 'epub':
      return parseEpub(filePath);
    case 'pdf':
      return parsePdf(filePath);
    case 'txt':
      return parseTxt(filePath);
    default:
      throw new Error('Unsupported file format');
  }
};

async function parseEpub(filePath) {
  return new Promise((resolve, reject) => {
    const epub = new EPub(filePath);
    
    epub.on('end', async () => {
      try {
        let content = '';
        const chapters = await new Promise((res) => epub.getChapters((chapters) => res(chapters)));
        
        for (const chapter of chapters) {
          content += await new Promise((res) => epub.getChapter(chapter.id, (err, text) => res(text)));
        }

        resolve({
          title: epub.metadata.title,
          author: epub.metadata.creator,
          content: content.replace(/<[^>]*>/g, ' ')
        });
      } catch (error) {
        reject(error);
      }
    });

    epub.parse();
  });
}

async function parsePdf(filePath) {
  const dataBuffer = await fs.readFile(filePath);
  const data = await pdf(dataBuffer);
  
  return {
    title: '', // PDF metadata extraction would go here
    author: '',
    content: data.text
  };
}

async function parseTxt(filePath) {
  const content = await fs.readFile(filePath, 'utf-8');
  const filename = filePath.split('/').pop().replace('.txt', '');
  
  return {
    title: filename,
    author: 'Unknown',
    content
  };
}