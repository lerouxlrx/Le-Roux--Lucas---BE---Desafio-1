const ProductModel = require("../models/product.models.js");
const CartRepository = require("../repositories/cart.repository.js");
const cartRepository = new CartRepository();

class ViewsController {
    async renderProducts(req, res) {
        try {
            const limit = req.query.limit || 20;
            const page = req.query.page || 1;
            const query = req.query.query || null;
            const sort = req.query.sort || null;

            const skip = (page - 1) * limit;

            const products = await ProductModel
                .find()
                .skip(skip)
                .limit(limit);

            const totalProducts = await ProductModel.countDocuments();

            const totalPages = Math.ceil(totalProducts / limit);

            const hasPrevPage = page > 1;
            const hasNextPage = page < totalPages;


            const newArray = products.map(product => {
                const { _id, ...rest } = product.toObject();
                return { id: _id, ...rest }
            });

            const cartId = req.user.cart.toString();

            res.render("products", {
                products: newArray,
                hasPrevPage,
                hasNextPage,
                prevPage: page > 1 ? parseInt(page) - 1 : null,
                nextPage: page < totalPages ? parseInt(page) + 1 : null,
                currentPage: parseInt(page),
                totalPages,
                cartId
            });

        } catch (error) {
            console.error("No se pudieron renderizar los productos.", error);
            res.status(500).json({
                status: 'error',
                error: "Error en el proceso de leer los productos."
            });
        }
    }

    async renderCart(req, res) {
        const cartId = req.params.cid;
        try {
            const cart = await cartRepository.findByID(cartId);

            if (!cart) {
                console.log("No existe el carrito con dicho ID");
                return res.status(404).json({ error: "Carrito a renderizar no encontrado por ID" });
            }

            let totalBuy = 0;

            const productsInCart = cart.products.map(item => {
                const product = item.product.toObject();
                const quantity = item.quantity;
                const totalPrice = product.price * quantity;

                totalBuy += totalPrice;

                return {
                    product: { ...product, totalPrice },
                    quantity,
                    cartId
                };
            });

            res.render("carts", { products: productsInCart, totalBuy, cartId });
        } catch (error) {
            console.error("Error en el proceso de obtener carrito a renderizar.", error);
            res.status(500).json({ error: "Error en el proceso de obtener carrito a renderizar." });
        }
    }

    async renderLogin(req, res) {
        res.render("login");
    }

    async renderRegister(req, res) {
        res.render("register");
    }

    async renderRealTimeProducts(req, res) {
        try {
            res.render("realtimeproducts");
        } catch (error) {
            console.log("Error en el proceso de renderizar realtimeproducts", error);
            res.status(500).json({ error: "Error en el proceso de renderizar realtimeproducts" });
        }
    }

    async renderChat(req, res) {
        res.render("chat");
    }

    async renderHome(req, res) {
        res.render("home");
    }
}

module.exports = ViewsController;