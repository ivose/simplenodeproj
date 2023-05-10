const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/change-password', authMiddleware.verifyToken, authController.changePassword);
router.post('/reset-password', authController.resetPassword);
router.post('/update-profile', authMiddleware.verifyToken, authController.updateProfile);

module.exports = router;
