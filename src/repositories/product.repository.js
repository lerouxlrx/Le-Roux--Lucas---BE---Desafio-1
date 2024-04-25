const ProductModel = require("../models/product.model.js");

class ProductRepository {
    async createProduct({title, description, price, thumbnails,code,stock,category}) {
        try {
            if (!title|| !description|| !price|| !code|| !stock|| !category) {
                console.log("Se requieren todos los campos")
                return;
            };
            const productExisting = await ProductModel.findOne({code: code});
            if(productExisting){
                console.log("El código de producto no se puede repetir.")
                return;
            };
            const newProduct = new ProductModel ({
                title,
                description,
                price,
                thumbnails,
                code,
                stock,
                category,
                status: true,
            });
            await newProduct.save();
            return newProduct
        } catch (error) {
            throw new Error("Error al crear un producto"+error);
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
            if (!product) {
                console.log("No se encuentra producto con ese ID.");
                return null;
            }
            console.log("Producto eliminado.");
            return product;
        } catch (error) {
            throw new Error("Error al eliminar producto por ID");
        }
    }
}

module.exports = ProductRepository;