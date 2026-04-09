const express = require('express');
const router = express.Router();
const { createReview, getBookReviews } = require('../controllers/reviewController');
const auth = require('../middleware/auth');

router.post('/', auth, createReview);
router.get('/:bookId', getBookReviews);

module.exports = router;
