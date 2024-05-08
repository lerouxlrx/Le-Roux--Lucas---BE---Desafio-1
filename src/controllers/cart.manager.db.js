const CartRepository = require("../repositories/cart.repository.js");
const cartRepository = new CartRepository();
const ProductRepository = require("../repositories/product.repository.js");
const productRepository = new ProductRepository();
const TicketModel = require("../models/ticket.models.js");
const UserModel = require("../models/user.model.js");
const { generateUniqueCode, calculateTotal } = require("../utils/cartutils.js");
const transport = require("../config/nodemailer.js");

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
            console.log(`Producto agregado al carrito ${cartId}.`, productId, quantity)
            res.redirect("/products")
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
            await transport.sendMail({
                from: "Teccomerce <lerouxlrx@gmail.com> ",
                to: userEmail,
                subject: "Ticket de compra Teccomerce", 
                html: `<h2>Ticket de Compra</h2>
                <p>Código de Ticket: ${ticket.code}</p>
                <p>Fecha de Compra: ${ticket.purchase_datetime}</p>
                <p>Monto Total: $${ticket.amount}</p>
                <p>Comprador: ${ticket.purchaser}</p>`,
            })
            res.redirect(`/ticket/${ticket._id}`)
        } catch (error) {
            console.error('Error en el proceso de compra.', error);
            res.status(500).json({ error: 'Error en el proceso de compra.' });
        }
    }
}

module.exports = CartManager;