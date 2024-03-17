const passport = require("passport")
const local = require("passport-local")
const GitHub = require("passport-github2")

const UserModel = require("../models/user.model.js")
const { createHash, isValidPassword } = require("../utils/hashbcryp")


const LocalStrategy = local.Strategy;

const initializePassport = () => {
    passport.use("register", new LocalStrategy({
        passReqToCallback: true, //acceder a obj request
        usernameField: "email"
    }, async (req, username, password, done) => {
        const {first_name, last_name, email, age} = req.body
        try {
            let user = await UserModel.findOne({email})
            if (user) return done(null, false);
            let newUser = {
                first_name,
                last_name,
                email,
                age,
                password: createHash(password)
            }
            let result = await UserModel.create(newUser)
            return done(null, result)
        } catch (error) {
            return done(error)
        }
    }))
    passport.use("login", new LocalStrategy({
        usernameField: "email"
    }, async(email, password, done) => {
        try {
            const user = await UserModel.findOne({email})
            if (!user) {
                console.log("No se encontro un usuario con este email.")
                return done (null, false, {message: "Usuario no encontrado"})
            }
            if(!isValidPassword(password,user)) {
                return done(null, false, { message: "La contraseña no es correcta"})
            }
            return done(null, user)
        } catch (error) {
            return done(error)
        }
    }))
    passport.serializeUser((user, done) => {
        done(null, user._id)
    })
    passport.deserializeUser(async (id, done) =>{
        let user = await UserModel.findById({_id:id})
        done(null, user)
    })
    passport.use("github", new GitHub({
        clientID: "Iv1.5af32bda262f177d",
        clientSecret: "15926fd617575cbe54bba32d36a5e3d228f4cd58",
        callbackUrl: "http://localhost:8080/api/sessions/githubcallback"
    }, async (accesToken, refreshToken, profile, done) => {
        try {
            let user = await UserModel.findOne({email: profile._json.email})

            if(!user) {
                let newUser = {
                    first_name: profile._json.name,
                    last_name: "GitHub",
                    email: profile._json.email,
                    age: 0,
                    password: "GitHub"
                }

                let result = await UserModel.create(newUser)
                done(null, result);
            } else {
                done (null, user);
            }
        } catch (error) {
            return done(error);
        }
    }))
}

module.exports = initializePassport