/* Desafio 1 */

class ProductManager {
    static id = 0;

    constructor() {
        this.products = [];
    }

    addProduct(product) {
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
        const newProduct = { id, ...product };
        this.products.push(newProduct);
        console.log(`Producto agregado: ${newProduct.title}`);
    }

    getProducts() {
        return this.products
    }

    getProductById(id) {
        const product = this.products.find(item => item.id === id)

        if (product) {
            console.log(`Se encontró producto con ID: ${id}`);
            return product;
        } else {
            console.log(`Not Found`);
            return null;
        }
    }
}

/* Prueba */

const productManager = new ProductManager();

/* Agregar productos */
productManager.addProduct({
  title: "Alargue Blanco",
  description: "Alargue blanco largo",
  price: 5000,
  thumbnail: "https://http2.mlstatic.com/D_NQ_NP_635749-MLA44597218606_012021-O.webp",
  code: "A01",
  stock: 100,
});

productManager.addProduct({
  title: "Alargue Negro",
  description: "Alargue negro extra largo",
  price: 10000,
  thumbnail: "https://http2.mlstatic.com/D_NQ_NP_671786-MLA73593481645_122023-O.webp",
  code: "A02",
  stock: 50,
});

/* Mostrar todos los productos. */
const allProducts = productManager.getProducts();
console.log("Todos los productos:", allProducts);

/* Mostrar por Id */
const productById = productManager.getProductById(2);
console.log("Producto por ID:", productById);