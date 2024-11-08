// src/routes/notificationRoutes.js
const express = require('express');
const router = express.Router();

// Obtener todas las notificaciones
router.get('/', (req, res) => {
    res.send("Obtener todas las notificaciones");
});

// Crear una nueva notificación
router.post('/', (req, res) => {
    const newNotification = req.body;
    res.send(`Nueva notificación creada: ${JSON.stringify(newNotification)}`);
});

// Actualizar una notificación
router.put('/:id', (req, res) => {
    const notificationId = req.params.id;
    const updatedNotification = req.body;
    res.send(`Notificación con ID ${notificationId} actualizada: ${JSON.stringify(updatedNotification)}`);
});

// Eliminar una notificación
router.delete('/:id', (req, res) => {
    const notificationId = req.params.id;
    res.send(`Notificación con ID ${notificationId} eliminada`);
});

module.exports = router;
