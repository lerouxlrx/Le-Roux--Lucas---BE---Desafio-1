const express = require("express");
const router = express.Router();
const UserModel = require("../models/user.model.js");
const { isValidPassword } = require("../utils/hashbcryp.js");
const passport = require("passport")


router.get("/github", passport.authenticate("github", {scope: ["user:email"]}), async (req, res) =>{})

router.get("/githubcallback", passport.authenticate("github", {failureRedirect: "/login"}), async(req, res)=>{
    req.session.user = req.user;
    req.session.login = true;
    res.redirect("/products");
})

module.exports = router;