const ProductRepository = require("../repositories/product.repository.js");
const productRepository = new ProductRepository(); 

class ProductManager {
    async getProducts(req, res) {
        try {
            const products = await productRepository.findAll();
            if(products.length > 0) {
                res.json(products);
                req.logger.info("Productos encontrados correctamente.");
            } else {
                res.json({error: "No se encontraron productos"});
                req.logger.warning("No se encontraron productos.");
            }
        } catch (error) {
            res.status(500).json({error: "Error en el proceso de leer productos"});
            req.logger.error("Error en el proceso de leer productos:", error);
        }
    }

    async getProductById(req, res) {
        const id = req.params.pid;
        try {
            const product = await productRepository.findByID(id);
            if(!product){
                req.logger.warning(`Producto con ID ${id} no encontrado.`);
                return res.json({error: `Producto con ID ${id} no encontrado`});
            }
            res.json(product);
            req.logger.info(`Producto con ID ${id} encontrado.`);
        } catch (error) {
            res.status(500).json({error: "Error en el proceso de leer producto por ID"});
            req.logger.error(`Error en el proceso de leer producto con ID ${id}:`, error);
        }
    }

    async addProduct(req, res, next) {
        const newProduct = req.body;
        try {
            const result = await productRepository.createProduct(newProduct);
            res.json(result);
            req.logger.info("Producto agregado correctamente.");
        } catch (error) {
           next(error);
           req.logger.error("Error al agregar producto:", error);
        }
    }

    async updateProduct(req, res) {
        let id = req.params.pid;
        const productUpdate = req.body;
        try {
            const product = await productRepository.updateProduct(id, productUpdate);

            if(!product){
                req.logger.warning(`Producto con ID ${id} no encontrado para actualizar.`);
                return res.json({error: `Producto con ID ${id} no encontrado para actualizar`});
            }
            res.json({message: "Se actualizó el producto."});
            req.logger.info(`Producto con ID ${id} actualizado correctamente.`);
        } catch (error) {
            res.status(500).json({error: "Error al actualizar producto" + error});
            req.logger.error(`Error al actualizar producto con ID ${id}:`, error);
        }
    }

    async deleteProduct (req, res) {
        let id = req.params.pid;
        try {
            const product = await productRepository.deleteProduct(id);
            res.json(product);
            req.logger.info(`Producto con ID ${id} eliminado correctamente.`);
        } catch (error) {
            res.status(500).json({error: "Error al eliminar producto" + error});
            req.logger.error(`Error al eliminar producto con ID ${id}:`, error);
        } 
    }
}

module.exports = ProductManager;