const CategoryModel = require("../Models/CategoryModel");
const ProductModel = require("../Models/ProductModel");
const AddToCartModel = require("../Models/AddToCartModel");
const AsyncWrapper = require("../Utils/AsyncWrapper");
const AppError = require("../Utils/AppError");

exports.AddCategory = AsyncWrapper(async (req, res, next) => {
  const Category = await CategoryModel.create({
    name: req.body.name,
    admin: req.body.admin
    //req.User._id
  });
  if (!Category) {
    return next(new AppError("Server Is Down Plz Try Again", 500));
  }
  res.status(201).json({
    Status: "Success",
    Category
  });
});

exports.RemoveCategory = AsyncWrapper(async (req, res, next) => {
  // Deleting Category
  const Category = await CategoryModel.findByIdAndDelete(req.params.Id);
  if (!Category) {
    return next(new AppError("Can Not Find This Category", 404));
  }
  // Finding All Product Which Is Type Of This Category
  const Products = await ProductModel.find({ category: req.params.Id });
  // Finding All Item Added To Cart Inorder To Delete Those Which Are Part Of Products Array Because
  // These Item Which Added In Cart Is Going To Delete Because Of Depenedncy
  const Promise1 = Products.map(
    async Product => await AddToCartModel.find({ product: Product._id })
  );
  const MyData = await Promise.all(Promise1);
  let Data1 = [...MyData[0]];

  // Deleteing Cart Items
  const promise3 = Data1.map(
    async Cart => await AddToCartModel.findByIdAndDelete(Cart._id)
  );
  await Promise.all(promise3);
  // Deleing Products
  const Promise2 = Products.map(
    async Product => await ProductModel.findByIdAndDelete(Product._id)
  );
  await Promise.all(Promise2);

  res.status(200).json({
    Status: "Success"
  });
});

exports.GetAll = AsyncWrapper(async (req, res, next) => {
  const Categories = await CategoryModel.find({});
  res.status(200).json({
    Status: "Success",
    Count: Categories.length,
    Categories
  });
});

exports.UpdateCategory = AsyncWrapper(async (req, res, next) => {
  const Id = req.params.Id;
  const { name } = req.body;
  const Category = await CategoryModel.findById(Id);
  if (!Category) {
    return next(new AppError("Couldn't Find This Category", 404));
  }
  Category.name = name;
  await Category.save();
  res.status(200).json({
    Status: "Success",
    Category
  });
});

exports.GetSpcificCategory = AsyncWrapper(async (req, res, next) => {
  const Id = req.params.Id;
  const Category = await CategoryModel.findById(Id);
  if (!Category) {
    return next(new AppError("Couldn't Find This Category", 404));
  }
  res.status(200).json({
    Status: "Success",
    Category
  });
});
