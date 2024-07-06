const socket = require("socket.io");
const ProductRepository = require("../repositories/product.repository.js");
const productRepository = new ProductRepository(); 
const MessageModel = require("../models/message.models.js");
const ProductManager = require("../controllers/product.manager.db.js");
const productManager = new ProductManager
const EmailManager = require("../services/email.js");
const emailManager = new EmailManager();

class SocketManager {
    constructor(httpServer) {
        this.io = socket(httpServer);
        this.initSocketEvents();
    }

    async initSocketEvents() {
        this.io.on("connection", async (socket) => {
            console.log("Usuario conectado.");

            socket.emit("products", await productRepository.findAll() );

            socket.on("deleteProduct", async ({ id, role }) => {
                try {
                    const product = await productRepository.findByID(id);
                    if (!product) {
                        socket.emit("deleteProductError", { error: "Producto no encontrado" });
                        return;
                    }
                    await productRepository.deleteProduct(id);
                    
                    if (role === "admin" && product.owner !== "admin") {
                        await emailManager.productDeleted(product.owner, product.title);
                    }

                    this.emitUpdatedProducts(socket);
                } catch (error) {
                    console.error(`Error al eliminar producto: ${error.message}`);
                    socket.emit("deleteProductError", { error: "Error al eliminar producto" });
                }
            });

            socket.on("createProduct", async (producto) => {
                await productRepository.createProduct(producto);
                this.emitUpdatedProducts(socket);
            });

            socket.on("message", async (data) => {
                await MessageModel.create(data);
                const messages = await MessageModel.find();
                socket.emit("message", messages);
            });
        });
    }

    async emitUpdatedProducts(socket) {
        socket.emit("products", await productRepository.findAll());
    }
}

module.exports = SocketManager;