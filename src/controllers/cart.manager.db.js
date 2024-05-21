const CartRepository = require("../repositories/cart.repository.js");
const cartRepository = new CartRepository();
const ProductRepository = require("../repositories/product.repository.js");
const productRepository = new ProductRepository();
const TicketModel = require("../models/ticket.models.js");
const UserModel = require("../models/user.model.js");
const { generateUniqueCode, calculateTotal } = require("../utils/cartutils.js");
const EmailManager = require("../services/email.js");
const emailManager = new EmailManager

class CartManager {
    
    async getCarts(req, res) {
        try {
            const limit = req.query.limit;
            const carts = await cartRepository.findAll();
            if(!carts) {
                req.logger.warning(`No se encontró ningún carrito`);
                return res.status(404).json({ error: "No se encontró ningún carrito" });
            }
            if(limit) {
                res.json(carts.slice(0, limit));
            } else {
                res.json(carts)
            }
        } catch (error) {
            req.logger.error("Error al buscar carritos", error);
            res.status(500).json({ error: "Error en el proceso de leer carritos" });
        }
    }

    async getCartById(req, res) {
        const id = req.params.cid;
        try {
            const cart = await cartRepository.findByID(id);
            if(!cart) {
                return res.status(404).json({error:`No se encontró el carrito con el ID: ${id}`})
            }
            res.json(cart)
        } catch (error) {
            req.logger.error("Error al buscar el carrito por ID", error);
            res.status(500).send("Error al buscar el carrito por ID");
        }
    }

    async createCart(req, res) {
        try {
            const newCart = await cartRepository.createCart({products: []})
            req.logger.info("Nuevo carrito creado", newCart);
            res.status(201).json({ message: "Nuevo carrito creado.", cart: newCart });
        } catch (error) {
            req.logger.error("Error al crear el carrito", error);
            res.status(500).json({ error: "Error al crear el carrito" });
        }
    }

    async addProductToCart(req, res) {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const quantity = req.body.quantity || 1;
        
        try {
            const product = await productRepository.findByID(productId);

            if (!product) {
                req.logger.warning(`Producto no encontrado para agregar al carrito.`);
                return res.status(404).json({ message: 'Producto no encontrado para agregar al carrito.' });
            }

            if (req.user.role === 'premium' && product.owner === req.user.email) {
                req.logger.warning(`No puedes agregar tu producto al carrito.`);
                return res.status(403).json({ message: 'No puedes agregar tu producto al carrito.' });
            }

            await cartRepository.addProductToCart(cartId,productId,quantity)
            req.logger.info(`Producto agregado al carrito ${cartId}. Producto: ${productId}, Cantidad: ${quantity}`);
            res.redirect(`/carts/${cartId}`)
        } catch (error) {
            req.logger.error("Error al agregar el producto al carrito", error);
            res.status(500).json({ error: "Error al agregar el producto al carrito"+ error });
        }
    }

    async deleteProductFromCart(req, res) {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        
        try {
            const updatedCart = await cartRepository.deleteProductFromCart(cartId, productId);
            req.logger.info(`Producto eliminado del carrito ${cartId}. Producto: ${productId}`);
            res.json({
                status: 'success',
                message: 'Producto eliminado del carrito ',
                updatedCart,
            });
        } catch (error) {
            req.logger.error("Error en el proceso de eliminar producto del carrito", error);
            res.status(500).send("Error en el proceso de eliminar producto del carrito"+error);
        }
    }

    async updateProductsInCart(req, res) {
        const cartId = req.params.cid;
        const updatedProducts = req.body.products;
        try {
            const updatedCart = await cartRepository.updateProductsInCart(cartId, updatedProducts);
            req.logger.info(`Productos actualizados en el carrito ${cartId}.`, updatedProducts);
            res.json(updatedCart);
        } catch (error) {
            req.logger.error("Error en el proceso de actualizar productos en el carrito", error);
            res.status(500).send("Error en el proceso de actualizar productos en el carrito"+ error);
        }
    }
    
    async updateProductQuantityInCart(req, res) {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const newQuantity = req.body.quantity;
    
        try {
            await cartRepository.updateQuantityInCart(cartId, productId, newQuantity);
            req.logger.info(`Se actualizó la cantidad del producto en el carrito ${cartId}. Producto: ${productId}, Nueva Cantidad: ${newQuantity}`);
            res.status(200).json({ message: `Se actualizó la cantidad del producto en el carrito ${cartId}.` });
        } catch (error) {
            req.logger.error("Error al actualizar la cantidad del producto en el carrito:", error);
            res.status(500).json({ error: "Error al actualizar la cantidad del producto en el carrito." });
        }
    }

    async deleteAllProductsFromCart(req, res) {
        const cartId = req.params.cid;
        try {
            const updatedCart = await cartRepository.emptyCart(cartId);
            req.logger.info(`Productos eliminados del carrito ${cartId}.`);
            res.json({
                status: 'success',
                message: 'Los productos del carrito fueron eliminados.',
                updatedCart,
            });

        } catch (error) {
            req.logger.error("Error en el proceso de eliminar los productos del carrito", error);
            res.status(500).send("Error en el proceso de eliminar los productos del carrito");
        }
    }

    async checkOut(req, res) {
        const cartId = req.params.cid;
        try {
            const cart = await cartRepository.findByID(cartId);
            const products = cart.products;

            const productsNotAvailable = [];

            for (const item of products) {
                const productId = item.product;
                const product = await productRepository.findByID(productId);
                if (product.stock >= item.quantity) {
                    product.stock -= item.quantity;
                    await product.save();
                } else {
                    productsNotAvailable.push(productId);
                }
            }

            const userWithCart = await UserModel.findOne({ cart: cartId });

            const ticket = new TicketModel({
                code: generateUniqueCode(),
                purchase_datetime: new Date(),
                amount: calculateTotal(cart.products),
                purchaser: userWithCart._id
            });
            await ticket.save();

            cart.products = cart.products.filter(item => productsNotAvailable.some(productId => productId.equals(item.product)));
            const userEmail = req.user.email;
            await cart.save();
            await emailManager.buyTicket(ticket,userEmail)
            req.logger.info(`Compra exitosa. Ticket generado: ${ticket.code}`);
            res.redirect(`/ticket/${ticket._id}`)
        } catch (error) {
            req.logger.error('Error en el proceso de compra.', error);
            res.status(500).json({ error: 'Error en el proceso de compra.' });
        }
    }
}

module.exports = CartManager;