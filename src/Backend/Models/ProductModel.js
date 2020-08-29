const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;
const productSchema = Schema({
  name: {
    type: String,
    required: [true, "Por favor proporciona un nombre para el producto"],
    toLower: true,
    trim: true
  },
  telefono: {
    type: String,
    required: [true, "Por favor porporciona un nro de tel para el producto"],
    toLower: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  price: {
    type: Number,
    required: [true, "Por favor proporciona un precio para el producto"],
    validate: function(Value) {
      if (Value <= 0)
        throw new Error("El precio no puede ser menor o igual a cero");
    }
  },
  image: {
    type: String,
    default: "No Image Yet"
  },
  category: {
    type: Mongoose.SchemaTypes.ObjectId,
    ref: "Category",
    required: [true, "El producto debe tener una categoría"]
  },
  vendor: {
    type: Mongoose.SchemaTypes.ObjectId,
    ref: "User",
    required: [true, "El producto debe tener vendedor"]
  }
});

module.exports = Mongoose.model("Product", productSchema);
