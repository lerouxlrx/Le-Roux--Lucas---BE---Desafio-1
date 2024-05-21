const ProductModel = require("../models/product.models.js");
const { errorInformation, errorExisting } = require("../services/error/info.js");
const { EErrors } = require("../services/error/enums.js");
const CustomError = require("../services/error/custom.error.js");

class ProductRepository {
    async createProduct({title, description, price, thumbnails,code,stock,category, owner}) {
        try {
            if (!title|| !description|| !price|| !code|| !stock|| !category) {
                throw CustomError.createError({
                    name: "Datos incompletos", 
                    cause: errorInformation({title, description, price,code,stock,category}),
                    message: "Error al intentar crear el producto por falta de datos",
                    code: EErrors.Datos_Incompletos
                })
            };
            const productExisting = await ProductModel.findOne({code: code});
            if(productExisting){
                throw CustomError.createError({
                    name: "Code repetido", 
                    cause: errorExisting({code}),
                    message: "Error al intentar crear el producto por repetir code",
                    code: EErrors.Producto_Existente
                })
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
                owner,
            });
            await newProduct.save();
            return newProduct
        } catch (error) {
            throw error
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