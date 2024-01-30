const fs = require('fs').promises;

class ProductManager {

    constructor(path) {
        this.products = [];
        this.path = path;
    }

    async saveProducts(arrayProducts) {
      try {
          await fs.writeFile(this.path, JSON.stringify(arrayProducts, null, 2));
      } catch (error) {
          console.log("No se pudo guardar los productos. Error:", error);
      }
  }

    async addProduct(product) {
    /* Obtener productos actuales */
    const products = await this.getProducts();

    /* Campos Obligatorios */
    if (!product.title || !product.description || !product.price || !product.category || !product.code || !product.stock) {
      console.error('Todos los campos son obligatorios.');
      return;
    }

    /* Campo Code único */
    if (products && products.some(p => p.code === product.code)) {
      console.error('Ya existe un producto con este código.');
      return;
    }

    /* Id automático */
    let id;
    if (products && products.length > 0) {
      id = parseInt(products[products.length - 1].id)+ 1;
    } else {
      id = ++ProductManager.id;
    }

    /* Crear Objeto */
    const newProduct = { id, ...product };

    /* Agregar al Array */
    this.products.push(newProduct);
    console.log(`Producto agregado: ${JSON.stringify(newProduct)}`);

    /* Guardar productos actualizados */
    await this.saveProducts(this.products);
  }

    async getProducts() {
        try {
          const data = await fs.readFile(this.path, 'utf-8');
          this.products = JSON.parse(data);
          return this.products;
        } catch (error) {
          console.log("No se pudo leer el archivo. Error", error);
      }
    }

    async getProductById(id) {
        await this.getProducts()
        const product = this.products.find(item => item.id === id)

        product ? console.log(`Se encontró producto con ID: ${id}`) : console.log(`Not Found`);

        return product

    }

    async updateProduct(id, updatedFields) {
      try {
        await this.getProducts();
        const productIndex = this.products.findIndex(item => item.id === id);

        if (productIndex !== -1) {
          /* Replicar existente */
          const updatedProduct = { ...this.products[productIndex], ...updatedFields }; 
          /* Refuerzo ID */
          updatedProduct.id = id;
          /* Subir nuevo producto al array */
          this.products[productIndex] = updatedProduct;
          /* Push */
          await this.saveProducts(this.products);
          console.log(`Producto actualizado con ID: ${id}`);
        } else {
          console.error(`Producto con ID ${id} no encontrado`);
        }
      } catch (error) {
        console.log("Error al actualizar producto:", error);
      }
    }

    async deleteProduct(id) {
      try {
        await this.getProducts();
        const productIndex = this.products.findIndex(item => item.id === id);

        if (productIndex !== -1) {
          /* Eliminar */
          this.products.splice(productIndex, 1);

          await this.saveProducts(this.products);
          console.log(`Producto eliminado con ID: ${id}`);
          } else {
            console.error(`Producto con ID ${id} no encontrado`);
          }
      } catch (error) {
        console.log("Error al eliminar producto:", error);
      }
  }
}

module.exports = ProductManager;
  