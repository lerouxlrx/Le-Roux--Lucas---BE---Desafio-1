const ProductRepository = require("../repositories/product.repository.js");
const productRepository = new ProductRepository(); 

class ProductManager {
    async getProducts(req, res) {
        try {
            const product = await productRepository.findAll();
            if(product) {
                res.json(product);
            } else {
                res.json({error: "No se encontro ningun producto"})
            }
        } catch (error) {
            res.status(500).json({error: "Error en el proceso de leer productos"});
        }
    }

    async getProductById(req, res) {
        const id = req.params.pid
        try {
            const product = await productRepository.findByID(id);
            if(!product){
                console.log(`Producto con ID ${id} no encontrado.`);
                return null;
            }
            res.json(product);
        } catch (error) {
            res.status(500).json({error: "Error en el proceso de leer producto por ID"});
        }
    }

    async addProduct(req, res) {
        const newProduct = req.body;
        try {
            const result = await productRepository.createProduct(newProduct);
            res.json(result)
        } catch (error) {
            console.log("Error al agregar producto: ", error)
        }
    }

    async updateProduct(req, res) {
        let id = req.params.pid;
        const productUpdate = req.body;
        try {
            const product = await productRepository.updateProduct(id, productUpdate);

            if(!product){
                console.log(`Producto con ID ${id} no encontrado para actualizar.`);
                return null;
            }
            res.json({message: "Se actualizo el producto."});
        } catch (error) {
            res.status(500).json({error: "Error al actualizar producto"+error});
        }
    }

    async deleteProduct (req, res) {
        let id = req.params.pid;
        try {
            const product = await productRepository.deleteProduct(id);

            res.json(product);
        } catch (error) {
            res.status(500).json({error: "Error al eliminar producto"+error});
        } 
    }
}

module.exports = ProductManager;