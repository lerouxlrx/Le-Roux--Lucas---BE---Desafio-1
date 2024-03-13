const express = require("express");
const router = express.Router(); 
const ProductModel = require('../models/product.model.js');
const ProductManager = require('../controllers/product.manager.db.js');
const CartManager = require("../controllers/cart.manager.db.js");
const productManager = new ProductManager();
const cartManager = new CartManager();

router.get("/products", async (req,res) => {
   const limit = req.query.limit || 10;
   const page = req.query.page || 1;
   const query = req.query.query || null;
   const sort = req.query.sort || null;
   
   try {     
       const productos = await ProductModel.paginate({query}, {limit,page,sort});
       const status = (productos) ? "success" : "error"

       const productosResultados = productos.docs.map(producto => {
         const {_id, ...rest} = producto.toObject();
         return rest;
       })
       const objetoResultado = {
         status: status,
         payload: productosResultados,
         totalPages: productos.totalPages,
         prevPage: productos.prevPage,
         nextPage: productos.nextPage,
         page: productos.page,
         hasPrevPage: productos.hasPrevPage,
         hasNextPage: productos.hasNextPage,
         prevLink: (productos.prevPage) ? "/?page="+productos.prevPage : null,
         nextLink: (productos.nextPage) ? "/?page="+productos.nextPage : null,
       }
       //console.log(req.session.user)
       //res.json(objetoResultado)
       res.render("productos", {user:req.session.user, payload:productosResultados})

   } catch (error) {
       console.log ("No se pudieron traer los productos");
       res.status(500).json({error: "Error al leer productos."});
   }
})

router.get("/carts/:cid", async (req, res) => {
  const id = req.params.cid;

  try {
     const cart = await cartManager.getCartById(id);

     if(cart) {
      const productsInCart = cart.products.map(item => ({
        product: item.product.toObject(),
        quantity: item.quantity
      }))
      console.log(productsInCart)
      res.render("carts", { products: productsInCart })
    } else {
        res.json({error: "No se encontro un carrito con dicho ID"})
    }
    

;
  } catch (error) {
     console.error("Error al obtener el carrito", error);
     res.status(500).json({ error: "Error interno del servidor" });
  }
});

//Login + Register + Profile

router.get("/", (req, res) => {
  res.redirect("/login");
});

router.get("/login", (req, res) => {
  if (req.session.login) {
      return res.redirect("/products");
  }
  res.render("login");
});

router.get("/register", (req, res) => {
  if (req.session.login) {
      return res.redirect("/products");
  }
  res.render("register");
});

module.exports = router; 