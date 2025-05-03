const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const { verifyToken, verifyRole } = require('../middleware/authMiddleware');

router.get('/', verifyRole(['admin']), usuarioController.obtenerUsuarios); 
router.post('/', verifyRole(['admin']), usuarioController.crearUsuario);
router.get('/email/:email', verifyToken, verifyRole(['admin', 'vendedor']), usuarioController.obtenerUsuarioPorEmail);

module.exports = router;
