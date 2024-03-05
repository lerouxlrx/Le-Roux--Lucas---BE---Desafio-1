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

router.delete("/carts/:cid/products/:pid", async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;

    try {
        await cartManager.deleteProductFromCart(cartId, productId);
        
        res.json({ message: `Producto eliminado del carrito ${cartId}.`, productId });
    } catch (error) {
        console.log("Error al eliminar el producto del carrito:", error);
        res.status(500).json({ error: "Error al eliminar el producto del carrito." });
    }
});

router.put("/carts/:cid", async (req, res) => {
    const cartId = req.params.cid;
    const updatedProducts = req.body.products;

    try {
        await cartManager.updateCart(cartId, updatedProducts);
        res.status(200).json({ message: `Carrito con ID ${cartId} actualizado correctamente.` });
    } catch (error) {
        console.log("Error al actualizar el carrito:", error);
        res.status(500).json({ error: "Error al actualizar el carrito." });
    }
})

router.put("/carts/:cid/products/:pid", async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const newQuantity = req.body.quantity;

    try {
        await cartManager.updateProductQuantityInCart(cartId, productId, newQuantity);
        res.status(200).json({ message: `Se actualizó la cantidad del producto en el carrito ${cartId}.` });
    } catch (error) {
        console.log("Error al actualizar la cantidad del producto en el carrito:", error);
        res.status(500).json({ error: "Error al actualizar la cantidad del producto en el carrito." });
    }
})

router.delete("/carts/:cid", async (req, res) => {
    const cartId = req.params.cid;
    
    try {
        await cartManager.deleteAllProductsFromCart(cartId);
        res.json({ message: `Se eliminaron todos los productos del carrito ${cartId}.` });
    } catch (error) {
        console.log("No se pudo eliminar todos los productos del carrito:", error);
        res.status(500).json({ error: "Error al eliminar todos los productos del carrito." });
    }
})

module.exports = router