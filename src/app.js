const express = require("express");
const exphbs = require("express-handlebars");
const socket = require ("socket.io");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const initializePassport = require("./config/passport.config.js");
const cors = require("cors");
const path = require('path');
const app = express();
const PUERTO = 8080;
//Activamos mongoose
require("./database.js")

const productsRouter = require('../src/routes/products.router.js');
const cartsRouter = require('../src/routes/carts.router.js');
const viewsRouter = require('../src/routes/views.router.js');
const userRouter = require("./routes/user.router.js");
const errorHandler = require("./middleware/error.js");


//Public+Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cookieParser());
app.use(session({
    secret:"secretCoder",
    resave: true, 
    saveUninitialized:true,   
    store: MongoStore.create({
        mongoUrl: "mongodb+srv://lerouxlrx:coderhouse@cluster0.0y4hyug.mongodb.net/eccomerce?retryWrites=true&w=majority&appName=Cluster0", ttl: 100
    })
}))
//Passport
app.use(passport.initialize());
initializePassport();
app.use(passport.session());

const authMiddleware = require("./middleware/authmiddleware.js");
app.use(authMiddleware);
const addLogger = require("./middleware/logger.js");
app.use(addLogger);

//Conf Handlebars
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars")
app.set("views", './src/views')

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/users", userRouter);
app.use("/", viewsRouter);
app.use(errorHandler);

const httpServer = app.listen(PUERTO, ()=>{
    console.log(`Puerto ${PUERTO} activo`)
});

const SocketManager = require("./sockets/socekt.manager.js");
new SocketManager(httpServer);

const swaggerUiExpress = require('swagger-ui-express');
const swaggerSpec = require("./config/swagger.js");

app.use('/api-docs', swaggerUiExpress.serve, swaggerUiExpress.setup(swaggerSpec));