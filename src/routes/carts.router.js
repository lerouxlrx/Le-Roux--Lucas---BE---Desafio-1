const express = require('express');
const router = express.Router();

const CartManager = require ("../controllers/cart.manager.db.js")
const cartManager = new CartManager();


router.get("/", cartManager.getCarts);

router.get("/:cid", cartManager.getCartById);

router.post("/", cartManager.createCart);

router.post("/:cid/products/:pid", cartManager.addProductToCart);

router.delete("/:cid/products/:pid", cartManager.deleteProductFromCart);

router.put("/:cid", cartManager.updateProductsInCart)

router.put("/:cid/products/:pid", cartManager.updateProductQuantityInCart)

router.delete("/:cid", cartManager.deleteAllProductsFromCart)

module.exports = router