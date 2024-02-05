const express = require("express")
const ProductManager = require("../controllers/product-manager")
const productManager = new ProductManager('./src/models/products.json')
const router = express.Router()


//Llamado Handlebars
router.get("/", async (req, res) => {
    try {
        //Arrays para Handlebars
        const arrayProductos = await productManager.getProducts();
        //Renderizar
        res.render("home", {titulo: "Entregas curso Back-End", arrayProductos})
    } catch (error) {
        console.log ("No se pudieron renderizar los productos");
        res.status(500).json({error: "Error al renderizar productos."});
    }
})

router.get("/realtimeproducts", async (req, res) => {
    try {
        res.render("realTimeProducts")
    } catch (error) {
        console.log ("No se pudieron renderizar los productos en tiempo real");
        res.status(500).json({error: "Error al renderizar productos en tiempo real"});
    }
})

module.exports = router;