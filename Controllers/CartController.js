const cartModel = require("../models/Carts");
const productModel = require("../models/products");
const { validateMongooseId } = require("../services/validate_mogoose_id");

//====>>>> Add a product to cart <<<<====//
module.exports.addCart = async (req, res) => {
  const { user, id, quantity } = req.body;
  validateMongooseId(id);
  if (!user) {
    throw "User not logged in";
  }

  const foundProduct = await productModel.findById(id);

  if (!foundProduct) {
    throw `No product in database with id: ${id}`;
  }
  const cartItem = {
    productId: foundProduct._id,
    quantity: quantity || 1,
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

    if (!foundProduct) throw `Product with id: ${id} not found`;

    const existingCartItems = userCart.items.find(
      (item) => String(item.productId) === String(id)
    );

    if (existingCartItems) {
      existingCartItems.quantity += 1;
    } else {
      userCart.items.push({ productId: id, quantity: 1 });
    }
  });
  await userCart.save();

  res.json({
    status: "Success",
    message: "All products added to cart successfully",
    data: userCart,
  });
};

//====>>>> Update all the products of cart <<<<====//
module.exports.updateCart = async (req, res) => {
  const { user, updatedItems } = req.body;

  // Check if the user has a cart
  const userCart = await cartModel.findOne({ userId: user._id });
  if (!userCart) throw "User cart is empty";

  // Loop through all the updated product and change the quantity
  updatedItems.map(({ productId, quantity }) => {
    const existingCartItem = userCart.items.find(
      (item) => String(item.productId) === String(productId)
    );

    if (existingCartItem) existingCartItem.quantity = quantity;
  });

  await userCart.save();

  res.json({
    status: "Success",
    message: "Cart updated successfully",
    data: userCart,
  });
};

//====>>>> get all the products from cart <<<<====//
module.exports.getCarts = async (req, res) => {
  const { user } = req.body;

  // FInd the user cart and populate all the products
  const userCart = await cartModel
    .findOne({ userId: user._id })
    .populate("items.productId");
  if (!userCart) throw "Cart is empty";

  // map through each product in user cart and return all the products
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

//====>>>> Remove the products from cart <<<<====//
module.exports.deleteCart = async (req, res) => {
  const { id } = req.params;
  const { user } = req.body;

  validateMongooseId(id);

  // check if user has a cart 
  const userCart = await cartModel.findOne({ userId: user._id });
  if (!userCart) throw "user cart is empty";

  // Check if there is a product with that productId
  const productsInCart = await cartModel.findOne({
    userId: user._id,
    "items.productId": id,
  });
  if (!productsInCart) throw "this product is not in cart";

  // Remove the product from cart and return the rest of the products
  const updatedCart = await cartModel.findOneAndUpdate(
    { userId: user._id },
    { $pull: { items: { productId: id } } },
    { new: true }
  );
  if (!updatedCart) throw "Cart not found";

  res.json({
    status: "Success",
    message: "product removed from cart successfully",
    data: null,
  });
};
