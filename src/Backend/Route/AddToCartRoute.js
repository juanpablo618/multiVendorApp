const Express = require("express");
const CartController = require("../Controller/AddToCartController");
const UserController = require("../Controller/UserController");

const Router = Express.Router();

Router.use(UserController.Protected, UserController.RestrictTo("user"));

Router.route("/:Id")
  .post(CartController.AddToCart)
  .delete(CartController.DeleteFromCart);

Router.route("/").delete(CartController.DeleteAllFromCart);

Router.route("/Specific/:Id").delete(CartController.DeleteSpecificProdcut);
Router.route("/myCart").get(CartController.GetMyCart);

module.exports = Router;
