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

    async addProductToCart(id, productId, quantity = 1) {
        try {
            const cart = await CartModel.findById(id);
            const existingProduct = cart.products.find(item => item.product._id.toString() === productId);
            if (existingProduct) {
                existingProduct.quantity += quantity;
            } else {
                cart.products.push({product: productId, quantity})
            }

            cart.markModified("products");
            await cart.save();            
            return cart;
        } catch (error) {
            throw new Error("Error al leer carrito por ID."+ error);
        }
    }

    async deleteProductFromCart(cartId, productId) {
        try {
            const cart = await CartModel.findById(cartId);
            if (!cart) {
                throw new Error("Carrito no encontrado para eliminar.");
            }

            cart.products = cart.products.filter(item => item.product._id.toString() !== productId);

            await cart.save();
            return cart;
        } catch (error) {
            throw new Error("Error en el proceso de eliminar producto de carrito"+error);
        }
    }

    async updateProductsInCart(cartId, updatedProducts) {
        try {
            const cart = await CartModel.findById(cartId);

            if (!cart) {
                throw new Error("Carrito no encontrado para actualizar productos.");
            }

            cart.products = updatedProducts;
            
            cart.markModified("products");
            await cart.save();
            return cart;
        } catch (error) {
            throw new Error("Error en el proceso para actualizar productos en carrtito.");
        }
    }

    async updateQuantityInCart(cartId, productId, newQuantity) {
        try {
            const cart = await CartModel.findById(cartId);
            console.log(cart)
            if (!cart) {
                throw new Error("Carrito no encontrado para actualizar cantidades.");
            }

            const productIndex = cart.products.findIndex(item => item.product._id.toString() === productId);

            if (productIndex !== -1) {
                cart.products[productIndex].quantity = newQuantity;
                
                cart.markModified("products");
                await cart.save();
                return cart;
            } else {
                throw new Error("Producto no encontrado en el carrito para actualizar cantidad.")
            }
        } catch (error) {
            throw new Error("Error en el proceso de actualizar cantidad en carrito."+error);
        }
    }

    async emptyCart (cartId) {
        try {
            const cart = await CartModel.findByIdAndUpdate(
                cartId,
                { products: [] },
                { new: true }
            )

            if (!cart) {
                throw new Error("Carrito no encontrado para vaciar.");
            }

            return cart;

        } catch (error) {
            throw new Error("Error en proceso de vaciar carrito.");
        }
    }

}

module.exports = CartRepository;