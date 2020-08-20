const Express = require("express");
const UserController = require("../Controller/UserController");
const ProductController = require("../Controller/ProductController");
const fileUpload = require("../../FrontEnd/Shares/Middleware/UploadImage");
const Router = Express.Router();

Router.route("/getAll").get(ProductController.GetAllProducts);
Router.route("/:Id").get(ProductController.GetProductById);

Router.use(UserController.Protected, UserController.RestrictTo("vendor"));

Router.route("/")
  .post(fileUpload.single("image"), ProductController.AddProduct)
  .get(ProductController.GetAllByUserId)
  .delete(ProductController.DeleteAll);

Router.route("/:Id")
  .patch(fileUpload.single("image"), ProductController.UpdateProduct)
  .delete(ProductController.RemoveProduct);

module.exports = Router;
