const mongoose = require("mongoose");

const wishlistItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Products",
  },
});

const wishlistSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  items: [wishlistItemSchema],
});

module.exports = mongoose.model("wishlist", wishlistSchema);
