const cartModel = require("../models/Carts");
const productModel = require("../models/products");

//====>>>> Add a product to cart <<<<====//
module.exports.addCart = async (req, res) => {
  const { user, id, quantity } = req.body;

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

  const existingCart = await cartModel.findOne({ userId: user._id });

  // To add new Products in cart
  if (!existingCart) {
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
  }

  // Check if there is already a product in cart of that user
  const existingCartItem = existingCart.items.find((item) =>
    item.productId.equals(id)
  );

  // update the cart quantity if product already exists
  if (existingCartItem) {
    existingCartItem.quantity += 1;
    await existingCart.save();
  } else {
    // If the product is not in the cart, add it
    existingCart.items.push(cartItem);
    await existingCart.save();
  }

  // Response after update if the cart product already exists
  return res.json({
    status: "Success",
    message: "Product added to cart successfully",
    data: existingCart,
  });
};

//====>>>> Add all the products of wishlist to cart <<<<====//
module.exports.addAllToCart = async (req, res) => {
  const { productIds, user } = req.body;

  if (!user) {
    throw "User not logged in";
  }

  const userCart = await cartModel.findOne({ userId: user._id });

  productIds.map(async (id) => {
    const foundProduct = await productModel.findById(id);

    // TODO: Check if the product is in the product list and add it to cart
    console.log(`found products: `, foundProduct);
  });

  console.log("User cart: ", userCart);
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
