const Categoria = require('../models/categoria');

exports.obtenerCategorias = async (req, res) => {
    try {
        const categorias = await Categoria.find();
        res.json(categorias);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener categorías', error });
    }
};

exports.crearCategoria = async (req, res) => {
    const { nombre, descripcion } = req.body;

    if (!nombre || typeof nombre !== 'string' || nombre.trim() === '') {
        return res.status(400).json({
            message: "El campo 'nombre' es obligatorio y debe ser una cadena de texto válida."
        });
    }

    try {
        const nuevaCategoria = new Categoria({ nombre, descripcion });
        const categoriaGuardada = await nuevaCategoria.save();
        res.status(201).json(categoriaGuardada);
    } catch (error) {
        res.status(400).json({
            message: 'Error al crear categoría',
            error: error.message
        });
    }
};