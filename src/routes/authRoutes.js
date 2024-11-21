const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken, verifyRole } = require('../middleware/authMiddleware');

// Rutas de autenticación
router.post('/login', authController.login);
router.post('/register', verifyRole(['admin']), authController.register);

module.exports = router;