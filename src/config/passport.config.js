const passport = require("passport")
const GitHub = require("passport-github2")
const jwt = require("passport-jwt");
const JWTStrategy = jwt.Strategy;
const ExtractJwt = jwt.ExtractJwt;

const UserModel = require("../models/user.model.js")
const { createHash, isValidPassword } = require("../utils/hashbcryp")

const initializePassport = () => {
    passport.use("jwt", new JWTStrategy({
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
        secretOrKey: "teccomerce"
    }, async (jwt_payload, done) => {
        try {
            const user = await UserModel.findById(jwt_payload.user._id);
            if (!user) {
                return done(null, false);
            }
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }));
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

const cookieExtractor = (req) => {
    let token = null;
    if(req && req.cookies) {
        token = req.cookies["teccomerceCookieToken"]
    }
    return token;
}


module.exports = initializePassport