const express = require('express');
const router = express.Router();
const { searchBooks, getTrendingBooks, getBookById } = require('../controllers/bookController');

router.get('/search', searchBooks);
router.get('/trending', getTrendingBooks);
router.get('/:id', getBookById);

module.exports = router;
