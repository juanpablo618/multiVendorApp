const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;
const productSchema = Schema({
  name: {
    type: String,
    required: [true, "Please Provide Name Of Product"],
    toLower: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  price: {
    type: Number,
    required: [true, "Please Provide Price Of Product"],
    validate: function(Value) {
      if (Value <= 0)
        throw new Error("Price Can Not Be Less Than Or Equal To Zero");
    }
  },
  image: {
    type: String,
    default: "No Image Yet"
  },
  category: {
    type: Mongoose.SchemaTypes.ObjectId,
    ref: "Category",
    required: [true, "Product Must Have Category"]
  },
  vendor: {
    type: Mongoose.SchemaTypes.ObjectId,
    ref: "User",
    required: [true, "Product Must Have Vendor"]
  }
});

module.exports = Mongoose.model("Product", productSchema);
