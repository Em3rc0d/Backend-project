const Proveedor = require('../models/proveedor');

// Obtener todos los proveedores
exports.obtenerProveedores = async (req, res) => {
    try {
        const proveedores = await Proveedor.find().select('nombre direccion telefono email'); // Seleccionar campos relevantes
        res.status(200).json(proveedores);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener proveedores', error: error.message });
    }
};

// Crear un nuevo proveedor
exports.crearProveedor = async (req, res) => {
    const { nombre, email, telefono, direccion } = req.body;

    // Validación básica de datos
    if (!nombre || !email || !telefono) {
        return res.status(400).json({ message: 'Los campos nombre, correo y teléfono son obligatorios.' });
    }

    try {
        // Verificar si ya existe un proveedor con el mismo correo
        const proveedorExistente = await Proveedor.findOne({ email });
        if (proveedorExistente) {
            return res.status(400).json({ message: 'El correo electrónico ya está registrado para otro proveedor.' });
        }

        // Crear un nuevo proveedor
        const nuevoProveedor = new Proveedor({ nombre, email, telefono, direccion });
        const proveedorGuardado = await nuevoProveedor.save();

        res.status(201).json({
            message: 'Proveedor creado exitosamente',
            proveedor: proveedorGuardado
        });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear proveedor', error: error.message });
    }
};
