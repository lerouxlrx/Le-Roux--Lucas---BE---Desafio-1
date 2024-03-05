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

    async deleteProductFromCart(cartId, productId) {
        try {
            const cart = await this.getCartById(cartId);
    
            cart.products = cart.products.filter(item => item.product.toString() !== productId);
    
            await cart.save();
            return cart;
        } catch (error) {
            throw new Error("Error al eliminar el producto del carrito.");
        }
    }

    async updateCart(cartId, updatedProducts) {
        try {
            const cart = await CartModel.findById(cartId);
    
            if (!cart) {
                console.log(`Carrito con ID ${cartId} no encontrado.`);
                return null;
            }
    
            cart.products = updatedProducts;

            await cart.save();
            console.log(`Carrito actualizado con ID: ${cartId}`);
            return cart;
        } catch (error) {
            console.log(`Error al actualizar el carrito con ID: ${cartId}`, error);
            throw error;
        }
    }

    async updateProductQuantityInCart(cartId, productId, newQuantity) {
        try {
            const cart = await CartModel.findById(cartId);

            if (!cart) {
                throw new Error(`No se encontró el carrito con el ID ${cartId}.`);
            }

            const productIndex = cart.products.findIndex(item => item.product.toString() === productId);

            if (productIndex === -1) {
                throw new Error(`No se encontró el producto con el ID ${productId} en el carrito.`);
            }

            cart.products[productIndex].quantity = newQuantity;

            await cart.save();

            console.log(`Se actualizó la cantidad del producto ${productId} en el carrito ${cartId} a ${newQuantity}.`);
        } catch (error) {
            console.log("Error al actualizar la cantidad del producto en el carrito:", error);
            throw error;
        }
    }

    async deleteAllProductsFromCart(cartId) {
        try {
            const cart = await CartModel.findById(cartId);

            if (!cart) {
                throw new Error(`No se encontró el carrito con el ID ${cartId}.`);
            }

            cart.products = [];

            await cart.save();

            console.log(`Se eliminaron todos los productos del carrito ${cartId}.`);
        } catch (error) {
            console.log("Error al eliminar todos los productos del carrito:", error);
            throw error;
        }
    }
}

module.exports = CartManager;