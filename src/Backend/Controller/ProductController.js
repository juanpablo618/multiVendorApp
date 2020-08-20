const ProductModel = require("../Models/ProductModel");
const CategoryModel = require("../Models/CategoryModel");
const AddToCartModel = require("../Models/AddToCartModel");
const UserModel = require("../Models/UserModel");
const AsyncWrapper = require("../Utils/AsyncWrapper");
const AppError = require("../Utils/AppError");

exports.AddProduct = AsyncWrapper(async (req, res, next) => {
  const { name, description, price, category } = req.body;
  const vendor = req.User._id;
  const IsCategory = await CategoryModel.findById(category);
  if (!IsCategory) {
    return next(new AppError("This Category Doesn't Exist", 404));
  }
  const Product = new ProductModel({
    name,
    description,
    price,
    image: req.file.path,
    category,
    vendor
  });
  await Product.save();
  if (!Product) {
    return next(new AppError("Server Is Down Plz Try Again", 500));
  }
  // const User = await UserModel.findById(vendor);
  // User.items.push(Product._id);
  // await User.save();
  res.status(201).json({
    Status: "Success",
    Product
  });
});

exports.RemoveProduct = AsyncWrapper(async (req, res, next) => {
  // Check whether Product exist or not
  const Product = await ProductModel.findById(req.params.Id).populate("vendor");
  if (!Product) {
    return next(new AppError("Could Not Find This Product", 404));
  }
  // If product exist check whether the vendor who is removing is the one who created this product
  if (Product.vendor._id.toString() !== req.User._id.toString()) {
    return next(new AppError("You Are Not Allowed", 401));
  }
  await AddToCartModel.deleteMany({ vendor: req.User._id });
  await Product.remove();

  // await Product.vendor.save();

  res.status(200).json({
    Status: "Success",
    Product
  });
});

exports.UpdateProduct = AsyncWrapper(async (req, res, next) => {
  // Find product if it exists
  const Product = await ProductModel.findById(req.params.Id);
  if (!Product) {
    return next(new AppError("Could Not Find This Product", 404));
  }
  // We changed Product.vendor & req.User._id toString because they both are project which never be same-
  // If product exists then check whether the person who is deleting is the same who created
  if (Product.vendor.toString() !== req.User._id.toString()) {
    return next(new AppError("You Are Not Allowed For This Action", 401));
  }
  const { name, description, price } = req.body;
  Product.name = name;
  Product.description = description;
  Product.price = price;
  // Checking If We Have Somethig In File System-
  Product.image = req.file ? req.file.path : Product.image;
  await Product.save();
  res.status(200).json({
    Status: "Success",
    Product
  });
});

exports.DeleteAll = AsyncWrapper(async (req, res, next) => {
  const Product = await ProductModel.deleteMany({ vendor: req.User._id });
  res.status(200).json({
    Status: "Success",
    Count: `${Product.deletedCount} Items Deleted`
  });
});

exports.GetAllByUserId = AsyncWrapper(async (req, res, next) => {
  const Product = await ProductModel.find({ vendor: req.User._id });
  res.status(200).json({
    Status: "Success",
    Count: Product.length,
    Product
  });
});

exports.GetProductById = AsyncWrapper(async (req, res, next) => {
  const Product = await ProductModel.findById(req.params.Id);
  res.status(200).json({
    Status: "Success",
    Product
  });
});

exports.GetAllProducts = AsyncWrapper(async (req, res, next) => {
  const Products = await ProductModel.find({});
  if (!Products) {
    return next(new AppError("Something Is Going Wrong", 500));
  }
  return res.status(200).json({
    Status: "Success",
    Products
  });
});
