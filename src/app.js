// -----------------------------------------------------------
// src/app.js
// Monta todo: 
// Express, Handlebars, Socket.io, rutas, conexión a Mongo y eventos WS.
// -----------------------------------------------------------
// 
const express = require('express');
const { engine } = require('express-handlebars');
//const { join, __dirname } = require('./utils/passwJwt');
const { attachUserToViews ,isAuthenticated} = require('./utils/passwJwt');

const userRoutes = require('./routes/sessionRoutes');
const session =require("express-session");
const cookieParser =require("cookie-parser");
// passport
const initializePassport =require("./config/passportConfig.js");
const passport =require("passport");

const Handlebars = require('handlebars');  // para poder hacer el helper if
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');

// Config y DB
const { config } = require('./config/config');
const { conectarDB } = require('./config/db');

// Routers
const userRouter = require('./routes/userRouter');
const cartsRouter = require('./routes/cartsRouter');  
const viewsRouter = require('./routes/viewsRouter');
const productsRouterFactory = require('./routes/productsRouter');
const crudUsersRouter = require('./routes/crudUsersRouter');

// App + HTTP server + Socket.io
const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Middlewares  incorporados de Express
app.use(express.json());   // Formatea los cuerpos json de peticiones entrantes.
app.use(express.urlencoded({ extended: true }));  // Formatea query params de URLs para peticiones entrantes.

// Carpeta pública para archivos estáticos (css, js, imágenes, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// Handlebars
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// ============================================================
// passport 
// ============================================================
app.use(cookieParser());
initializePassport();
app.use(passport.initialize());

// Middleware para pasar datos del usuario a todas las vistas
app.use(attachUserToViews);

// ============================================================
// Rutas API (inyectamos io en productos para emitir en create/delete vía HTTP)
// ============================================================
app.use('/api/products', productsRouterFactory(io)); // Router de productos
app.use('/api/carts', cartsRouter);    // Router de carritos
app.use('/api/users', userRouter);     // Router de usuarios
app.use("/api/sessions", userRoutes);  // Router de sesiones (login, register)
app.use('/crud/users', crudUsersRouter);  // Router CRUD visual de usuarios

// ============================================================
// Rutas, vistas.  Home
// ============================================================
app.use('/', viewsRouter); // sirve también para /:id

// Helper para handelbars para comparación de a === b
Handlebars.registerHelper('isEqual', function(value1, value2) {
  return value1 === value2;
});
Handlebars.registerHelper("ifEquals", function(a, b, options) {
  return (a == b) ? options.fn(this) : options.inverse(this);
});

// ============================================================
// Socket.io: inicializar lista al conectar (la vista realtime se actualiza)
// ============================================================
const ProductsManager = require('./dao/productsManager');
const { pid } = require('process');
const { constants } = require('crypto');
io.on('connection', async (socket) => {
  try {
    const products = await ProductsManager.getAll();
    
    // aquí pido ordenar por code 
    products.sort((a, b) => b.code.localeCompare(a.code));

    socket.emit('products:init', products);
  } catch (e) {
    console.error('WS init error:', e.message);
  }

  // Crear por WS
  socket.on('product:create', async (payload) => {
    try {
      const created = await ProductsManager.create(payload);
      io.emit('product:created', created);
    } catch (e) {
      socket.emit('error:message', e.message);
    }
  });

  // Eliminar por WS
  socket.on('product:delete', async (id) => {
    try {
      const deleted = await ProductsManager.deleteById(id);
      io.emit('product:deleted', String(deleted._id));
    } catch (e) {
      socket.emit('error:message', e.message);
    }
  });
});

// --------------------------------------------------- +
//                    Boot
// --------------------------------------------------- +
(async () => {
  console.log('✋ Esperame, me conecto y te aviso 👷‍♂️')
  console.log(' ')

  // Voy a conexión con Mongo usando Mongoose. En config/db.js
  //    Le paso (url, dbName) usando las constantes definidas en config.js
  await conectarDB(config.MONGO_DB, config.DB_NAME);
  
  // Levanto el servidor HTTP en el puerto 8080
  //    El puerto del listen, está definida en config.js
  server.listen(config.PORT, () => {
    console.log(' ')
    console.log('😊 Todo listo ')
    console.log(' ');
    console.log(` Home      :   http://localhost:${config.PORT}/`);
    console.log(` CRUD Users:   http://localhost:${config.PORT}/crud/Users`);
    console.log(' ');
    console.log(` Real Time :   http://localhost:${config.PORT}/realtimeproducts`);
    console.log(` Paginación:   http://localhost:${config.PORT}/products?page=1&limit=10`);
    console.log(` API Products: http://localhost:${config.PORT}/api/products`);
    console.log(` API Carts :   http://localhost:${config.PORT}/api/carts`);
    console.log(` API Users :   http://localhost:${config.PORT}/api/users`);
  });
})();