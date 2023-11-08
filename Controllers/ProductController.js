const productModel = require("../models/products");
const { validateMongooseId } = require("../services/validate_mogoose_id");

//====>>>> create the product <<<<====//
module.exports.createProduct = async (req, res) => {
  const {
    productName,
    description,
    color,
    discountPercentage,
    category,
    stockQuantity,
  } = req.body;

  const rating = req.body?.rating;
  const reviews = req.body?.reviews;
  let errors = [];

  console.log("files", req.files);

  const thumbnail = `http://localhost:5000/${req.files[0]?.path}`;

  const images = req.files?.map((file) => {
    return `http://localhost:5000/${file.path}`;
  });
  if (!stockQuantity) errors.push("Stock quantity is required.");
  if (images.length === 0) errors.push("Please insert atleast 1 image");
  if (!productName) errors.push("productName is required.");
  if (!description) errors.push("description is required.");
  if (!category) errors.push("category is required.");

  if (errors.length > 0) {
    throw { code: "VALIDATION_ERROR", message: errors };
  } else {
    const productRepeated = await productModel.findOne({ productName });

    if (productRepeated) {
      throw "Product already exists in database";
    }

    const newProduct = await productModel.create({
      productName,
      description,
      color,
      discountPercentage,
      category,
      rating,
      reviews,
      thumbnail,
      images,
      stockQuantity,
    });

    res.json({
      status: "Success",
      message: "Product created successfully",
      data: newProduct,
    });
  }
};

//====>>>> get all the products <<<<====//
module.exports.getProducts = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;
  const skip = (page - 1) * limit;

  const foundProducts = await productModel.find().skip(skip).limit(limit);

  if (!foundProducts) throw "No products in database";
  res.json({
    status: "Success",
    message: "Products fetched successfully",
    data: foundProducts,
  });
};

//====>>>> get a single product with some id <<<<====//
module.exports.getProduct = async (req, res) => {
  const { id } = req.params;
  validateMongooseId(id);
  const foundProduct = await productModel.findById(id);
  if (!foundProduct) throw "Product not found.";

  res.json({
    status: "Success",
    message: "Product fetched successfully.",
    data: foundProduct,
  });
};

//====>>>> get a single product with some id and Update that <<<<====//
module.exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const productData = req.body;
  const images = req.files.map((file) => {
    return `http://localhost:5000/${file.path}`;
  });
  validateMongooseId(id);

  const updatedProduct = await productModel.findByIdAndUpdate(id, {
    ...productData,
    images,
  });
  if (!updatedProduct) {
    throw "Failed to update product.";
  }

  res.json({
    status: "Success",
    message: "Product updated successfully",
    data: updatedProduct,
  });
};

//====>>>> get a single product with some id and delete that <<<<====//
module.exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  validateMongooseId(id);

  const deletedProduct = await productModel.findByIdAndDelete(id);

  if (!deletedProduct) throw "Failed to delete product";

  res.json({
    status: "Success",
    message: "Product deleted Successfully",
    data: null,
  });
};
