const express = require('express');
const router = express.Router();
const { saveProgress, getProgress, getAllProgress } = require('../controllers/readingController');
const auth = require('../middleware/auth');

router.post('/progress', auth, saveProgress);
router.get('/', auth, getAllProgress);
router.get('/:bookId', auth, getProgress);

module.exports = router;
