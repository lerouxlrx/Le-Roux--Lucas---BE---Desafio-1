//Importacion MongoDB

const mongoose = require ("mongoose");

mongoose.connect("mongodb+srv://lerouxlrx:coderhouse@cluster0.0y4hyug.mongodb.net/eccomerce?retryWrites=true&w=majority&appName=Cluster0")
    .then(()=>console.log("Conectado a mongoose"))
    .catch(()=>console.log("Error al conectar a mongoose"))