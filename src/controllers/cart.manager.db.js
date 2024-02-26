const CartModel = require("../models/cart.models.js");
const ProductModel = require("../models/product.model");

class CartManager {
    
    async createCart() {
        try {
            const newCart = new CartModel({products: []});
            await newCart.save();
            console.log(`Carrito creado: ${newCart}`)
            return newCart
        } catch (error) {
            console.log("Error al intentar crear el carrito nuevo", error);
        }
    }

    async getCarts() {
        try {
            const carts = await CartModel.find();

            if(!carts) {
                console.log(`No se encontro ningun carrito`)
                return null;
            }

            return carts;
        } catch (error) {
            console.log("Error al buscar carritos", error);
        }
    }

    async getCartById(cartId) {
        try {
            const cart = await CartModel.findById(cartId);

            if(!CartModel) {
                console.log(`No se encontro el carrito con el ID: ${cartId}`)
                return null;
            }

            return cart;
        } catch (error) {
            console.log("Error al buscar el carrito por ID", error);
        }
    }

    async addProductToCart(cartId, productId, quantity = 1) {
        try {
            const cart = await this.getCartById(cartId);
            const productExisting = cart.products.find(item => item.product.toString() === productId);
            if(productExisting) {
                productExisting.quantity += quantity;
            } else {
                cart.products.push({product: productId, quantity});
            }

            cart.markModified("products")

            await cart.save();
            return cart;
        } catch (error) {
            console.log(`Error al intentar agregar producto al carrito con ID: ${cartId}`, error);
        }
    }
}

module.exports = CartManager;