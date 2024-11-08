// src/routes/invoiceRoutes.js
const express = require('express');
const router = express.Router();

// Obtener todas las facturas
router.get('/', (req, res) => {
    res.send("Obtener todas las facturas");
});

// Crear una nueva factura
router.post('/', (req, res) => {
    const newInvoice = req.body;
    res.send(`Nueva factura creada: ${JSON.stringify(newInvoice)}`);
});

// Actualizar una factura
router.put('/:id', (req, res) => {
    const invoiceId = req.params.id;
    const updatedInvoice = req.body;
    res.send(`Factura con ID ${invoiceId} actualizada: ${JSON.stringify(updatedInvoice)}`);
});

// Eliminar una factura
router.delete('/:id', (req, res) => {
    const invoiceId = req.params.id;
    res.send(`Factura con ID ${invoiceId} eliminada`);
});

module.exports = router;
