const AddToCartModle = require("../Models/AddToCartModel");
const ProductModel = require("../Models/ProductModel");
const UserModel = require("../Models/UserModel");
const AsyncWrapper = require("../Utils/AsyncWrapper");
const AppError = require("../Utils/AppError");

exports.AddToCart = AsyncWrapper(async (req, res, next) => {
  // Check Whether The Item Buyer Want To Buy Does Exists Or Not-
  const Id = req.params.Id;
  const Product = await ProductModel.findById(Id);
  if (!Product) {
    return next(
      new AppError("Sorry, This Product Is Not Available Anymore", 404)
    );
  }
  // Checking Whether The Item Buyer Inteded To Add Is Already Exists In His/Her Items Array-
  let Index = req.User.items.findIndex(
    Item => Item.product.toString() === Product._id.toString()
  );
  // If Item Is Not In Items Array Of User
  if (Index < 0) {
    const AddedItem = {
      product: Product._id,
      vendor: Product.vendor,
      price: Product.price,
      quantity: 1,
      total: Product.price * 1
    };
    req.User.items.push(AddedItem);
  } else {
    // If Item Is Exists In Items Array Of User than just update quantity of that Specific product
    const quantity = req.User.items[Index].quantity + 1;
    const AddedItem = {
      product: Product._id,
      vendor: Product.vendor,
      price: Product.price,
      quantity,
      total: Product.price * quantity
    };
    req.User.items.splice(Index, 1, AddedItem);
  }

  let Total = MakeTotal(req.User.items);
  // Making Total Of User Which He/She Buy Products-
  req.User.totalAmount = Total;
  // Updating User
  await req.User.save();
  if (!req.User) {
    return next(new AppError("Server Is Not Responding", 500));
  }

  res.status(201).json({
    Status: "Success"
    // ,
    // AddToCart
  });
});

// This Method Will Delete Every Product Which You Added To Cart
exports.DeleteAllFromCart = AsyncWrapper(async (req, res, next) => {
  const Count = req.User.items.length;
  req.User.items = [];
  req.User.totalAmount = 0;
  await req.User.save();
  res.status(200).json({
    Status: "Success",
    Count: `${Count} Items Are Deleted`
  });
});

// It will only delete some amount of specific product such as deleting 1 quantity of product-
exports.DeleteFromCart = AsyncWrapper(async (req, res, next) => {
  // Check Whether The Item Buyer Want To Buy Does Exists Or Not-
  const Index = req.User.items.findIndex(
    Item => Item._id.toString() === req.params.Id.toString()
  );
  if (Index < 0) {
    return next(
      new AppError("Sorry, This Product Is Not Available Anymore", 404)
    );
  } else {
    if (req.User.items[Index].quantity === 1) {
      // If quantity=== 0 than we want to delete the complete Object from Items Array Otherwise id will be maintained there with quantity of 0 which we not want we want to completely remove object who's quantity=== 0
      req.User.items.splice(Index, 1);
    } else {
      // If Item Exists In Items Array Of User than just update quantity of that Specific product
      const quantity = req.User.items[Index].quantity - 1;
      const AddedItem = {
        product: req.User.items[Index].product,
        vendor: req.User.items[Index].vendor,
        price: req.User.items[Index].price,
        quantity,
        total: quantity * req.User.items[Index].price
      };
      req.User.items.splice(Index, 1, AddedItem);
      req.User.totalAmount = MakeTotal(req.User.items);
    }
    await req.User.save();
    res.status(200).json({
      Status: "Success",
      Message: "Deleted Item From Cart"
    });
  }
});

// This method will Completely Delete Specific Product From Items Array
exports.DeleteSpecificProdcut = AsyncWrapper(async (req, res, next) => {
  // Check Whether The Item Buyer Want To Buy Does Exists Or Not-
  const Id = req.params.Id.toString();
  // Checking The Index That Which Product We Are Trying To Delete Is Present In Our Cart Items Or Not-
  const Index = req.User.items.findIndex(
    Item => Item.product.toString() === Id
  );
  if (Index < 0) {
    return next(
      new AppError("Sorry, This Product Is Not Available Anymore", 404)
    );
  } else {
    // Deleting Item From Items Array
    req.User.items.splice(Index, 1);
    // Making Total After Deleting The Product From Items Array
    req.User.totalAmount = MakeTotal(req.User.items);
  }
  await req.User.save();
  res.status(200).json({
    Status: "Success",
    Message: "Deleted Item From Cart"
  });
});

// This Method Will Provide You The Whole Cart Of LoggedIn User-
exports.GetMyCart = AsyncWrapper(async (req, res, next) => {
  // Populating Product Which Will Contain Whole Info Of Product Which We Have Added To Cart
  const Cart = await UserModel.findById(req.User._id).populate("items.product");
  let Arr = [];
  const promise = Cart.items.map(async Product => {
    // We will go through each item added to cart to check they are avilable still yet or not
    if (Product.product) {
      return await ProductModel.findById(Product.product._id);
    }
    return null;
  });
  const Data = await Promise.all(promise);
  Data.forEach((Product, index) => {
    // In Data we will have all the data after all promises resolve if items are available those will
    // not be null in Data Array So We Have To Elimanate Those Which Are Null In Data Array
    // And We i'll Store Those Items Only In Our Cart Which Are Available
    if (Product) {
      Arr.push(Cart.items[index]);
    }
  });
  // Updating User After All Above Action
  req.User.items = Arr;
  req.User.totalAmount = MakeTotal(Arr);
  await req.User.save();
  const myCart = await UserModel.findById(req.User._id).populate(
    "items.product"
  );
  return res.status(200).json({
    Status: "Success",
    Cart: myCart
  });
});

// It Will Make Total Of Product Cost Which You Have To Pay-
const MakeTotal = (Items = []) => {
  let Total = 0;
  Items.forEach(Item => {
    Total = Total + Item.total;
  });
  return Total;
};
