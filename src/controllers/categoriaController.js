const Categoria = require('../models/categoria');

// Obtener todas las categorías
exports.obtenerCategorias = async (req, res) => {
    try {
        const categorias = await Categoria.find();
        res.status(200).json(categorias);
    } catch (error) {
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
        const categoriaExistente = await Categoria.findOne({ nombre: nombre.trim() });
        if (categoriaExistente) {
            return res.status(400).json({ message: `La categoría '${nombre}' ya existe.` });
        }

        // Crear una nueva categoría
        const nuevaCategoria = new Categoria({ nombre, descripcion });
        const categoriaGuardada = await nuevaCategoria.save();

        // Responder con la categoría creada
        res.status(201).json({
            message: 'Categoría creada exitosamente',
            categoria: categoriaGuardada
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error al crear categoría',
            error: error.message
        });
    }
};
