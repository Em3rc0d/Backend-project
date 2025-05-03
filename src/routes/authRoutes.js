const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken, verifyRole } = require('../middleware/authMiddleware');

router.post('/login', authController.login);  
// router.post('/register', verifyToken, verifyRole(['admin']), authController.register);  
router.post('/register', authController.register); 

module.exports = router;
