// -----------------------------------------------------------
// src/routes/crudUsersRouter.js
// CRUD visual para users (usa Handlebars)
// -----------------------------------------------------------

const express = require('express');
const router = express.Router();
const userModel = require('../dao/models/userModel');
const bcrypt = require('bcrypt');

// -----------------------------------------------------------
// GET /crud/users - Lista todos los usuarios y muestra el formulario
// -----------------------------------------------------------
router.get('/', async (req, res) => {
  try {
    const users = await userModel.find().lean(); // lean() optimiza la vista
    res.render('crudUsers', { title: 'CRUD Usuarios', users });
  } catch (err) {
    res.status(500).send(`Error al obtener usuarios: ${err.message}`);
  }
});

// -----------------------------------------------------------
// POST /crud/users - Crea un nuevo usuario
// -----------------------------------------------------------
router.post('/', async (req, res) => {
  try {
    const { first_name, last_name, email, age, password, role } = req.body;
    const password_hash = bcrypt.hashSync(password, bcrypt.genSaltSync(10));

    await userModel.create({
      first_name,
      last_name,
      email,
      age,
      password: password_hash,
      role,
    });

    res.redirect('/crud/users');
  } catch (err) {
    res.status(500).send(`Error al crear usuario: ${err.message}`);
  }
});

// -----------------------------------------------------------
// PUT /crud/users/:id - Actualiza un usuario existente
// -----------------------------------------------------------
router.put('/:id', async (req, res) => {
  try {
    const { first_name, last_name, email, age, role } = req.body;
    const updatedUser = await userModel.findByIdAndUpdate(
      req.params.id,
      { first_name, last_name, email, age, role },
      { new: true }
    );
    res.json({ message: 'Usuario actualizado', updatedUser });
  } catch (err) {
    res.status(500).json({ message: `Error al actualizar: ${err.message}` });
  }
});

// -----------------------------------------------------------
// DELETE /crud/users/:id - Elimina un usuario
// -----------------------------------------------------------
router.delete('/:id', async (req, res) => {
  try {
    await userModel.findByIdAndDelete(req.params.id);
    res.json({ message: 'Usuario eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ message: `Error al eliminar: ${err.message}` });
  }
});

module.exports = router;