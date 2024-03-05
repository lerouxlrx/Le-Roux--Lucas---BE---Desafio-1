const express = require("express");
const router = express.Router(); 
const ProductModel = require('../models/product.model.js');
const ProductManager = require('../controllers/product.manager.db.js');

router.get("/", async (req,res) => {
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

       res.json(objetoResultado)
       //res.render("productos", objetoResultado)

   } catch (error) {
       console.log ("No se pudieron traer los productos");
       res.status(500).json({error: "Error al leer productos."});
   }
})


module.exports = router; 