const productModel = require("../models/Products");
const slugify = require("slugify");

//====>>>> Create A product <<<<====//
module.exports.createProduct = async (req, res) => {
  if (req.body.productName) {
    req.body.slug = slugify(req.body.productName);
  }
  const createdProduct = await productModel.create(req.body);
  if (!createdProduct) {
    throw "unable to create product";
  }
  res.json({
    status: "Success",
    message: "product created successfully",
    data: createdProduct,
  });
};

//====>>>> update a product <<<<====//

//====>>>> get a product based on id <<<<====//
module.exports.getProduct = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw "Id not found.";
  }
  const foundProduct = await productModel.findById(id);

  res.json({
    status: "Success",
    message: "product fetched successfully",
    data: foundProduct,
  });
};

//====>>>> get all product <<<<====//
// module.exports.getAllProducts = async (req, res) => {
//   const foundProducts = await productModel.find();

//   if (!foundProducts) {
//     throw "There is no product in database.";
//   }

//   res.json({
//     status: "Success",
//     message: "products fetched successfully",
//     data: foundProducts,
//   });
// };

//============> Get Page wise products <============//
module.exports.getProductsByPage = async (req, res) => {
  const page = parseInt(req.params.page) || 1;
  const limit = parseInt(req.params.limit) || 12;

  const skip = (page - 1) * limit;

  const products = await productModel.find().skip(skip).limit(limit);

  if (!products) {
    throw "There is no product in database.";
  }

  res.json({
    status: "Success",
    message: "products fetched successfully",
    data: products,
  });
};
