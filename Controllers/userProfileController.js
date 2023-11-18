const userModel = require("../models/users");
const hashPassword = require("../services/hash_password");

//====>>>> Get all users <<<<====//
module.exports.getAllUsers = async (req, res) => {
  const users = await userModel.find();
  res.json({
    status: "Success",
    message: "Got all users",
    data: users,
  });
};

//====>>>> Get a user <<<<====//
module.exports.getUser = async (req, res) => {
  const { user } = req.body;

  if (!user) {
    throw "User doesn't exists.";
  } else {
    res.json({
      status: "Success",
      message: "Got a user successfully",
      data: user,
    });
  }
};

//====>>>> Delete a user <<<<====//
module.exports.deleteUser = async (req, res) => {
  const { user } = req.body;

  const deletedUser = await userModel.findByIdAndDelete(user._id);
  if (!deletedUser) {
    throw "User doesn't exists.";
  } else {
    res.json({
      status: "Success",
      message: "Deleted user Successfully.",
      data: deletedUser,
    });
  }
};

//====>>>> Update a user <<<<====//
module.exports.updateUser = async (req, res) => {
  const { user } = req.body;

  const updatedUser = await userModel.findByIdAndUpdate(user._id, {
    firstName: req?.body?.firstName,
    lastName: req?.body?.lastName,
    email: req?.body?.email,
  });

  if (!updatedUser) {
    throw "User doesn't exists.";
  } else {
    res.json({
      status: "Success",
      message: "Updated user Successfully.",
      data: updatedUser,
    });
  }
};

//====>>>> Change a user's password <<<<====//
module.exports.changePassword = async (req, res) => {
  const { user, oldPassword, newPassword } = req.body;

  const userData = await userModel.findById(user._id);
  if (!userData) throw "User does not exist";

  if (userData.isVerified != true) throw "This user is not verified";
  const isCorrectPassword = await hashPassword.comparePassword(
    oldPassword,
    userData.password
  );

  if (!isCorrectPassword) throw "Old password is incorrect";

  const newHashedPassword = await hashPassword.hashPasswordGenerator(
    newPassword
  );

  const updatedPassword = await userModel.findByIdAndUpdate(user._id, {
    password: newHashedPassword,
  });

  res.json({
    status: "Success",
    message: "Password changed successfully",
    data: null,
  });
};
