const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { isNotAuthenticated } = require('../middleware/auth');

router.get('/login', isNotAuthenticated, authController.showLogin);
router.post('/login', isNotAuthenticated, authController.login);


router.get('/register', isNotAuthenticated, authController.showRegister);
router.post('/register', isNotAuthenticated, authController.register);

router.post('/logout', authController.logout);
router.get('/logout', authController.logout);

module.exports = router;