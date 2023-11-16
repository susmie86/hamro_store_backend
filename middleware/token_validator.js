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

  if (!user) throw `User not found with email: ${userEmail}`;
  // Sets the email address of the user.
  req.body.user = user;
  next();
};

//====>>>> Validates the access token and return user email as request body <<<<====//
module.exports.refreshTokenValidator = async (req, res, next) => {
  // Get refresh token from authorization header.

  const { refreshToken } = req.cookies;

  if (!req.cookies?.refreshToken) {
    throw "No refresh token in cookies.";
  }

  const foundUser = await userModel.findOne({ refreshToken });

  if (!foundUser) throw "User not found with given Refresh Token.";

  jwtHandler.validateRefreshToken(refreshToken);

  const userEmail = await jwtHandler.validateRefreshToken(refreshToken);

  if (foundUser.email !== userEmail) throw "Refresh token not matched.";
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

/* ====>>>> 
Validates the If it is user and return user email as request body so that We can check if it 
is normal user or not while performing some actions
<<<<==== */
module.exports.userValidator = async (req, res, next) => {
  const { user } = req.body;
  const foundUser = await userModel.findById(user._id);

  if (foundUser.roles !== "user") {
    throw "You are not a user.";
  } else {
    next();
  }
};
