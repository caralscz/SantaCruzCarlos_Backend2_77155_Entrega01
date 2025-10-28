// -----------------------------------------------------------
// src/dao/cartsManager.js
// Crear carrito, obtener carrito, agregar producto (incrementa 
// cantidad si existe), eliminar carrito, eliminar producto del carrito.
// -----------------------------------------------------------

const  CartModel  = require('./models/cartsModel');
// const { CartModel } = require('./models/cartsModel');
// const { ProductModel } = require('./models/productsModel');
const  ProductModel  = require('./models/productsModel');

class CartsManager {
  static async getAll() {
    return await CartModel.find().lean();
  }

  static async createCart() {
    const cart = await CartModel.create({ products: [] });
    return cart.toObject();
  }

  // traigo un solo carrito con populate 
  static async getCartById(id) {
    // populate para traer datos del producto
    return await CartModel.findById(id).populate('products.product').lean();
    // return await CartModel.findById(id).lean();
  }

  static async addProductToCart(cid, pid, quantity = 1) {
    // Buscamos si existe el carrito
    let cart = await CartModel.findById(cid);
    if (!cart) throw new Error('addProductToCart: Carrito no encontrado');

    // verificamos si el producto existe
    const exists = await ProductModel.exists({ _id: pid });
    if (!exists) throw new Error('addProductToCart. Producto no encontrado');

    // Miro si ya está en el carrito
    const item = cart.products.find(p => String(p.product) === String(pid));
    if (item) {
      item.quantity += Number(quantity);  // si lo encuentra , suma 1
    } else {
      cart.products.push({ product: pid, quantity: Number(quantity) });
    }

    await cart.save();
    //  return cart.toObject();  // aquí devolvemos sin populate
    // aqui devolvemos con populate
      cart = await CartModel.findById(cid)
             .populate('products.product')  // Expandimos el producto con populate
             .lean();

    return cart;

  }

  static async deleteCart(cid) {
    const deleted = await CartModel.findByIdAndDelete(cid).lean();
    if (!deleted) throw new Error('Carrito no encontrado');
    return deleted;
  }

  static async removeProductFromCart(cid, pid) {
    const cart = await CartModel.findById(cid);
    if (!cart) throw new Error('Carrito no encontrado');

    const before = cart.products.length;
    cart.products = cart.products.filter(p => String(p.product) !== String(pid));

    if (cart.products.length === before) {
      throw new Error('Producto no estaba en el carrito');
    }

    await cart.save();
    return cart.toObject();
  }
}

module.exports = CartsManager;