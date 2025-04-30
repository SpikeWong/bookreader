// src/models/user.js
const fs = require('fs').promises;
const path = require('path');

class User {
  constructor(username, password) {
    this.id = Date.now().toString();
    this.username = username;
    this.password = password;
    this.createdAt = new Date();
  }

  async save() {
    const users = await User.getAllFromStorage();
    const existingUser = users.find(user => user.username === this.username);
    if (existingUser) {
      throw new Error('Username already exists');
    }
    users.push(this);
    await User.saveToStorage(users);
    return this;
  }

  static async findByUsername(username) {
    const users = await User.getAllFromStorage();
    return users.find(user => user.username === username);
  }

  static async getAllFromStorage() {
    try {
      const data = await fs.readFile(this.storagePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  static async saveToStorage(users) {
    await fs.writeFile(this.storagePath, JSON.stringify(users, null, 2));
  }

  static storagePath = path.join(__dirname, '../../data/users.json');
}

module.exports = { User };