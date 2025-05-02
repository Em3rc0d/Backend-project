const { pool } = require('../config/database');

// Obtener todos los usuarios
exports.obtenerUsuarios = async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT id, nombre, email, rol FROM usuarios'); // No devolver la contraseña por seguridad
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({ message: 'Error al obtener usuarios', error: error.message });
    }
};

// Crear un nuevo usuario
exports.crearUsuario = async (req, res) => {
    const { nombre, email, password, rol } = req.body;

    // Validación básica de entrada
    if (!nombre || !email || !password || !rol) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios (nombre, email, password, rol).' });
    }

    try {
        // Verificar si el email ya está en uso
        const { rows } = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
        if (rows.length > 0) {
            return res.status(400).json({ message: 'El correo electrónico ya está registrado.' });
        }

        // Crear un nuevo usuario
        const { rows: nuevoUsuario } = await pool.query(
            'INSERT INTO usuarios (nombre, email, password, rol) VALUES ($1, $2, $3, $4) RETURNING id, nombre, email, rol',
            [nombre, email, password, rol]
        );

        res.status(201).json({
            message: 'Usuario creado exitosamente',
            usuario: nuevoUsuario[0]  // Devolver el usuario sin la contraseña
        });
    } catch (error) {
        console.error('Error al crear usuario:', error);
        res.status(400).json({ message: 'Error al crear usuario', error: error.message });
    }
};

// Obtener un usuario por email
exports.obtenerUsuarioPorEmail = async (req, res) => {
    try {
        const email = req.params.email; // Obtener el email del parámetro de la ruta
        const { rows } = await pool.query('SELECT id, nombre, email, rol FROM usuarios WHERE email = $1', [email]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.status(200).json(rows[0]);  // Devolver el usuario encontrado sin la contraseña
    } catch (error) {
        console.error('Error al obtener usuario:', error);
        res.status(500).json({ message: 'Error al obtener usuario', error: error.message });
    }
};
