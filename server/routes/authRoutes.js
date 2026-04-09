const express = require('express');
const router = express.Router();
const { signup, login, getMe } = require('../controllers/authController');
const auth = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');

router.post('/signup', authLimiter, signup);
router.post('/login', authLimiter, login);
router.get('/me', auth, getMe);

module.exports = router;
