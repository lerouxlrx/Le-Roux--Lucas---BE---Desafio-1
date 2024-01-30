const fs = require('fs').promises;

class CartManager {
    static id = 0;

    constructor(path, productManager) {
        this.carts = [];
        this.path = path;
        this.productManager = productManager;
    }

    async saveCarts(arrayCarts) {try {
        await fs.writeFile(this.path, JSON.stringify(arrayCarts, null, 2));
    } catch (error) {
        console.log("No se pudo guardar los carritos. Error:", error);
    }
}

    async createCart() {
        try {
            const cart = {
                id: ++CartManager.id,
                products: [],
            };

            this.carts.push(cart);
            await this.saveCarts(this.carts);

            console.log(`Nuevo carrito creado con ID: ${cart.id}`);
            return cart;
        } catch (error) {
            console.log("Error al crear un nuevo carrito:", error);
        }
    }
    
    async getCarts() {
        try {
            const data = await fs.readFile(this.path, 'utf-8');
            this.carts = JSON.parse(data);
            return this.carts;
        } catch (error) {
            console.log("No se pudo leer el archivo de carritos. Error:", error);
        }
    }

    async getCartById(id) {

        await this.getCarts();
        
        const cart = this.carts.find(item => item.id === id);
        console.log(cart)

        cart ? console.log(`Se encontró el carrito con ID: ${id}`) : console.log(`Not Found`);

        return cart

    }


    async addProductToCart(cartId, productId, quantity) {
        try {
          const carts = await this.getCarts();
          const cartIndex = carts.findIndex(cart => cart.id === cartId);
      
          if (cartIndex !== -1) {
            const cart = carts[cartIndex];
      
            const productIndex = cart.products.findIndex(product => product.productId === productId);
      
            if (productIndex !== -1) {
              cart.products[productIndex].quantity += quantity;
            } else {
              cart.products.push({ productId, quantity });
            }

            await this.saveCarts(carts);
      
            console.log(`Producto agregado al carrito ${cartId}.`);
            return { message: `Producto agregado al carrito ${cartId}.`, productId, quantity };
          } else {
            console.error(`Carrito con ID ${cartId} no encontrado`);
            return { error: `Carrito con ID ${cartId} no encontrado` };
          }
        } catch (error) {
          console.log("Error al agregar producto al carrito:", error);
          return { error: "Error al agregar producto al carrito" };
        }
      }
}

module.exports = CartManager;