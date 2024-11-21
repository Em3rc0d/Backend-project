const Usuario = require('../models/usuario');

// Obtener todos los usuarios
exports.obtenerUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.find().select('-password'); // No devolver la contraseña por motivos de seguridad
        res.status(200).json(usuarios);
    } catch (error) {
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
        const usuarioExistente = await Usuario.findOne({ email });
        if (usuarioExistente) {
            return res.status(400).json({ message: 'El correo electrónico ya está registrado.' });
        }

        // Crear un nuevo usuario
        const nuevoUsuario = new Usuario(req.body);

        // Guardar el nuevo usuario en la base de datos
        const usuarioGuardado = await nuevoUsuario.save();
        res.status(201).json({
            message: 'Usuario creado exitosamente',
            usuario: {
                id: usuarioGuardado._id,
                nombre: usuarioGuardado.nombre,
                email: usuarioGuardado.email,
                rol: usuarioGuardado.rol
            }
        });
    } catch (error) {
        res.status(400).json({ message: 'Error al crear usuario', error: error.message });
    }
};

exports.obtenerUsuarioPorEmail = async (req, res) => {
    try {
        const email = req.params.email; // Obtener el email del parámetro de la ruta
        const usuario = await Usuario.findOne({ email }).select('-password');  // Buscar usuario por email

        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.status(200).json(usuario);  // Devolver el usuario encontrado
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener usuario', error: error.message });
    }
}

