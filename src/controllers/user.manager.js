const UserModel = require("../models/user.model.js");
const CartModel = require("../models/cart.models.js");
const jwt = require("jsonwebtoken");
const { createHash, isValidPassword } = require("../utils/hashbcryp.js");
const UserDTO = require("../dto/user.dto.js");
const { generateResetToken } = require("../utils/utils.js");
const EmailManager = require("../services/email.js");
const emailManager = new EmailManager

class UserController {
    async register(req, res) {
        const { first_name, last_name, email, password, age } = req.body;
        try {
            const userExisting = await UserModel.findOne({ email });
            if (userExisting) {
                req.logger.warning(`El correo ${email} ya esta registrado en otro usuario`);
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
            req.logger.warning(`Usuario creado con correo ${email}`)

            const token = jwt.sign({ user: newUser }, "teccomerce", {
                expiresIn: "24h"
            });

            res.cookie("teccomerceCookieToken", token, {
                maxAge: 3600000,
                httpOnly: true
            });

            res.redirect("/api/users/profile");
        } catch (error) {
            req.logger.error("Error en el proceso de crear usuario",error);
            res.status(500).send("Error interno del servidor");
        }
    }

    async login(req, res) {
        const { email, password } = req.body;
        try {
            const userExisting = await UserModel.findOne({ email });

            if (!userExisting) {
                req.logger.warning(`El correo ${email} no esta registrado como usuario`);
                return res.status(401).send("El usuario no existe");
            }

            const correctPassword = isValidPassword(password, userExisting);
            if (!correctPassword) {
                req.logger.warning(`La contraseña es incorrecta para el correo ${email}`);
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
            req.logger.error("Error en el proceso de loguearse",error);
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
        req.logger.info("Se desconecta usuario y se redirige a Login")
        res.redirect("/login");
    }

    async admin(req, res) {
        if (req.user.user.role !== "admin") {
            req.logger.warning("Un usuario que no es admin, intenta entrar a una sección de admin")
            return res.status(403).send("Acceso solo para admin");
        }
        req.logger.info(`Admin en sección admin`)
        res.render("admin");
    }
    async requestPasswordReset(req, res) {
        const {email} = req.body;
        try {
            const user = await UserModel.findOne({ email });

            if (!user) {
                req.logger.warning(`El correo ${email} no esta registrado como usuario`);
                return res.render("viewReset", { error: "No se encontró usuario con el email ingresado." });
            }

            const token = generateResetToken();

            user.resetToken = {
                token: token,
                expire: new Date(Date.now()+ 360000)
            };

            await user.save();
            await emailManager.resetPassword(email, token)
            req.logger.info(`Se envio correo para reestablecer contraseña a ${email}`);
            res.redirect("/mail-reset")
        } catch (error) {
            req.logger.error("Error en el proceso de enviar correo de reestablecimiento.",error);
            res.status(500).send("Error en el proceso de de enviar correo de reestablecimiento.");
        }
    }
    async resetPassword(req, res) {
        const { email, password, token } = req.body;

        try {
            const user = await UserModel.findOne({ email });
            if (!user) {
                req.logger.warning(`El correo ${email} no esta registrado como usuario`);
                return res.render("resetPassword", { error: "No se encontró usuario con el email ingresado." });
            }

            const resetToken = user.resetToken;
            if (!resetToken || resetToken.token !== token) {
                req.logger.warning(`El token ingresado no coincide con el token a validar.`);
                return res.render("viewReset", { error: "El token no coincide con el enviado. Solicitar reestablecimiento nuevamente." });
            }

            const dateNow = new Date();
            if (dateNow > resetToken.expiresAt) {
                req.logger.warning(`El token ingresado ha expirado.`);
                return res.render("viewReset", { error: "El token ingresado ha expirado." });
            }

            if (isValidPassword(password, user)) {
                req.logger.warning(`La contraseña ingresada tiene que ser distinta a la error.`);
                return res.render("resetPassword", { error: "La contraseña ingresada tiene que ser distinta a la error." });
            }

            user.password = createHash(password);
            user.resetToken = undefined;
            await user.save();
            req.logger.info(`Contraseña reestablecida para usuario con correo ${email}`);
            return res.redirect("/password-reset");
        } catch (error) {
            req.logger.error(`Error en el proceso de reestablecer contraseña`);
            return res.status(500).render("reset-password", { error: "Error interno del servidor. Comunicate con el administrador." });
        }
    }
}

module.exports = UserController;