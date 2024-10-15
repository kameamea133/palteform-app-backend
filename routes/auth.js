const express = require('express');
const { signup, login, refreshToken, logout } = require('../controllers/authController');
const { auth } = require('../middlewares/auth');
const router = express.Router();


router.post('/signup', signup);


router.post('/login', login);


router.post('/logout', logout);


router.post('/refresh-token', refreshToken);

// router.get('/profile', getProfile);


module.exports = router;
