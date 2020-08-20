const Express = require("express");
const UserController = require("../Controller/UserController");
const fileUpload = require("../../FrontEnd/Shares/Middleware/UploadImage");
const Router = Express.Router();
Router.route("/Signup").post(fileUpload.single("image"), UserController.SignUp);
Router.route("/Login").post(UserController.LogIn);

Router.use(UserController.Protected);

Router.route("/ChangePassword").patch(UserController.ChangePassword);
Router.route("/ChangeEmail").patch(UserController.ChangeEmail);
Router.route("/Filter/:Id").get(UserController.FilterProduct);
Router.route("/MySell").get(UserController.MySell);

Router.route("/Me")
  .get(UserController.GetMe)
  .patch(UserController.Update)
  .delete(UserController.Delete);
//
Router.route("/GetAll").get(
  UserController.RestrictTo("admin"),
  UserController.GetAll
);
//
Router.route("/Pay").post(
  UserController.RestrictTo("user"),
  UserController.Pay
);

module.exports = Router;
