const App = require("./Connection");
const Express = require("express");
const UserRoute = require("./Route/UserRoute");
const CategoryRoute = require("./Route/CategoryRoute");
const ProductRoute = require("./Route/ProductRoute");
const AddToCartRoute = require("./Route/AddToCartRoute");
const AppError = require("./Utils/AppError");
const ErrorMiddleWare = require("./Utils/error");
const Path = require("path");

// Resolving CORS Error
App.use((req, res, next) => {
  // Website you wish to allow to connect
  res.header("Access-Control-Allow-Origin", "*");
  // Request headers you wish to allow
  res.header(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With,content-type,Accept,Authorization"
  );
  if (req.method === "OPTIONS") {
    // Request methods you wish to allow
    res.header(
      "Access-Control-Allow-Methods",
      "GET, POST, OPTIONS, PUT, PATCH, DELETE"
    );
    return res.status(200).json({});
  }
  next();
});

// ALLOW EXPRESS TO READ JSON
App.use(Express.json());

App.use(
  "/src/Upload/Images",
  Express.static(Path.join(__dirname, "..", "Upload", "Images"))
);
// ROUTES
App.use("/User", UserRoute);
App.use("/Category", CategoryRoute);
App.use("/Product", ProductRoute);
App.use("/Cart", AddToCartRoute);

// It Will Be Execute When There Is No Path To Be Found
App.all("*", (req, res, next) => {
  return next(
    new AppError(
      `Unable To Find ${req.protocol}://${req.get("host")}${req.originalUrl} `,
      404
    )
  );
});

// Execute This MiddleWare When Any Error Occur
App.use(ErrorMiddleWare);

// Listening Request On PORT
const Server = App.listen(5000, err => {
  if (err) throw new Error(err.message);
  console.log("Server Is Running On Port ", 5000);
});

// Handle UncaughtException If Any
process.on("uncaughtException", err => {
  console.log("Unhandled Exception");
  console.log("Shutting Down Server");
  console.log(err.stack);
  console.log(err.name);
  console.log(err.message);
  Server.close(() => {
    process.exit(1);
  });
});
