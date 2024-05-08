const express = require("express");
const router = express.Router(); 
const ViewsController = require("../controllers/view.maganer.js");
const viewsController = new ViewsController();
const checkUserRole = require("../middleware/checkrole.js");
const passport = require("passport");
const generateProducts = require("../utils/faker.js");

router.get("/products", checkUserRole(['user']),passport.authenticate('jwt', { session: false }), viewsController.renderProducts);

router.get("/carts/:cid", viewsController.renderCart);
router.get("/", viewsController.renderLogin);
router.get("/login", viewsController.renderLogin);
router.get("/register", viewsController.renderRegister);
router.get("/realtimeproducts", checkUserRole(['admin']), viewsController.renderRealTimeProducts);
router.get("/chat", checkUserRole(['user']) ,viewsController.renderChat);
router.get("/ticket/:tid", viewsController.renderTicket);


//Mocking
router.get("/mockingproducts", (req, res) => {

    const products = [];

    for(let i = 0; i < 100; i++) {
        products.push(generateProducts());
    }
    res.json(products);
})


module.exports = router; 