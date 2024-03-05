const express = require("express");
const app = express();
const PUERTO = 8080;
//Handlebars
const exphbs = require("express-handlebars")
//Socket
const socket = require ("socket.io")
//Activamos mongoose
require("./database.js")

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


const httpServer = app.listen(PUERTO, ()=>{
    console.log(`Puerto ${PUERTO} activo`)
});

//Chat Complementario
/* const MessageModel = require("./models/message.model.js");
const io = new socket.Server(httpServer);

io.on("connection",  (socket) => {
    console.log("Nuevo usuario conectado");

    socket.on("message", async data => {

        //Guardo el mensaje en MongoDB: 
        await MessageModel.create(data);

        //Obtengo los mensajes de MongoDB y se los paso al cliente: 
        const messages = await MessageModel.find();
        console.log(messages);
        io.sockets.emit("message", messages);
     
    })
}) */

// Desafio 4
/* //Config Socket con Array
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
}) */