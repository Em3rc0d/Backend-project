// src/routes/saleRoutes.js
const express = require('express');
const router = express.Router();

// Obtener todas las ventas
router.get('/', (req, res) => {
    res.send("Obtener todas las ventas");
});

// Crear una nueva venta
router.post('/', (req, res) => {
    const newSale = req.body;
    res.send(`Nueva venta creada: ${JSON.stringify(newSale)}`);
});

// Actualizar una venta
router.put('/:id', (req, res) => {
    const saleId = req.params.id;
    const updatedSale = req.body;
    res.send(`Venta con ID ${saleId} actualizada: ${JSON.stringify(updatedSale)}`);
});

// Eliminar una venta
router.delete('/:id', (req, res) => {
    const saleId = req.params.id;
    res.send(`Venta con ID ${saleId} eliminada`);
});

module.exports = router;
