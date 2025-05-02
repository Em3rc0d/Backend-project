-- ================================
-- CREACIÓN DE TABLAS
-- ================================

-- Tabla de Usuarios
CREATE TABLE IF NOT EXISTS usuarios (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password TEXT NOT NULL,
  rol VARCHAR(50) NOT NULL CHECK (rol IN ('admin', 'vendedor')),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Categorías
CREATE TABLE IF NOT EXISTS categorias (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) UNIQUE NOT NULL,
  descripcion VARCHAR(255),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Proveedores
CREATE TABLE IF NOT EXISTS proveedores (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  direccion VARCHAR(200),
  telefono VARCHAR(9) CHECK (telefono ~ '^[0-9]{9}$'),
  email VARCHAR(100) UNIQUE NOT NULL CHECK (email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$'),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Productos
CREATE TABLE IF NOT EXISTS productos (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) UNIQUE NOT NULL,
  precio_unitario FLOAT NOT NULL CHECK (precio_unitario >= 0),
  cantidad_stock INTEGER NOT NULL DEFAULT 0 CHECK (cantidad_stock >= 0),
  categoria VARCHAR(100) NOT NULL,
  proveedor VARCHAR(100) NOT NULL,
  categoriaId INTEGER REFERENCES categorias(id) ON DELETE SET NULL,
  proveedorId INTEGER REFERENCES proveedores(id) ON DELETE SET NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Ventas
CREATE TABLE IF NOT EXISTS ventas (
  id SERIAL PRIMARY KEY,
  cliente VARCHAR(100) NOT NULL,
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  estado VARCHAR(20) NOT NULL DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'completada', 'cancelada')),
  total FLOAT NOT NULL CHECK (total >= 0),
  productos JSONB,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Facturas
CREATE TABLE IF NOT EXISTS facturas (
  id SERIAL PRIMARY KEY,
  numero VARCHAR(100) UNIQUE NOT NULL,
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  total FLOAT NOT NULL,
  cliente VARCHAR(100) NOT NULL,
  direccion VARCHAR(255) NOT NULL,
  ruc VARCHAR(20) NOT NULL,
  telefono VARCHAR(20) NOT NULL,
  estado VARCHAR(20) DEFAULT 'emitida' CHECK (estado IN ('emitida', 'anulada')),
  productos JSONB,
  ventaId INTEGER REFERENCES ventas(id) ON DELETE SET NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
