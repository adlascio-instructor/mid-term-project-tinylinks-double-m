const express = require('express');
const AuthController = require('../controllers/auth');

const router = express.Router();

router.get('/register', AuthController.showRegisterForm);

router.post('/register', AuthController.registerNewUser);

module.exports = router;