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
    const { productos, cliente, fecha, estado } = req.body;

    // Validar que cliente, productos y su estructura sean correctos
    if (!cliente || !productos || !Array.isArray(productos) || productos.length === 0) {
        return res.status(400).json({
            message: "Datos incompletos: cliente o productos faltantes o con formato incorrecto.",
        });
    }

    // Sanitizar productos para asegurar que solo procesamos lo necesario
    const productosSanitizados = productos.map(({ productoId, cantidad }) => ({
        productoId,
        cantidad,
    }));

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const detalleProductos = [];
        let total = 0;

        for (const item of productosSanitizados) {
            // Validar estructura de producto
            if (!item.productoId || !item.cantidad || item.cantidad <= 0) {
                throw new Error("Cada producto debe tener un ID válido y una cantidad mayor a 0.");
            }

            // Buscar producto en la base de datos
            const producto = await Producto.findById(item.productoId).session(session);

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

            // Calcular subtotal y reducir stock
            const subtotal = producto.precio_unitario * item.cantidad;
            total += subtotal;
            producto.cantidad_stock -= item.cantidad;

            // Guardar cambios en el producto
            await producto.save({ session });

            // Agregar al detalle de productos
            detalleProductos.push({
                nombre: producto.nombre,
                productoId: producto._id,
                precio_unitario: producto.precio_unitario,
                cantidad: item.cantidad,
                subtotal,
            });
        }

        // Crear y guardar la venta
        const nuevaVenta = new Venta({
            cliente,
            productos: detalleProductos,
            total,
            fecha: fecha || new Date(), // Usa la fecha proporcionada o la actual
            estado: estado || 'pendiente', // Usa el estado proporcionado o un valor por defecto
        });

        const ventaGuardada = await nuevaVenta.save({ session });

        await session.commitTransaction();
        session.endSession();

        return res.status(201).json({
            message: "Venta registrada exitosamente.",
            venta: ventaGuardada,
        });
    } catch (error) {
        // Revertir transacción en caso de error
        await session.abortTransaction();
        session.endSession();

        console.error("Error al registrar la venta:", error);
        return res.status(400).json({
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
