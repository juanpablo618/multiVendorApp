const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;
const categorySchema = Schema({
  name: {
    type: String,
    required: [true, "Please Provide Category"],
    unique: [true, "This Category Already Exists"],
    tolower: true,
    trim: true
  },
  admin: {
    type: Mongoose.Schema.ObjectId,
    ref: "User"
  }
});
module.exports = Mongoose.model("Category", categorySchema);
