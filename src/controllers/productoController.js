const Producto = require('../models/producto'); // Modelo de Producto

// Obtener todos los productos
exports.obtenerProductos = async (req, res) => {
    try {
        const productos = await Producto.find();
        res.status(200).json(productos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Crear o actualizar un producto (incrementar stock si ya existe)
exports.crearProducto = async (req, res) => {
    const { nombre, precio_unitario, cantidad_stock, categoria, proveedor } = req.body;

    try {
        // Buscar producto por nombre
        const productoExistente = await Producto.findOne({ nombre });

        if (productoExistente) {
            // Actualizar stock si el producto existe
            productoExistente.cantidad_stock += cantidad_stock || 0;
            const productoActualizado = await productoExistente.save();
            return res.status(200).json({
                message: 'Stock actualizado',
                producto: productoActualizado,
            });
        }

        // Crear un nuevo producto
        const nuevoProducto = new Producto({
            nombre,
            precio_unitario,
            cantidad_stock,
            categoria,
            proveedor,
        });

        const productoGuardado = await nuevoProducto.save();
        res.status(201).json({
            message: 'Producto creado exitosamente',
            producto: productoGuardado,
        });
    } catch (error) {
        console.error(error);
        res.status(400).json({
            message: 'Error al procesar la solicitud',
            error: error.message,
        });
    }
};

// Obtener un producto por ID
exports.obtenerProductoPorId = async (req, res) => {
    try {
        const producto = await Producto.findById(req.params.id);
        if (!producto) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        res.status(200).json(producto);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Actualizar un producto por ID
exports.actualizarProducto = async (req, res) => {
    try {
        const producto = await Producto.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!producto) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        res.status(200).json(producto);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Eliminar un producto por ID
exports.eliminarProducto = async (req, res) => {
    try {
        const producto = await Producto.findByIdAndDelete(req.params.id);
        if (!producto) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        res.status(200).json({ message: 'Producto eliminado' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
