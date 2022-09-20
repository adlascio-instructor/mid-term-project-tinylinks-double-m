const express = require('express');
const AuthController = require('../controllers/auth');

const router = express.Router();

router.get('/register', AuthController.showRegisterForm);
router.post('/register', AuthController.registerNewUser);
router.get('/login', AuthController.showLoginForm);
router.post('/login', AuthController.login);
router.post('/logout', AuthController.logout);

module.exports = router;