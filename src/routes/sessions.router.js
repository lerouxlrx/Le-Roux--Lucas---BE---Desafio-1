const express = require("express");
const router = express.Router();
const UserModel = require("../models/user.model.js");

router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (email === 'adminCoder@coder.com' && password === 'adminCod3r123') {
    req.session.login = true;
    req.session.user = { email: 'adminCoder@coder.com', role: 'admin' };
    return res.redirect("/products");
    }

    try { 
        const usuario = await UserModel.findOne({ email: email });
        if (usuario) {
            if(password === usuario.password) {
                req.session.login = true;
                req.session.user = { ...usuario._doc, role: "user" };
                res.redirect("/products");
            } else {
                res.status(401).send({ error: "La contraseña no es correcta." });
            }
        } else {
            res.status(404).send({ error: "Usuario no registrado." });
        }
    } catch (error) {
        res.status(400).send({ error: "Error al intentar loguearse." });
    }
})

router.get("/faillogin", async (req, res) => {
    res.send({error: "Error en el proceso del login"});
})

router.get("/logout", (req, res) => {
    if (req.session.login) {
        req.session.destroy();
    }
    res.redirect("/login");
})

module.exports = router;