const ProductModel = require("../models/product.model.js");

class ProductRepository {
    async createProduct(productData) {
        try {
            const newProduct = new ProductModel(productData);
            await newProduct.save();
        } catch (error) {
            throw new Error("Error al crear un producto");
        }
    }
    
    async findAll() {
        try {
            const products = await ProductModel.find();
            return products;
        } catch (error) {
            throw new Error("Error al obtener productos");
        }
    }

    async findByID(id) {
        try {
            const product = await ProductModel.findById(id)
            return product
        } catch (error) {
            throw new Error("Error al buscar producto por ID");
        }
    }

    async updateProduct(id, productUpdate) {
        try {
            const product = await ProductModel.findByIdAndUpdate(id, productUpdate);
            return product
        } catch (error) {
            throw new Error("Error al actualizar producto por ID");
        }
    }

    async deleteProduct(id) {
        try {
            const product = await ProductModel.findByIdAndDelete(id);
            return product
        } catch (error) {
            throw new Error("Error al eliminar producto por ID");
        }
    }
}

module.exports = ProductRepository;