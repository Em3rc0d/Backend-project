// src/controllers/ventaController.js
const Venta = require('../models/venta'); // Asegúrate de tener el modelo de Venta definido

// Obtener todas las ventas
exports.obtenerVentas = async (req, res) => {
    try {
        const ventas = await Venta.find();
        res.status(200).json(ventas);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Crear una nueva venta
exports.crearVenta = async (req, res) => {
    try {
        const venta = new Venta(req.body);
        await venta.save();
        res.status(201).json(venta);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Obtener venta por ID
exports.obtenerVentaPorId = async (req, res) => {
    try {
        const venta = await Venta.findById(req.params.id);
        if (!venta) {
            return res.status(404).json({ message: 'Venta no encontrada' });
        }
        res.status(200).json(venta);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Actualizar venta por ID
exports.actualizarVenta = async (req, res) => {
    try {
        const venta = await Venta.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!venta) {
            return res.status(404).json({ message: 'Venta no encontrada' });
        }
        res.status(200).json(venta);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Eliminar venta por ID
exports.eliminarVenta = async (req, res) => {
    try {
        const venta = await Venta.findByIdAndDelete(req.params.id);
        if (!venta) {
            return res.status(404).json({ message: 'Venta no encontrada' });
        }
        res.status(200).json({ message: 'Venta eliminada' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.filtrarVentas = async (req, res) => {
    try {
        const { tipoFiltro, fechaDesde, fechaHasta, estado } = req.query;

        let query = {};

        if (tipoFiltro === 'Fecha') {
            if(fechaDesde) {
                query.fecha = { $gte: new Date(fechaDesde) };
            }
            if(fechaHasta) {
                query.fecha = { $lte: new Date(fechaHasta) };
            }

        }
        if(tipoFiltro === 'Estado' && estado) {
            query.estado = estado;
        }

        const ventas = await Venta.find(query);
        res.json(ventas);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
