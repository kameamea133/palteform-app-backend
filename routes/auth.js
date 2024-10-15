const express = require('express');
const { register, login, getUserProfile, logout } = require('../controllers/authController');
const { auth } = require('../middlewares/auth');
const router = express.Router();


router.post('/register', register);


router.post('/login', login);


router.get('/logout', auth, logout);


router.get('/profile', auth, getUserProfile);

module.exports = router;
