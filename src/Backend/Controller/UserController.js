const UserModel = require("../Models/UserModel");
const ProductModel = require("../Models/ProductModel");
const AddToCartModel = require("../Models/AddToCartModel");
const AsyncWrapper = require("../Utils/AsyncWrapper");
const AppError = require("../Utils/AppError");

exports.SignUp = AsyncWrapper(async (req, res, next) => {
  const { firstName, lastName, email, password, role } = req.body;
  console.log();
  const User = new UserModel({
    firstName,
    lastName,
    email,
    role,
    password,
    image: req.file.path
  });
  const Exists = await UserModel.findOne({ email });
  if (Exists) {
    return next(new AppError("Please Select Unique Email", 400));
  }
  await User.save();
  if (!User) {
    return next(new AppError("Server Is Not Responding", 500));
  }

  const Token = User.GenerateToken(User._id);

  res.status(201).send({
    Status: "Success",
    Token,
    Id: User._id,
    Role: User.role,
    Image: User.image
  });
});

exports.LogIn = AsyncWrapper(async (req, res, next) => {
  const { email, password } = req.body;
  const User = await UserModel.findOne({
    email
  });
  if (!User) {
    return next(new AppError("Invalid Email Or Password", 404));
  }
  const IsCorrectPassword = await User.MatchPassword(password, User.password);
  if (!IsCorrectPassword) {
    return next(new AppError("Invalid Email Or Password", 404));
  }
  const Token = User.GenerateToken(User._id);
  res.status(200).send({
    Status: "Success",
    Token,
    Id: User._id,
    Role: User.role,
    Image: User.image
  });
});

exports.GetMe = AsyncWrapper(async (req, res, next) => {
  res.status(200).send({
    Status: "Success",
    User: req.User
  });
});

exports.Update = AsyncWrapper(async (req, res, next) => {
  const { firstName, lastName } = req.body;
  req.User.firstName = firstName;
  req.User.lastName = lastName;
  await req.User.save();
  res.status(200).json({
    Status: "Success",
    User: req.User
  });
});

exports.Delete = AsyncWrapper(async (req, res, next) => {
  const User = await UserModel.findById(req.User._id);
  if (!User) {
    return next(new AppError("Couldn't Find It", 404));
  }
  await ProductModel.deleteMany({
    vendor: req.User._id
  });
  await User.remove();
  res.status(200).json({
    Status: "Success"
  });
});
exports.ChangeEmail = AsyncWrapper(async (req, res, next) => {
  const { email, new_email } = req.body;
  if (req.User.email !== email) {
    return next(new AppError("You Are Not Authorized For This Action", 401));
  }
  const User = await UserModel.findOne({ email: new_email });
  if (User) {
    return next(new AppError("Please Use Any Other Email", 400));
  }
  req.User.email = new_email;
  await req.User.save();
  return res.status(200).json({
    Status: "Success"
  });
});
exports.ChangePassword = AsyncWrapper(async (req, res, next) => {
  const { email = "", password = "" } = req.body;
  if (req.User.email === email) {
    req.User.password = password;
    await req.User.save();
    return res.status(200).send({
      Status: "Success"
    });
  } else {
    return next(new AppError("You Are Not Allowed To Take This Action", 401));
  }
});

exports.Protected = AsyncWrapper(async (req, res, next) => {
  let Token;
  // 1) Check if the Token There
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    Token = req.headers.authorization.split(" ")[1];
  } else {
    return next(new AppError("You Are Not Login", 401));
  }
  // 2) Verify The Token
  const Decoder = UserModel.VerifyToken(Token);
  // 3) Check if the user exists
  const user = await UserModel.findById(Decoder.Id);
  if (!user) {
    return next(new AppError("This User Doesn't Exists Anymore!!!", 401));
  }
  // Grant Access To Other Routes-
  req.User = user;
  next();
});

// USED TO SELECT ALL THE VENDORS
exports.GetAll = AsyncWrapper(async (req, res, next) => {
  const Vendors = await UserModel.find({ role: "vendor" }).select(
    "-password -email -__v"
  );
  const promise = Vendors.map(async Vendor => {
    const Prdoucts = await ProductModel.find({ vendor: Vendor._id });
    Vendor.myProduct = Prdoucts.length;
    await Vendor.save();
  });
  await Promise.all(promise);
  res.status(200).json({
    Status: "Success",
    Count: Vendors.length,
    Vendors
  });
});

// Making Restriction So That Only Desired Uses Can Access This Path/Route
exports.RestrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.User.role)) {
      return next(new AppError("You Are Not Allowed For This Action", 403));
    }
    next();
  };
};

// User Can Filter Product From All Of The Available Products-
exports.FilterProduct = AsyncWrapper(async (req, res, next) => {
  const Products = await ProductModel.find({
    category: req.params.Id
  });
  if (Products.length === 0) {
    return next(new AppError("Sorry, Can Not Find This Prduct", 404));
  }
  res.status(200).json({
    Status: "Success",
    Count: Products.length,
    Products
  });
});

exports.Pay = AsyncWrapper(async (req, res, next) => {
  const Data = [];
  const NewArr = [];
  for (let i = 0; i < req.User.items.length; i++) {
    for (let j = 0; j < req.User.items[i].quantity; j++) {
      const AddToCart = {
        product: req.User.items[i].product,
        buyer: req.User._id,
        vendor: req.User.items[i].vendor
      };
      NewArr.push(AddToCart);
    }
  }
  const SaveToCart = NewArr.map(async Item => {
    const AddToCart = new AddToCartModel(Item);
    return await AddToCart.save();
  });
  // Storing To AddToCart
  await Promise.all(SaveToCart);
  // Removing Redundency And Optimizing Query By Accumalating Data Related To Single Vendor
  //Into Single Object
  req.User.items.forEach(Item => {
    const ItemFound = Data.find(
      Vendor => Item.vendor.toString() === Vendor.vendor.toString()
    );
    if (!ItemFound) {
      const Obj = {
        vendor: Item.vendor,
        totalAmount: Item.total
      };
      Data.push(Obj);
    } else {
      ItemFound.totalAmount = ItemFound.totalAmount + Item.total;
    }
  });

  // Executing Query And It Will Return Pending Promises
  const promise = Data.map(async Item => {
    const Vendor = await UserModel.findById(Item.vendor);
    Vendor.totalAmount = Vendor.totalAmount + Item.totalAmount;
    return await Vendor.save();
  });

  // Executing All The Pending Promises-
  await Promise.all(promise);
  // Once Bill Paid  Then We Have To Empty The Items
  req.User.items = [];
  req.User.totalAmount = 0;
  await req.User.save();
  res.status(200).json({
    Status: "Success",
    Count: Data.length,
    Data
  });
});

exports.MySell = AsyncWrapper(async (req, res, next) => {
  let Cart = await AddToCartModel.find({ vendor: req.User._id }).populate(
    "product"
  );
  let Arr = [];
  Cart.forEach(Product => {
    const Index = Arr.findIndex(prod => {
      return prod.Id === Product.product._id;
    });
    if (Index < 0) {
      Arr.push({
        Image: Product.product.image,
        Id: Product.product._id,
        Total: Product.product.price,
        Quantity: 1
      });
    } else {
      Arr[Index].Quantity = Arr[Index].Quantity + 1;
      Arr[Index].Total = Arr[Index].Total + Product.product.price;
    }
  });
  res.status(200).json({
    Status: "Success",
    Cart: Arr
  });
});
