const express = require('express');
const router = express.Router();

const CartManager = require('../controllers/cart.manager.db.js')
const cartManager = new CartManager()

router.get("/carts", async (req,res) => {
    try {
        const limit = req.query.limit;
        const carts = await cartManager.getCarts();
        
        if(limit) {
            res.json(carts.slice(0, limit));
        } else {
            res.json(carts)
        }
    } catch (error) {
        console.log ("No se pudieron traer los carritos");
        res.status(500).json({error: "Error al leer carritos."});
    }
})

router.get("/carts/:cid", async (req, res) => {
    const id = req.params.cid;
    try {
        const cart = await cartManager.getCartById(id);
        if(cart) {
            res.json(cart.products);
        } else {
            res.json({error: "No se encontro un carrito con dicho ID"})
        }
    } catch (error) {
        console.log ("No se pudo traer el carrito por ID");
        res.status(500).json({error: "Error al leer el carrito por ID"});
    }
})

router.post("/carts", async (req, res) => {
    try {
        const newCart = await cartManager.createCart();
        res.status(201).json({ message: "Nuevo carrito creado.", cart: newCart });
    } catch (error) {
        console.log("No se pudo crear el carrito");
        res.status(500).json({ error: "Error al crear el carrito" });
    }
});

router.post("/carts/:cid/products/:pid", async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const quantity = req.body.quantity || 1;

    try {
        await cartManager.addProductToCart(cartId, productId, quantity);
        res.status(201).json({ message: `Producto agregado al carrito ${cartId}.`, productId, quantity });
    } catch (error) {
        console.log("No se pudo agregar el producto al carrito");
        res.status(500).json({ error: "Error al agregar el producto al carrito" });
    }
});

module.exports = router