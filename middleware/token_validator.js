const jwtHandler = require(`../services/jwt_handler.js`);
const userModel = require("../models/users.js");

//====>>>> Validates the access token and return user email as request body <<<<====//
module.exports.accessTokenValidator = async (req, res, next) => {
  // Gets the access token from the Authorization header.
  const bearerToken = req.headers["authorization"];
  if (
    bearerToken == undefined ||
    bearerToken == "" ||
    bearerToken.trim() == ""
  ) {
    throw "Access token is required.";
  }
  const accessToken = bearerToken.split(" ")[1];

  // Validates an access token.
  const userEmail = await jwtHandler.validateAccessToken(accessToken);

  const user = await userModel.findOne({ email: userEmail });

  // Sets the email address of the user.
  req.body.user = user;
  next();
};

//====>>>> Validates the access token and return user email as request body <<<<====//
module.exports.refreshTokenValidator = async (req, res, next) => {
  // Get refresh token from authorization header.
  const bearerToken = req.headers["authorization"];
  if (
    bearerToken == undefined ||
    bearerToken == "" ||
    bearerToken.trim() == ""
  ) {
    throw "Refresh token is required.";
  }
  const refreshToken = bearerToken.split(" ")[1];

  const userEmail = await jwtHandler.validateRefreshToken(refreshToken);
  req.body.email = userEmail;
  next();
};

//====>>>> Validates the If it is admin and return user email as request body <<<<====//
module.exports.adminValidator = async (req, res, next) => {
  const { user } = req.body;
  const foundUser = await userModel.findById(user._id);

  if (foundUser.roles !== "admin") {
    throw "You are not a admin.";
  } else {
    next();
  }
};
