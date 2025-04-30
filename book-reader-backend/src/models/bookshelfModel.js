// bookshelfModel.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Bookshelf Schema following the recommended structure from the analysis
const BookshelfSchema = new Schema({
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  bookId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Book', 
    required: true 
  },
  progress: { 
    type: Number, 
    min: 0, 
    max: 100, 
    default: 0 
  },
  lastRead: { 
    type: Date 
  },
  isFavorite: { 
    type: Boolean, 
    default: false 
  },
  notes: { 
    type: String 
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

// Create a compound index to ensure a user can't add the same book twice
BookshelfSchema.index({ userId: 1, bookId: 1 }, { unique: true });

const Bookshelf = mongoose.model('Bookshelf', BookshelfSchema);

module.exports = Bookshelf;