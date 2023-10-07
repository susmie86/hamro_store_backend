const mongoose = require("mongoose");

//====>>>> Check if the provided id is valid mongoose id or not <<<<====//
module.exports.validateMongooseId = (id) => {
  const isValid = mongoose.Types.ObjectId.isValid(id);

  if (!isValid) {
    throw "This ID is not valid or found.";
  }
};
