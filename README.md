🚀 Gestión de Inventarios
Este es un sistema de gestión de inventarios que permite gestionar ventas, productos, facturas, usuarios, categorías y proveedores. El proyecto utiliza Node.js, Express y MongoDB como base de datos, y JWT para la autenticación de usuarios.

📋 Descripción
Este proyecto tiene como objetivo proporcionar una interfaz de administración para gestionar un inventario de productos y registrar transacciones de ventas. Los usuarios pueden:

Crear productos
Registrar ventas
Emitir facturas
Gestionar proveedores y categorías de productos
Además, la autenticación de usuarios se realiza mediante JWT (JSON Web Token), lo que permite una seguridad eficiente en las rutas protegidas.

🔧 Tecnologías
Este proyecto está construido con las siguientes tecnologías:

Node.js: Plataforma de ejecución para el backend.
Express: Framework web para Node.js.
MongoDB: Base de datos NoSQL para almacenar los datos.
JWT: JSON Web Token para la autenticación de usuarios.
Bcrypt: Librería para el hash de contraseñas.
dotenv: Gestión de variables de entorno.
Nodemon: Herramienta para reiniciar el servidor durante el desarrollo.
📥 Instalación
1. Clona el repositorio:
bash
Copiar código
git clone https://github.com/Em3rc0d/gestion-inventarios.git
2. Instala las dependencias:
bash
Copiar código
cd gestion-inventarios
npm install
3. Crea un archivo .env en la raíz del proyecto con la siguiente configuración:
env
Copiar código
MONGO_URI=mongodb://localhost:27017/gestion_inventarios
PORT=3000
JWT_SECRET=tu_clave_secreta
4. Inicia el servidor:
Para desarrollo:
bash
Copiar código
npm run dev
Para producción:
bash
Copiar código
npm start
🛣️ Rutas
Autenticación
POST /api/auth/login: Inicia sesión y devuelve un JWT.
POST /api/auth/register: Registra un nuevo usuario.
Productos
GET /api/productos: Obtiene todos los productos.
POST /api/productos: Crea un nuevo producto.
Ventas
GET /api/ventas: Obtiene todas las ventas.
POST /api/ventas: Crea una nueva venta.
Facturas
GET /api/facturas: Obtiene todas las facturas.
POST /api/facturas: Crea una nueva factura.
Proveedores
GET /api/proveedores: Obtiene todos los proveedores.
POST /api/proveedores: Crea un nuevo proveedor.
Categorías
GET /api/categorias: Obtiene todas las categorías.
POST /api/categorias: Crea una nueva categoría.
🔒 Middleware de Autenticación
Para proteger las rutas de la API, se utiliza JWT. Es necesario enviar el token JWT en el encabezado Authorization para acceder a las rutas protegidas.

Ejemplo de cómo incluir el token en la solicitud:
bash
Copiar código
Authorization: Bearer <token_jwt>
🤝 Contribuciones
Si deseas contribuir a este proyecto, por favor crea un pull request o abre un issue para discutir nuevas funcionalidades.