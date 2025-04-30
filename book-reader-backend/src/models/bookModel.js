// bookModel.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Book Schema following the recommended structure from the analysis
const BookSchema = new Schema({
  title: { 
    type: String, 
    required: true 
  },
  author: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String
  },
  coverImage: { 
    type: String, 
    description: 'URL or file path' 
  },
  content: { 
    type: String,
    required: true 
  },
  filePath: { 
    type: String, 
    required: true 
  },
  fileType: { 
    type: String, 
    required: true 
  },
  wordCount: { 
    type: Number 
  },
  uploadedBy: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
}, { timestamps: true });

// Add index on title and author for faster searches
BookSchema.index({ title: 'text', author: 'text' });

const Book = mongoose.model('Book', BookSchema);

module.exports = Book;