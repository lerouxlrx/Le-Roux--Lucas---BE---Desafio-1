const ProductModel = require("../models/product.model.js");

class ProductManager {
    async addProduct({title, description, price, thumbnails,code,stock,category}) {
        try {
            if (!title|| !description|| !price|| !code|| !stock|| !category) {
                console.log("Se requieren todos los campos")
                return;
            };

            const productExisting = await ProductModel.findOne({code: code});

            if(existeProducto){
                console.log("El código de producto no se puede repetir.")
                return;
            };

            const newProduct = new ProductModel({
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
        } catch (error) {
            console.log("Error al agregar producto: ", error)
        }
    }

    async getProducts() {
        try {
            const productos = await ProductModel.find();
            return productos;
        } catch (error) {
            console.log("Error al cargar productos: ", error)
        }
    }

    async getProductById(id) {
        try {
            const product = await ProductModel.findById(id);
            if(!product){
                console.log(`Producto con ID ${id} no encontrado.`);
                return null;
            }
            console.log("Producto encontrado");
            return product;
        } catch (error) {
            console.log(`Error al cargar producto con ID : ${id}`, error);
        }
    }

    async updateProduct(id, productUpdate) {
        try {
            const product = await ProductModel.findByIdAndUpdate(id, productUpdate);

            if(!product){
                console.log(`Producto con ID ${id} no encontrado para actualizar.`);
                return null;
            }
            console.log("Producto actualizado");
            return product;
        } catch (error) {
            console.log(`Error al actualizar producto con ID : ${id}`, error);
        }
    }

    async deleteProduct (id, productDelete) {
        try {
            const product = await ProductModel.findByIdAndDelete(id, productDelete);

            if(!product){
                console.log(`Producto con ID ${id} no encontrado para eliminar.`);
                return null;
            }
            console.log("Producto eliminado");
            return product;
        } catch (error) {
            console.log(`Error al eliminar producto con ID : ${id}`, error);
        } 
    }
}

module.exports = ProductManager;