const { pool } = require('../config/database');

// Obtener todas las categorías
exports.obtenerCategorias = async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM categorias');
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error al obtener categorías:', error);
        res.status(500).json({ message: 'Error al obtener categorías', error: error.message });
    }
};

// Crear una nueva categoría
exports.crearCategoria = async (req, res) => {
    const { nombre, descripcion } = req.body;

    // Validación básica del campo 'nombre'
    if (!nombre || typeof nombre !== 'string' || nombre.trim() === '') {
        return res.status(400).json({
            message: "El campo 'nombre' es obligatorio y debe ser una cadena de texto válida."
        });
    }

    try {
        // Verificar si ya existe una categoría con el mismo nombre
        const { rows } = await pool.query('SELECT * FROM categorias WHERE nombre = $1', [nombre.trim()]);
        if (rows.length > 0) {
            return res.status(400).json({ message: `La categoría '${nombre}' ya existe.` });
        }

        // Insertar nueva categoría
        const { rows: nuevaCategoria } = await pool.query(
            'INSERT INTO categorias (nombre, descripcion) VALUES ($1, $2) RETURNING *',
            [nombre.trim(), descripcion || null]
        );

        // Responder con la categoría creada
        res.status(201).json({
            message: 'Categoría creada exitosamente',
            categoria: nuevaCategoria[0]
        });
    } catch (error) {
        console.error('Error al crear categoría:', error);
        res.status(500).json({
            message: 'Error al crear categoría',
            error: error.message
        });
    }
};
