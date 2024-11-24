# 🚀 Gestión de Inventarios

Este sistema permite gestionar ventas, productos, facturas, usuarios, categorías y proveedores. Está desarrollado con **Node.js**, **Express**, y utiliza **MongoDB Atlas** como base de datos. La autenticación de usuarios se realiza mediante **JWT (JSON Web Token)** para garantizar la seguridad.

## 📋 Descripción

El proyecto ofrece una solución robusta para la administración de inventarios y registro de transacciones de ventas. Entre sus funcionalidades se encuentran:

- **Gestión de productos:** creación, edición y eliminación.
- **Registro de ventas:** seguimiento detallado de transacciones.
- **Emisión de facturas:** registro y consulta.
- **Control de proveedores y categorías.**
- **Autenticación segura:** uso de tokens para proteger rutas sensibles.

## 🔧 Tecnologías

- **Node.js**: Plataforma de ejecución para el backend.
- **Express**: Framework web para Node.js.
- **MongoDB Atlas**: Base de datos NoSQL.
- **JWT**: Seguridad y autenticación.
- **Bcrypt**: Hash seguro de contraseñas.
- **Dotenv**: Gestión de variables de entorno.
- **Vercel**: Hosting del backend.

## 📥 Instalación

1. Clona el repositorio:
   ```bash
   git clone https://github.com/Em3rc0d/gestion-inventarios.git
   cd gestion-inventarios
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Configura el archivo `.env`:
   ```env
   MONGO_URI=mongodb+srv://<usuario>:<contraseña>@cluster.mongodb.net/<nombreBaseDatos>?retryWrites=true&w=majority
   PORT=3000
   JWT_SECRET=tu_clave_secreta
   ```

4. Inicia el servidor:
   - Modo desarrollo:
     ```bash
     npm run dev
     ```
   - Producción:
     ```bash
     npm start
     ```

## 🛣️ Rutas

### Autenticación
- `POST /api/auth/login`: Inicia sesión y devuelve un token JWT.
- `POST /api/auth/register`: Registra un nuevo usuario.

### Productos
- `GET /api/productos`: Lista todos los productos.
- `POST /api/productos`: Crea un nuevo producto.

### Ventas
- `GET /api/ventas`: Obtiene todas las ventas.
- `POST /api/ventas`: Registra una nueva venta.

### Facturas
- `GET /api/facturas`: Lista todas las facturas.
- `POST /api/facturas`: Genera una nueva factura.

### Proveedores
- `GET /api/proveedores`: Lista todos los proveedores.
- `POST /api/proveedores`: Agrega un nuevo proveedor.

### Categorías
- `GET /api/categorias`: Lista todas las categorías.
- `POST /api/categorias`: Agrega una nueva categoría.

### Usuarios
- `GET /api/usuarios`: Lista todos los usuarios (requiere permisos).

## 🔒 Middleware de Autenticación

Las rutas protegidas requieren un token JWT. Incluye el token en el encabezado `Authorization`:
```bash
Authorization: Bearer <token_jwt>
```

## 🌐 Hosting

El backend está desplegado en **Vercel** para garantizar alta disponibilidad y rendimiento.

## 🤝 Contribuciones

Si deseas contribuir:
1. Crea un fork del repositorio.
2. Crea una rama para tu funcionalidad (`git checkout -b feature/nueva-funcionalidad`).
3. Envía un pull request.
