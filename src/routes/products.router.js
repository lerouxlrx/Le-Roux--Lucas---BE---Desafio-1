const express = require('express');
const router = express.Router();

const ProductManager = require('../controllers/product.manager.db.js');
const productManager = new ProductManager()

router.get("/", productManager.getProducts)

router.get("/:pid", productManager.getProductById)

router.post("/", productManager.addProduct)

router.put("/:pid", productManager.updateProduct)

router.delete("/:pid", productManager.deleteProduct)

module.exports = router