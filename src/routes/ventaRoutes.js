const express = require('express');
const router = express.Router();
const ventaController = require('../controllers/ventaController');
const { verifyToken, verifyRole } = require('../middleware/authMiddleware'); 

router.get('/', verifyToken, ventaController.obtenerVentas); 
router.post('/', verifyToken, ventaController.crearVenta);
router.get('/filter', verifyToken, ventaController.filtrarVentas);
router.get('/:id', verifyToken, ventaController.obtenerVentaPorId);
router.put('/:id', verifyRole(['admin']), ventaController.actualizarVenta); 
router.delete('/:id', verifyRole(['admin']), ventaController.eliminarVenta);

module.exports = router;