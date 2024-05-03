const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const ProductModel = require('./product.models.js');

const cartSchema = new mongoose.Schema({
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products',
        required: true
      },
      quantity: {
        type: Number,
        required: true
      }
    }
  ]
});

cartSchema.pre('findOne', function (next) {
    this.populate('products.product', '_id title price thumbnails');
    next();
});

const CartModel = mongoose.model("carts", cartSchema);

module.exports = CartModel;