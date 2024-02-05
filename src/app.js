const express = require("express");
const app = express();
const PUERTO = 8080;
//Handlebars
const exphbs = require("express-handlebars")
//Socket
const socket = require ("socket.io")

//Conf Handlebars
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars")
app.set("views", './src/views')

//Carpeta public
app.use(express.static("./src/public"));


const productsRouter = require('../src/routes/products.router.js');
const cartsRouter = require('../src/routes/carts.router.js');
const viewsRouter = require('../src/routes/views.router.js')


app.use(express.urlencoded({extended: true}));
app.use(express.json())

app.use("/api", productsRouter);
app.use("/api", cartsRouter);
app.use("/", viewsRouter);


const httpServer = app.listen(PUERTO);

//Config Socket con Array
const ProductManager = require("./controllers/product-manager.js")
const productManager = new ProductManager('./src/models/products.json')
const io = socket(httpServer);

io.on("connection", async (socket) => {
    console.log('Un cliente conectado');

    //Enviamos array
    socket.emit("productos", await productManager.getProducts());
    //Para eliminar
    socket.on("eliminarProducto", async (id) => {
        await productManager.deleteProduct(id);
        io.sockets.emit("productos", await productManager.getProducts())
    })
    //ParaAgregar
    socket.on("agregarProducto", async (producto) => {
        await productManager.addProduct(producto);
        io.sockets.emit("productos", await productManager.getProducts())
        console.log(producto)
    })
})