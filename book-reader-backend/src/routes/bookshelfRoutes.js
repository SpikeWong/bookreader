// src/routes/bookshelfRoutes.js
const express = require('express');
const bookshelfController = require('../controllers/bookshelfController');
const { authenticateUser } = require('../middleware/auth');

const router = express.Router();

// All bookshelf routes are protected
router.use(authenticateUser);

// Bookshelf management routes
router.post('/', bookshelfController.addToBookshelf);
router.get('/', bookshelfController.getUserBookshelf);
router.get('/favorites', bookshelfController.getFavorites);
router.put('/:bookId/progress', bookshelfController.updateProgress);
router.put('/:bookId/favorite', bookshelfController.toggleFavorite);
router.put('/:bookId/notes', bookshelfController.updateNotes);
router.delete('/:bookId', bookshelfController.removeFromBookshelf);

module.exports = router;