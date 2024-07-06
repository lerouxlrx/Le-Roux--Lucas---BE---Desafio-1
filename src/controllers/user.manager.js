const UserModel = require("../models/user.model.js");
const CartModel = require("../models/cart.models.js");
const jwt = require("jsonwebtoken");
const { createHash, isValidPassword } = require("../utils/hashbcryp.js");
const UserDTO = require("../dto/user.dto.js");
const { generateResetToken } = require("../utils/utils.js");
const EmailManager = require("../services/email.js");
const emailManager = new EmailManager
const UserRepository = require("../repositories/user.repository.js");
const userRepository = new UserRepository();


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
            req.logger.info(`Usuario creado con correo ${email}`)

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
            req.logger.info(`Usuario logueado con correo ${email}`)

            userExisting.lastConnection = new Date();
            await userExisting.save();

            const token = jwt.sign({ user: userExisting }, "teccomerce", {
                expiresIn: "24h"
            });

            res.cookie("teccomerceCookieToken", token, {
                maxAge: 3600000,
                httpOnly: true
            });

            res.redirect("/api/users/profile");;
        } catch (error) {
            req.logger.error("Error en el proceso de loguearse",error);
            res.status(500).send("Error en el proceso de login.");
        }
    }
    async profile(req, res) { 
        const userDto = new UserDTO(req.user.first_name, req.user.last_name, req.user.role);
        const isAdmin = req.user.role === 'admin';
        const isPremium = req.user.role === 'premium';
        res.render("profile", { user: userDto, isAdmin, isPremium });
    }
    async logout(req, res) {
        res.clearCookie("teccomerceCookieToken");
        req.logger.info("Se desconecta usuario y se redirige a Login")
        
        req.user.lastConnection = new Date();
        await req.user.save();
        
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
                req.logger.warning(`La contraseña ingresada tiene que ser distinta a la anterior.`);
                return res.render("resetPassword", { error: "La contraseña ingresada tiene que ser distinta a la error." });
            }

            user.password = createHash(password);
            user.resetToken = undefined;
            await user.save();
            req.logger.info(`Contraseña reestablecida para usuario con correo ${email}`);
            return res.redirect("/password-reset");
        } catch (error) {
            req.logger.error(`Error en el proceso de reestablecer contraseña`);
            return res.status(500).render("resetPassword", { error: "Error interno del servidor. Comunicate con el administrador." });
        }
    }
    async changeRolPremium(req, res) {
        try {
            const { uid } = req.params;
            const user = await userRepository.findById(uid);

            if (!user) {
                req.logger.warning(`No se encuentra usuario con ID: ${uid}.`);
                return res.status(404).send("Usuario por ID no encontrado.");
            }

            const newRole = user.role === 'user' ? 'premium' : 'user';

            if (newRole === 'premium') {
                const requiredDocumentation = ["Identificacion", "Comprobante de domicilio", "Comprobante de estado de cuenta"];
                const userDocumentation = [...new Set(user.documents.map(doc => doc.name.split('.').slice(0, -1).join('.')))];
                const documentationValidation = requiredDocumentation.every(doc => userDocumentation.includes(doc))
                
                if (!documentationValidation) {
                    req.logger.warning(`El usuario no tiene la documentación requerida.`);
                    return res.status(404).send("Usuario sin documentación requerida.");
                }
            }
    
            const updateUser = await userRepository.findByIdAndUpdate(uid, newRole)
            
            req.logger.info(`Usuario cambiado a Role: ${newRole}.`);
            res.json(updateUser);

        } catch (error) {
            req.logger.error(`Error en el proceso de cambiar rol de usuario`,error);
            res.status(500).json({ message: 'Error en el proceso de cambiar rol de usuario',error });
        }
    }
    async uploadedDocuments(req, res) {
        const { uid } = req.params;
        const uploadedDocuments = req.files;

        try {
            const user = await userRepository.findById(uid);
    
            if (!user) {
                req.logger.warning(`No se encuentra usuario con el ID ${uid}`);
                return res.status(404).send("Usuario no encontrado por ID");
            }

            if (uploadedDocuments) {
                if (uploadedDocuments.documents) {
                    user.documents = user.documents.concat(uploadedDocuments.documents.map(doc => ({
                        name: doc.originalname,
                        reference: doc.path
                    })))
                }
                if (uploadedDocuments.products) {
                    user.documents = user.documents.concat(uploadedDocuments.products.map(doc => ({
                        name: doc.originalname,
                        reference: doc.path
                    })))
                }
                if (uploadedDocuments.profile) {
                    user.documents = user.documents.concat(uploadedDocuments.profile.map(doc => ({
                        name: doc.originalname,
                        reference: doc.path
                    })))
                }
            }
            console.log(user)
            await user.save();
    
            req.logger.info(`Documento cargado exitosamente`);
            res.status(200).send("Documento cargado exitosamente");
        } catch (error) {
            req.logger.error(`Error en el proceso de cargar un documento al usuario.`,error);
            res.status(500).send("Error en el proceso de cargar un documento al usuario.",error);
        }
    }
    async usersMainData(req, res) {
        try {
            const users = await userRepository.findAll()
    
            req.logger.info(`Usuarios: ${users}`);
            res.status(200).send(`Usuarios: ${users}`);
        } catch (error) {
            req.logger.error(`Error en el proceso de cargar usuarios con datos principales.`,error);
            res.status(500).send(`Error en el proceso de cargar usuarios con datos principales.`,error);
        }
    }
    async deleteInactiveUsers(req, res) {
        try {
            const days = 2;
            const { result, usersDeleted } = await userRepository.findAndDeleteInactiveUsers(days);
            for (const user of usersDeleted) {
                await emailManager.userDeleted(user.email);
                req.logger.info(`Aviso de usuario eliminado enviado a: ${user.email}`);
            }
            req.logger.info(`Usuarios eliminados: ${result.deletedCount}`);
            res.status(200).send({ message: `Usuarios eliminados: ${result.deletedCount}` });
        } catch (error) {
            req.logger.error(`Error en el proceso de eliminar usuarios inactivos por ${2} dias.`, error);
            res.status(500).send({ message: `Error en el proceso de eliminar usuarios inactivos por ${2} dias.`, error });
        }
    }
    async deleteUser (req, res) {
        let userId = req.params.uid;
        try {
            const userDelete = await userRepository.deleteById(userId);
            if (!userDelete) {
                req.logger.warning(`Usuario no encontrado con ID ${userId}`);
                return res.status(404).json({ error: `Usuario no encontrado con ID ${userId}` });
            }
            req.logger.info(`Usuario con ID ${userId} eliminado correctamente.`);
            res.json({ message: `Usuario con ID ${userId} eliminado correctamente` });
        } catch (error) {
            req.logger.error(`Error al eliminar usuario con ID ${userId}:`, error);
            res.status(500).json({ error: "Error al eliminar usuario" + error });
        } 
    }
}

module.exports = UserController;