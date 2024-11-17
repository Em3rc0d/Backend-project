const Factura = require('../models/factura');

// Obtener todas las facturas
exports.obtenerFacturas = async (req, res) => {
    try {
        const facturas = await Factura.find();
        res.json(facturas);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las facturas', error });
    }
};

// Obtener una factura por ID
exports.obtenerFacturaPorId = async (req, res) => {
    try {
        const factura = await Factura.findById(req.params.id);
        if (!factura) {
            return res.status(404).json({ message: 'Factura no encontrada' });
        }
        res.json(factura);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener la factura', error });
    }
};

// Crear una nueva factura
exports.crearFactura = async (req, res) => {
    try {
        const nuevaFactura = new Factura(req.body);
        const facturaGuardada = await nuevaFactura.save();
        res.status(201).json(facturaGuardada);
    } catch (error) {
        res.status(400).json({ message: 'Error al crear la factura', error });
    }
};

// Actualizar una factura existente
exports.actualizarFactura = async (req, res) => {
    try {
        const factura = await Factura.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!factura) {
            return res.status(404).json({ message: 'Factura no encontrada' });
        }
        res.json(factura);
    } catch (error) {
        res.status(400).json({ message: 'Error al actualizar la factura', error });
    }
};

// Eliminar una factura
exports.eliminarFactura = async (req, res) => {
    try {
        const factura = await Factura.findByIdAndDelete(req.params.id);
        if (!factura) {
            return res.status(404).json({ message: 'Factura no encontrada' });
        }
        res.json({ message: 'Factura eliminada con éxito' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar la factura', error });
    }
};
