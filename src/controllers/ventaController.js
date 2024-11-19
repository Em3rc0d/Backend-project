// src/controllers/ventaController.js
const Venta = require("../models/venta"); // Asegúrate de tener el modelo de Venta definido

// Obtener todas las ventas
exports.obtenerVentas = async (req, res) => {
  try {
    const ventas = await Venta.find();
    res.status(200).json(ventas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Crear una nueva venta
exports.crearVenta = async (req, res) => {
  try {
    const venta = new Venta(req.body);
    await venta.save();
    res.status(201).json(venta);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Obtener venta por ID
exports.obtenerVentaPorId = async (req, res) => {
  try {
    const venta = await Venta.findById(req.params.id);
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
    // Extraer los productos del cuerpo de la solicitud
    const { productos } = req.body;

    // Obtener la venta actual
    const venta = await Venta.findById(req.params.id);

    if (!venta) {
      return res.status(404).json({ message: "Venta no encontrada" });
    }

    // Actualizar productos (agregar o quitar productos)
    // Asegurarnos de que cada producto tenga los datos correctos
    venta.productos = productos.map((producto) => ({
      productoId: producto.productoId, // Asegúrate de que se envíe como ObjectId
      cantidad: producto.cantidad, // La cantidad enviada en la solicitud
      precio_unitario: producto.precio_unitario, // El precio unitario proporcionado
      subtotal: producto.subtotal, // El subtotal calculado en función de la cantidad y precio
    }));

    // Calcular el nuevo total basado en los productos
    const totalVenta = venta.productos.reduce((total, producto) => {
      return total + producto.subtotal;
    }, 0);

    // Actualizar el total de la venta
    venta.total = totalVenta;

    // Guardar los cambios
    const ventaActualizada = await venta.save();

    // Devolver la venta actualizada
    res.status(200).json(ventaActualizada);
  } catch (error) {
    // Manejo de errores
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

exports.filtrarVentas = async (req, res) => {
  try {
    const { tipoFiltro, fechaDesde, fechaHasta, estado } = req.query;

    let query = {};

    if (tipoFiltro === "Fecha") {
      if (fechaDesde) {
        query.fecha = { $gte: new Date(fechaDesde) };
      }
      if (fechaHasta) {
        query.fecha = { $lte: new Date(fechaHasta) };
      }
    }
    if (tipoFiltro === "Estado" && estado) {
      query.estado = estado;
    }

    const ventas = await Venta.find(query);
    res.json(ventas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
