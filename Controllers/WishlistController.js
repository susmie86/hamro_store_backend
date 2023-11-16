const wishlistModel = require("../models/wishlist");
const productModel = require("../models/products");
const { validateMongooseId } = require("../services/validate_mogoose_id");

//====>>>> Add a product to wishlist <<<<====//
module.exports.addWishlist = async (req, res) => {
  const { user, productId } = req.body;

  validateMongooseId(productId);

  const existingWishlist = await wishlistModel.findOne({ userId: user._id });
  const wishlistItem = {
    productId,
  };

  if (existingWishlist) {
    const doubleWishlistItem = existingWishlist.items.find(
      (item) => String(item.productId) === String(productId)
    );
    if (!doubleWishlistItem) {
      existingWishlist.items.push(wishlistItem);
      await existingWishlist.save();
    }
    res.json({
      status: "Success",
      message: "Product added to wishlist successfully",
      data: existingWishlist,
    });
  } else {
    // If there's no existing wishlist, create a new one
    const wishlistProduct = await wishlistModel.create({
      userId: user._id,
      items: [wishlistItem],
    });

    if (!wishlistProduct) throw "Failed to add product to wishlist";

    res.json({
      status: "Success",
      message: "Product added to wishlist successfully",
      data: wishlistProduct,
    });
  }
};

//====>>>> get all the products from Wishlist <<<<====//
module.exports.getWishlists = async (req, res) => {
  const { user } = req.body;

  // FInd the user wishlist and populate all the products
  const userWishlist = await wishlistModel
    .findOne({ userId: user._id })
    .populate("items.productId");
  if (!userWishlist) throw "Wishlist is empty";

  // map through each product in user wishlist and return all the products
  const productsInWishlist = userWishlist.items.map((item) => ({
    product: item.productId,
  }));

  res.json({
    status: "Success",
    message: "Fetched all products from Wishlist",
    data: productsInWishlist,
  });
};

//====>>>> Remove the products from wishlist <<<<====//
module.exports.deleteWishlist = async (req, res) => {
  const { id } = req.params;
  const { user } = req.body;

  validateMongooseId(id);

  // check if user has a wishlist
  const userWishlist = await wishlistModel.findOne({ userId: user._id });
  if (!userWishlist) throw "user wishlist is empty";

  // Check if there is a product with that productId
  const productsInWishlist = await wishlistModel.findOne({
    userId: user._id,
    "items.productId": id,
  });
  if (!productsInWishlist) throw "this product is not in wishlist";

  // Remove the product from wishlist and return the rest of the products
  const updatedWishlist = await wishlistModel.findOneAndUpdate(
    { userId: user._id },
    { $pull: { items: { productId: id } } },
    { new: true }
  );
  if (!updatedWishlist) throw "wishlist not found";

  res.json({
    status: "Success",
    message: "product removed from Wishlist successfully",
    data: null,
  });
};
