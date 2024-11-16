const Factura = require('../models/factura');

exports.obtenerFacturas = async (req, res) => {
    try {
        const facturas = await Factura.find();
        res.json(facturas);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las facturas', error });
    }
};

exports.crearFactura = async (req, res) => {
    try {
        const nuevaFactura = new Factura(req.body);
        const facturaGuardada = await nuevaFactura.save();
        res.status(201).json(facturaGuardada);
    } catch (error) {
        res.status(400).json({ message: 'Error al crear la factura', error });
    }
};
