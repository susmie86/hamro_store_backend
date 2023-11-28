const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  street: String,
  zipcode: String,
  city: String,
  province: String,
});

module.exports = mongoose.model("Address", addressSchema);
