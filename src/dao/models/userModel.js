// -----------------------------------------------------------
// src/dao/models/userModel.js
// Usuarios con campos básicos 
// -----------------------------------------------------------
const { hash } = require('bcrypt');
const mongoose = require('mongoose');
const userCollection = "users"; 

const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true,
        max: 100
    },
    last_name: {
        type: String,
        required: true,
        max: 100
    },
    email: {
        type: String,
        unique: true,
        required: true,
        max: 100
    },
    age: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true,
        max: 100
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user' 
    },
    cart:{
        type: String,
        default: '68feed60a1dc6c7b297ed569'
    }
});

// 'users' es el nombre de la collection
    // cart:{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'carts',
    //     required: true
    // }

const userModel = mongoose.model(userCollection, userSchema);
module.exports = userModel;