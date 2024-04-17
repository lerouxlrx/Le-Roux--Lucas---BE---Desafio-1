const CartModel = require("../models/cart.models.js");

class CartRepository {
    async createCart(cartData) {
        try {
            const newCart = new CartModel(cartData);
            await this.saveCart(newCart)
            return newCart
        } catch (error) {
            throw new Error("Error al crear un carrito");
        }
    }

    async saveCart(newCart) {
        try {
            await newCart.save();
            return newCart
        } catch (error) {
            throw new Error("Error al guardar un carrito");
        }
    }

    async findAll() {
        try {
            const carts = await CartModel.find()
            return carts
        } catch (error) {
            throw new Error("Error al leer todos los carritos.");
        }
    }

    async findByID(id) {
        try {
            const cart = await CartModel.findById(id)
            return cart
        } catch (error) {
            throw new Error("Error al leer carrito por ID.");
        }
    }

    async addProductToCart(id) {
        try {
            const cart = await CartModel.findById(id)
            return cart
        } catch (error) {
            throw new Error("Error al leer carrito por ID.");
        }
    }
}

module.exports = CartRepository;