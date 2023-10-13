const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  color: {type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  images: [{ type: mongoose.Schema.Types.ObjectId, ref: "Image" }],
  stockQuantity: { type: Number, required: true },
});

module.exports = mongoose.model("Product", productSchema);
