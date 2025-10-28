// -----------------------------------------------------------
// src/routes/userRouter.js
// REST completo para usuarios
// -----------------------------------------------------------

const express = require('express');
const userModel = require('../dao/models/userModel');
const router = express.Router();

// Endpoints
// -----------------------------------
// get.  Consultar todos los usuarios
//       Los navegadores hacen get por defecto.
// -----------------------------------
router.get('/', async (req, res) => {
    //   res.status(200).json({ message: "Todos los usuarios", payload: users }); <--hizo en el curso
    try {
        const result = await userModel.find();
        res.send({
            status: 'success',
            payload: result
        });
    } catch (error) {
        res.status(500).send({
            status: 'error',
            message: error.message 
        });
    }
});

// -----------------------------------
// get.  Consultar un usuario por id
// -----------------------------------
router.get('/:uid', async (req, res) => {
    //    res.status(200).json({ message: "Un usuario" }); <--hizo en el curso
    try {
        const result = await userModel.findById(req.params.uid);
        if (!result) {
            return res.status(404).send({
                status: 'error',
                message: 'Usuario no encontrado'
            });
        }
        res.send({
            status: 'success',
            payload: result
        });
    } catch (error) {
        res.status(500).send({
            status: 'error',
            message: error.message
        });
    }
});

// -----------------------------------
// post.  Crear un usuario
// -----------------------------------
router.post('/', async (req, res) => {
    
    const {last_name,first_name, age, email} = req.body;
    try {
        const result = await userModel.create({last_name,first_name, age, email});
        //   res.status(201).json({ message: "Un usuario", payload: newUser }); <--hizo en el curso
        res.send({
            status: 'success',
            payload: result
        });
    } catch (error) {
        res.status(400).send({
            status: 'error',
            message: error.message
        });
    }
});

// -----------------------------------
// put.  Actualizar un usuario
// -----------------------------------
router.put('/:uid', async (req, res) => {
    const uid = req.params.uid;
    const {last_name,first_name, age, email} = req.body;
    try {
        const user = await userModel.findOne({_id: uid});
        if (!user) throw new Error('User not found');

        const newUser = {
            last_name: last_name ?? user.last_name,
            first_name: first_name ?? user.first_name,
            age: age ?? user.age,
            email: email ?? user.email
        }

        const updateUser = await userModel.updateOne({_id: uid}, newUser);
        res.send({
            status: 'success',
            payload: updateUser
        });

    } catch (error) {
        res.status(400).send({
            status: 'error',
            message: error.message
        });
    }
});

// -----------------------------------
// delete.  Eliminar un usuario
// -----------------------------------
router.delete('/:uid', async (req, res) => {
    const uid = req.params.uid;
    try {
        const result = await userModel.deleteOne({_id: uid});
        res.status(200).send({
            status: 'success',
            payload: result
        });
    } catch (error) {
        res.status(400).send({
            status: 'error',
            message: error.message
        });
    }
});
// -----------------------------------
// -----------------------------------

module.exports = router;