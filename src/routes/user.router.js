const express = require("express");
const router = express.Router();
const UserModel = require("../models/user.model.js");
const { createHash } = require("../utils/hashbcryp.js");


router.post("/", async (req, res) => {
    const {first_name, last_name, email, password, age} = req.body;
    try {
        const existeUsuario = await UserModel.findOne({email:email});
        if(existeUsuario) {
            return res.status(400).send({error: "Ya existe un usuario con este correo"});
        }
         const nuevoUsuario = await UserModel.create({
            first_name,
            last_name, 
            email,
            password: createHash(password), 
            age
        }); 

        req.session.login = true; 
        req.session.user = {...nuevoUsuario._doc};
        res.redirect("/products");
    } catch (error) {
        console.log("Error al intentar crear usuario:", error);
        res.status(500).send({error: "Error al intentar crear usuario"});
    }
});


router.get("/failedregister", (req, res) => {
    res.send({error: "No se pudo registrar el usuario"});
})

module.exports = router; 