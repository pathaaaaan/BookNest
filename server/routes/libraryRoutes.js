const express = require('express');
const router = express.Router();
const { addToLibrary, getLibrary, removeFromLibrary, getBookStatus } = require('../controllers/libraryController');
const auth = require('../middleware/auth');

router.post('/add', auth, addToLibrary);
router.get('/', auth, getLibrary);
router.get('/status/:bookId', auth, getBookStatus);
router.delete('/:bookId', auth, removeFromLibrary);

module.exports = router;
