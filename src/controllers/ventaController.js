const mongoose = require("mongoose");
const Venta = require("../models/venta");
const Producto = require("../models/producto");

// Obtener todas las ventas
exports.obtenerVentas = async (req, res) => {
    try {
        const ventas = await Venta.find().populate("productos.productoId", "nombre precio_unitario");
        res.status(200).json(ventas);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Crear una nueva venta con verificación de stock
exports.crearVenta = async (req, res) => {
    const { productos, cliente } = req.body;

    // Validar que los productos y el cliente estén presentes
    if (!productos || productos.length === 0) {
        return res.status(400).json({ message: "La lista de productos no puede estar vacía." });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Lista para almacenar los detalles de productos
        const detalleProductos = [];
        let total = 0;

        for (const item of productos) {
            // Buscar producto en la base de datos
            const producto = await Producto.findById(item.productoId).session(session);

            // Validar existencia del producto
            if (!producto) {
                throw new Error(`Producto con ID ${item.productoId} no encontrado.`);
            }

            // Validar stock
            if (producto.cantidad_stock < item.cantidad) {
                throw new Error(
                    `Stock insuficiente para el producto "${producto.nombre}". 
                     Disponible: ${producto.cantidad_stock}, Requerido: ${item.cantidad}.`
                );
            }

            // Calcular subtotal y reducir el stock
            const subtotal = producto.precio_unitario * item.cantidad;
            total += subtotal;
            producto.cantidad_stock -= item.cantidad;

            // Guardar cambios en el producto
            await producto.save({ session });

            // Agregar el detalle del producto
            detalleProductos.push({
                productoId: producto._id,
                nombre: producto.nombre,
                precio_unitario: producto.precio_unitario,
                cantidad: item.cantidad,
                subtotal,
            });
        }

        // Crear la venta
        const nuevaVenta = new Venta({
            cliente,
            productos: detalleProductos,
            total,
        });

        // Guardar la venta en la base de datos
        const ventaGuardada = await nuevaVenta.save({ session });

        // Confirmar la transacción
        await session.commitTransaction();
        session.endSession();

        res.status(201).json({
            message: "Venta registrada exitosamente.",
            venta: ventaGuardada,
        });
    } catch (error) {
        // Revertir la transacción en caso de error
        await session.abortTransaction();
        session.endSession();

        res.status(400).json({
            message: "Error al registrar la venta.",
            error: error.message,
        });
    }
};


// Obtener venta por ID
exports.obtenerVentaPorId = async (req, res) => {
    try {
        const venta = await Venta.findById(req.params.id).populate("productos.productoId", "nombre precio_unitario");
        if (!venta) {
            return res.status(404).json({ message: "Venta no encontrada" });
        }
        res.status(200).json(venta);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Actualizar venta por ID
exports.actualizarVenta = async (req, res) => {
    try {
        const { productos } = req.body;

        const venta = await Venta.findById(req.params.id);
        if (!venta) {
            return res.status(404).json({ message: "Venta no encontrada" });
        }

        venta.productos = productos.map((producto) => ({
            productoId: producto.productoId,
            nombre: producto.nombre,
            cantidad: producto.cantidad,
            precio_unitario: producto.precio_unitario,
            subtotal: producto.subtotal,
        }));

        const totalVenta = venta.productos.reduce((total, producto) => total + producto.subtotal, 0);
        venta.total = totalVenta;

        const ventaActualizada = await venta.save();
        res.status(200).json(ventaActualizada);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Eliminar venta por ID
exports.eliminarVenta = async (req, res) => {
    try {
        const venta = await Venta.findByIdAndDelete(req.params.id);
        if (!venta) {
            return res.status(404).json({ message: "Venta no encontrada" });
        }
        res.status(200).json({ message: "Venta eliminada" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Filtrar ventas
exports.filtrarVentas = async (req, res) => {
    try {
        const { tipoFiltro, fechaDesde, fechaHasta, estado, cliente, totalMinimo, totalMaximo } = req.query;

        let query = {};

        if (tipoFiltro === "Fecha") {
            query.fecha = {};
            if (fechaDesde) query.fecha.$gte = new Date(fechaDesde);
            if (fechaHasta) query.fecha.$lte = new Date(fechaHasta);
        }

        if (tipoFiltro === "Estado" && estado) query.estado = estado;

        if (tipoFiltro === "Cliente" && cliente) query.cliente = { $regex: cliente, $options: "i" };

        if (tipoFiltro === "Total") {
            query.total = {};
            if (totalMinimo) query.total.$gte = parseFloat(totalMinimo);
            if (totalMaximo) query.total.$lte = parseFloat(totalMaximo);
        }

        if (Object.keys(query).length === 0) {
            return res.status(400).json({ message: "No se proporcionaron criterios de filtrado válidos." });
        }
        
        const ventas = await Venta.find(query).populate("productos.productoId", "nombre precio_unitario");
        res.json(ventas);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
