const UserModel = require("../models/user.model.js");
const CartModel = require("../models/cart.models.js");
const jwt = require("jsonwebtoken");
const { createHash, isValidPassword } = require("../utils/hashbcryp.js");
const UserDTO = require("../dto/user.dto.js");

class UserController {
    async register(req, res) {
        const { first_name, last_name, email, password, age } = req.body;
        try {
            const userExisting = await UserModel.findOne({ email });
            if (userExisting) {
                return res.status(400).send("El email ya esta registrado con un Usuario");
            }

            const newCart = new CartModel();
            await newCart.save();

            const newUser = new UserModel({
                first_name,
                last_name,
                email,
                cart: newCart._id, 
                password: createHash(password),
                age
            });

            await newUser.save();

            const token = jwt.sign({ user: newUser }, "teccomerce", {
                expiresIn: "24h"
            });

            res.cookie("teccomerceCookieToken", token, {
                maxAge: 3600000,
                httpOnly: true
            });

            res.redirect("/api/users/profile");
        } catch (error) {
            console.error(error);
            res.status(500).send("Error interno del servidor");
        }
    }

    async login(req, res) {
        const { email, password } = req.body;
        try {
            const userExisting = await UserModel.findOne({ email });

            if (!userExisting) {
                return res.status(401).send("El usuario no existe");
            }

            const correctPassword = isValidPassword(password, userExisting);
            if (!correctPassword) {
                return res.status(401).send("La contraseña es incorrecta");
            }

            const token = jwt.sign({ user: userExisting }, "teccomerce", {
                expiresIn: "24h"
            });

            res.cookie("teccomerceCookieToken", token, {
                maxAge: 3600000,
                httpOnly: true
            });

            res.redirect("/api/users/profile");
        } catch (error) {
            console.error(error);
            res.status(500).send("Error en el proceso de login.");
        }
    }

    async profile(req, res) { 
        const userDto = new UserDTO(req.user.first_name, req.user.last_name, req.user.role);
        const isAdmin = req.user.role === 'admin';
        res.render("profile", { user: userDto, isAdmin });
    }

    async logout(req, res) {
        res.clearCookie("coderCookieToken");
        res.redirect("/login");
    }

    async admin(req, res) {
        if (req.user.user.role !== "admin") {
            return res.status(403).send("Acceso solo para admin");
        }
        res.render("admin");
    }
}

module.exports = UserController;