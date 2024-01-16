/* Desafio 2 */

const fs = require('fs').promises;

class ProductManager {
    static id = 0;

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
        /* Campos Obligatorios */
        if (!product.title || !product.description || !product.price || !product.thumbnail || !product.code || !product.stock) {
          console.error('Todos los campos son obligatorios.');
          return;
        }
    
        /* Campo Code único */
        if (this.products.some(p => p.code === product.code)) {
          console.error('Ya existe un producto con este código.');
          return;
        }
    
        /* Id automático */
        const id = ++ProductManager.id;

        /* Crear Objeto */
        const newProduct = { id, ...product };

        /* Agregar al Array */
        this.products.push(newProduct);
        console.log(`Producto agregado: ${newProduct.title}`);

        await this.saveProducts(this.products);
    }

    async getProducts() {
        try {
          const data = await fs.readFile(this.path, 'utf-8');
          this.products = JSON.parse(data);
          return this.products;
        } catch (error) {
          console.log("No se pudo leer el archivo. Error");
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

/* Prueba */
/* Crear instancia */
  const productManager = new ProductManager("./arrayProductos.json");

/* Productos*/
  const producto1 = {
    title: "Alargue Blanco",
    description: "Alargue blanco largo",
    price: 5000,
    thumbnail: "https://http2.mlstatic.com/D_NQ_NP_635749-MLA44597218606_012021-O.webp",
    code: "A01",
    stock: 100,
  };

  const producto2 = {
    title: "Alargue Negro",
    description: "Alargue negro extra largo",
    price: 10000,
    thumbnail: "https://http2.mlstatic.com/D_NQ_NP_671786-MLA73593481645_122023-O.webp",
    code: "A02",
    stock: 50,
  };

/* Función Async */
const exampleFunction = async () => {
  const testLog =  async () => {
    const allProducts = await productManager.getProducts();
    console.log(allProducts);
  }

/* Mostrar vacio. */
  const test1 = await productManager.getProducts();
  await testLog()

/* Crear Productos */
  productManager.addProduct(producto1)
  productManager.addProduct(producto2)
  await testLog()

/* Mostrar por Id */
  const productById = await productManager.getProductById(1);
  console.log("Producto por ID:", productById);

/* Actualizar producto */
  const updatedFields = { price: 6000, stock: 80 };
  await productManager.updateProduct(1, updatedFields);
  await testLog();

/* Eliminar producto */
  await productManager.deleteProduct(1);
  await testLog();
};

exampleFunction ()