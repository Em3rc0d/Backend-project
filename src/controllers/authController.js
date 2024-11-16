const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Usuario = require('../models/usuario');

// Función para iniciar sesión
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await Usuario.findOne({ email });
        if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: 'Credenciales inválidas' });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Error en el servidor' });
    }
};

// Función para registrar un usuario
exports.register = async (req, res) => {
    const { nombre, email, password, rol } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new Usuario({ nombre, email, password: hashedPassword, rol });

        await newUser.save();
        res.status(201).json({ message: 'Usuario registrado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error en el servidor' });
    }
};
