const cartModel = require("../models/Carts");
const productModel = require("../models/products");

//====>>>> Add a product to cart <<<<====//
module.exports.addCart = async (req, res) => {
  const { user, id, quanity } = req.body;

  if (!user) {
    throw "User not logged in";
  }

  const foundProduct = await productModel.findById(id);

  if (!foundProduct) {
    throw `No product in database with id: ${productId}`;
  }
  const cartItem = {
    productId: foundProduct._id,
    quantity: quanity || 1,
  };

  const cartProduct = await cartModel.create({
    userId: user._id,
    items: [cartItem],
  });

  if (!cartProduct) {
    throw "failed to add product to cart";
  }

  res.json({
    status: "Success",
    message: "Product added to cart successfully",
    data: cartProduct,
  });
};

//====>>>> get all the products from cart <<<<====//
module.exports.getCarts = async (req, res) => {
  const { user } = req.body;

  if (!user) {
    throw "User not logged in";
  }

  const userCart = await cartModel
    .findOne({ userId: user._id })
    .populate("items.productId");
  if (!userCart) throw "Cart is empty";

  const productsInCart = userCart.items.map((item) => ({
    product: item.productId,
    quantity: item.quantity,
  }));

  res.json({
    status: "Success",
    message: "Fetched all products in cart",
    data: productsInCart,
  });
};
