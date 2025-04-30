// src/models/book.js
const fs = require('fs').promises;
const path = require('path');

class Book {
  constructor({ id, title, author, content, filePath, fileType, uploadedBy }) {
    this.id = id || Date.now().toString();
    this.title = title;
    this.author = author;
    this.content = content;
    this.filePath = filePath;
    this.fileType = fileType;
    this.uploadedBy = uploadedBy;
    this.createdAt = new Date();
  }

  async save() {
    const books = await Book.getAllFromStorage();
    books.push(this);
    await Book.saveToStorage(books);
    return this;
  }

  static async findAll() {
    return await Book.getAllFromStorage();
  }

  static async findById(id) {
    const books = await Book.getAllFromStorage();
    return books.find(book => book.id === id);
  }

  static async deleteById(id) {
    const books = await Book.getAllFromStorage();
    const index = books.findIndex(book => book.id === id);
    if (index === -1) return false;
    
    const book = books[index];
    try {
      await fs.unlink(book.filePath);
    } catch (error) {
      console.error('Error deleting file:', error);
    }
    
    books.splice(index, 1);
    await Book.saveToStorage(books);
    return true;
  }

  static async getAllFromStorage() {
    try {
      const data = await fs.readFile(this.storagePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  static async saveToStorage(books) {
    await fs.writeFile(this.storagePath, JSON.stringify(books, null, 2));
  }

  static storagePath = path.join(__dirname, '../../data/books.json');
}

module.exports = { Book };