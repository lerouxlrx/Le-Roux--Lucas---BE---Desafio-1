const CartModel = require("../models/cart.models.js");
const CartRepository = require("../repositories/cart.repository.js");
const cartRepository = new CartRepository(); 

class CartManager {
    
    async getCarts(req, res) {
        try {
            const limit = req.query.limit;
            const carts = await cartRepository.findAll();
            if(!carts) {
                console.log(`No se encontro ningun carrito`)
                return null;
            }
            if(limit) {
                res.json(carts.slice(0, limit));
            } else {
                res.json(carts)
            }
        } catch (error) {
            console.log("Error al buscar carritos", error);
        }
    }

    async getCartById(req, res) {
        const id = req.params.cid;
        try {
            const cart = await cartRepository.findByID(id);
            if(!cart) {
                return res.status(404).json({error:`No se encontro el carrito con el ID: ${id}`})
            }
            res.json(cart)
        } catch (error) {
            res.status(500).send("Error al buscar el carrito por ID", error);
        }
    }

    async createCart(req, res) {
        try {
            const newCart = await cartRepository.createCart({products: []})
            res.status(201).json({ message: "Nuevo carrito creado.", cart: newCart });
        } catch (error) {
            res.status(500).json({ error: "Error al crear el carrito" });
        }
    }

    async addProductToCart(req, res) {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const quantity = req.body.quantity || 1;
        
        try {
            await cartRepository.addProductToCart(cartId,productId,quantity)
            res.status(201).json({ message: `Producto agregado al carrito ${cartId}.`, productId, quantity });
        } catch (error) {
            res.status(500).json({ error: "Error al agregar el producto al carrito"+ error });
        }
    }

    async deleteProductFromCart(req, res) {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        
        try {
            const updatedCart = await cartRepository.deleteProductFromCart(cartId, productId);
            res.json({
                status: 'success',
                message: 'Producto eliminado del carrito ',
                updatedCart,
            });
        } catch (error) {
            res.status(500).send("Error en el proceso de eliminar producto del carrito"+error);
        }
    }

    async updateProductsInCart(req, res) {
        const cartId = req.params.cid;
        const updatedProducts = req.body.products;
        try {
            const updatedCart = await cartRepository.updateProductsInCart(cartId, updatedProducts);
            res.json(updatedCart);
        } catch (error) {
            res.status(500).send("Error en el proceso de actualizar productos en el carrito"+ error);
        }
    }
    

    async updateProductQuantityInCart(req, res) {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const newQuantity = req.body.quantity;
    
        try {
            await cartRepository.updateQuantityInCart(cartId, productId, newQuantity);
            res.status(200).json({ message: `Se actualizó la cantidad del producto en el carrito ${cartId}.` });
        } catch (error) {
            console.log("Error al actualizar la cantidad del producto en el carrito:", error);
            res.status(500).json({ error: "Error al actualizar la cantidad del producto en el carrito." });
        }
    }

    async deleteAllProductsFromCart(req, res) {
        const cartId = req.params.cid;
        try {
            const updatedCart = await cartRepository.emptyCart(cartId);

            res.json({
                status: 'success',
                message: 'Los productos del carrito fueron eliminados.',
                updatedCart,
            });

        } catch (error) {
            res.status(500).send("Error en el proceso de eliminar los productos del carrito");
        }
    }
}

module.exports = CartManager;