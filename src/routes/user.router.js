const express = require("express");
const router = express.Router();
const passport = require("passport");
const UserManager = require("../controllers/user.manager.js");
const userManager = new UserManager();

router.post("/register", userManager.register);
router.post("/login", userManager.login);
router.get("/profile", passport.authenticate("jwt", { session: false }), userManager.profile);
router.post("/logout", userManager.logout.bind(userManager));
router.get("/admin", passport.authenticate("jwt", { session: false }), userManager.admin);

module.exports = router; 