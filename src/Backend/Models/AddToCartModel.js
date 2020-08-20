const Mongoose = require("mongoose");

const Schema = Mongoose.Schema;

const addToCartSchema = Schema({
  product: {
    type: Mongoose.Schema.ObjectId,
    ref: "Product"
  },
  buyer: {
    type: Mongoose.Schema.ObjectId,
    ref: "User"
  },
  vendor: {
    type: Mongoose.Schema.ObjectId,
    ref: "User"
  }
});

module.exports = Mongoose.model("Cart", addToCartSchema);
