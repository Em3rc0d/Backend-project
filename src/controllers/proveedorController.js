const { pool } = require('../config/database');

// Obtener todos los proveedores
exports.obtenerProveedores = async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT nombre, direccion, telefono, email FROM proveedores');
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error al obtener proveedores:', error);
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
        const { rows } = await pool.query('SELECT * FROM proveedores WHERE email = $1', [email]);
        if (rows.length > 0) {
            return res.status(400).json({ message: 'El correo electrónico ya está registrado para otro proveedor.' });
        }

        // Crear un nuevo proveedor
        const { rows: nuevoProveedor } = await pool.query(
            'INSERT INTO proveedores (nombre, email, telefono, direccion) VALUES ($1, $2, $3, $4) RETURNING *',
            [nombre, email, telefono, direccion]
        );

        res.status(201).json({
            message: 'Proveedor creado exitosamente',
            proveedor: nuevoProveedor[0]
        });
    } catch (error) {
        console.error('Error al crear proveedor:', error);
        res.status(500).json({ message: 'Error al crear proveedor', error: error.message });
    }
};
