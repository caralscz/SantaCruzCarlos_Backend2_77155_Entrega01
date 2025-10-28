// -----------------------------------------------------------
// src/dao/models/cartsModel.js
// Array de productos con referencia a products y quantity. Timestamps activados.
// -----------------------------------------------------------
const mongoose = require('mongoose');
// *import mongoose from 'mongoose';

const cartProductSchema = new mongoose.Schema(
  {
    product: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'products',   // lo relaciono a esta collection
      required: true },
    quantity: { type: Number, default: 1 }
  },
  { _id: false }
);

const cartSchema = new mongoose.Schema(
  {
    products: { type: [cartProductSchema], default: [] }
  },
  { timestamps: true, 
    versionKey: false,
      strict:true }      // no permitir nombres no definidos

);

// export const CartModel = mongoose.model('carts', cartSchema); // así es con import

// 'carts' es el nombre de la collection
const CartModel = mongoose.model('carts', cartSchema);
module.exports =  CartModel ;