const Mongoose = require("mongoose");
const Express = require("express");
// Handling UnhandledRejection
process.on("unhandledRejection", err => {
  console.log("Unhandled Rejection.........");
  // console.log(err.stack);
  // console.log(err.name);
  console.log(err.message);
  process.exit(1);
});

// Connecting With DB
Mongoose.connect(
  "mongodb://127.0.0.1:27017/ShoppingCart",
  {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  },
  err => {
    if (err) {
      return console.log("Not Connected To Database :(");
    }
    console.log("Connected To Database :)");
  }
);

// MAKING APP AS EXPRESS
const App = Express();

module.exports = App;
