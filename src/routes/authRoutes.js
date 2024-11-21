const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken, verifyRole } = require('../middleware/authMiddleware');

// Rutas de autenticación
router.post('/login', authController.login);  // Login de usuario
router.post('/register', verifyToken, verifyRole(['admin']), authController.register);  // Registro de usuario (solo admin puede)

module.exports = router;
