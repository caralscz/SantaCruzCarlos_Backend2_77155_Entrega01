
# E-commerce con Autenticación y Autorización. Contiene un CRUD de usuarios

## Objetivo

  El e-commerce existente del curso anterior, fué desarrollado como una API RESTful con Node.js, Express, Handlebars y Socket.io para la gestión de productos y carritos de compra en tiempo real, con persistencia en sistema de archivos mongoDB.
  Sobre esa base, se debe implementar un sistema de "login" de usuario con encriptación de contraseñas y que trabaje con JWT (JSON Web Tokens)
  Se debe hacer un CRUD de usuarios

## Pre-Entrega 01
- Curso: Backend II: DISEÑO Y ARQUITECTURA BACKEND 
- Comisión 77155 del 23/sept/2025 al 11/nov/2025 los Martes de 19:00 a 21:00h
- Alumno:  Carlos Alfredo santa Cruz
- Profesor: Daniel Riverol -  Adjunto o Tutor: Andrés Rubio 

---

## Requisitos
- Implementar un CRUD de usuarios, junto con un sistema de Autenticación y Autorización.
  El crud se implementó sobre http://localhost:8080/crud/Users 

- Modelo de Usuario: 
  Crear un modelo User que contenga los siguientes campos:
      first_name: String      
      last_name: String
      email: String (debe ser único)      
      age: Number      
      password: String (en formato hash)      
      cart: Id con referencia a Carts      
      role: String (valor por defecto: 'user')

- Encriptación de Contraseña:
  Utilizar el paquete bcrypt para encriptar la contraseña del usuario mediante el método hashSync.

- Sistema de Login:
  Implementar un sistema de login del usuario que trabaje con JWT (JSON Web Tokens).

-  Sistema de Login y Generación de Token JWT: Que el sistema de login permita a los usuarios autenticarse y generar un token JWT válido.
  Que los usuarios pueden iniciar sesión de manera exitosa y se les asigna un token JWT.
  Que el token JWT sea válido y pueda utilizarse para realizar acciones protegidas en la aplicación.

- Agregar a la vista de productos un mensaje de bienvenida con los datos del usuario
  Agregar un usuario que en el login tenga como correo adminCoder@coder.com, y la contraseña adminCod3r123, el cual será "admin"
  Todos los usuarios que no sean admin deberán contar con un rol “usuario”.
  Implementar botón de “logout” para destruir la sesión

- El index de la aplicacion es "src/app.js"
  El CRUD  de usuarios (/crud/users) se define en "src/routes/crudUsersRouter.js"
  Ubicación del archivo "src/dao/models/userModel.js"

---
## Instalación  ⚙️

1. Clona el repositorio o crea los archivos del proyecto

2. Instala las dependencias:
```bash
npm install 
```

3. Ejecuta el servidor:
```bash
# npm start
```

5. Luego podrá acceder a la aplicación desde cualquier navegador en **localhost** desde

- 🚀 Home [http://localhost:8080](http://localhost:8080)
- 🧑🏽‍🦰 CRUD Users:   [http://localhost:8080/crud/Users](http://localhost:8080/crud/Users)
- ⚡ Real Time [http://localhost:8080/realtimeproducts](http://localhost:8080/realtimeproducts)
- 📦 [http://localhost:8080/api/products](http://localhost:8080/api/products)
- 🛒 [http://localhost:8080/api/carts](http://localhost:8080/api/carts)


