const express = require('express');
const app = express();
const PUERTO = 8080;

const ProductManager = require('../src/controllers/product-manager.js')
const productManager = new ProductManager('./src/models/products.json')

app.use(express.json())

app.get("/products", async (req,res) => {
    try {
        const limit = req.query.limit;
        const productos = await productManager.getProducts();
        
        if(limit) {
            res.json(productos.slice(0, limit));
        } else {
            res.json(productos)
        }
    } catch (error) {
        console.log ("No se pudieron traer los productos");
        res.status(500).json({error: "Error al leer productos."});
    }
})

app.get("/products/:pid", async (req, res) => {
    const id = req.params.pid;
    try {
        const product = await productManager.getProductById(id);
        if(product) {
            res.json(product);
        } else {
            res.json({error: "No se encontro un producto con dicho ID"})
        }
    } catch (error) {
        console.log ("No se pudo traer el producto por ID");
        res.status(500).json({error: "Error al leer producto por ID"});
    }
})

app.post("/products", async (req, res) => {
    const nuevoProducto = req.body;

    try {
        await productManager.addProduct(nuevoProducto)
        res.status(201).json({message: "Producto agregado."})
    } catch (error) {
        console.log ("No se pudo agregar el producto");
        res.status(500).json({error: "Error al agregar producto"+error});
    }
})

app.listen(PUERTO);

