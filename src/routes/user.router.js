const express = require("express");
const router = express.Router();
const passport = require("passport");
const UserManager = require("../controllers/user.manager.js");
const userManager = new UserManager();
const upload = require("../middleware/multer.js");

router.post("/register", userManager.register);
router.post("/login", userManager.login);
router.get("/profile", passport.authenticate("jwt", { session: false }), userManager.profile);
router.post("/logout", userManager.logout.bind(userManager));
router.get("/admin", passport.authenticate("jwt", { session: false }), userManager.admin);
router.post("/requestPasswordReset", userManager.requestPasswordReset);
router.post('/reset-password', userManager.resetPassword);
router.put("/premium/:uid", userManager.changeRolPremium);
router.post("/:uid/documents", upload.fields([{ name: "documents" }, { name: "products" }, { name: "profile" }]), userManager.uploadedDocuments)
router.get("/", userManager.usersMainData);
router.delete("/delete", userManager.deleteInactiveUsers);
router.delete("/delete/:uid", userManager.deleteUser);

module.exports = router; 