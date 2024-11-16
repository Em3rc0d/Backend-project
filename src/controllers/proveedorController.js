const Proveedor = require('../models/proveedor');

exports.obtenerProveedores = async (req, res) => {
    try {
        const proveedores = await Proveedor.find();
        res.json(proveedores);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener proveedores', error });
    }
};

exports.crearProveedor = async (req, res) => {
    try {
        const nuevoProveedor = new Proveedor(req.body);
        const proveedorGuardado = await nuevoProveedor.save();
        res.status(201).json(proveedorGuardado);
    } catch (error) {
        res.status(400).json({ message: 'Error al crear proveedor', error });
    }
};
