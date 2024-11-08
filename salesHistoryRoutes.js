// src/routes/salesHistoryRoutes.js
const express = require('express');
const router = express.Router();

// Obtener el historial de ventas
router.get('/', (req, res) => {
    res.send("Obtener historial de ventas");
});

// Agregar una venta al historial
router.post('/', (req, res) => {
    const saleHistory = req.body;
    res.send(`Venta agregada al historial: ${JSON.stringify(saleHistory)}`);
});

module.exports = router;
