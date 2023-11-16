const router = require("express").Router();
const Controller = require("../Controllers/AuthController");
const errorHandler = require("../middleware/error_handler.js");
const tokenValidator = require("../middleware/token_validator.js");

router.post("/signup", errorHandler(Controller.signUpUser));
router.post("/verify", errorHandler(Controller.verifyEmail));
router.post("/resendOtp", errorHandler(Controller.resendOtpCode));
router.post("/signin", errorHandler(Controller.signIn));
router.get(
  "/getAllUsers",
  errorHandler(tokenValidator.accessTokenValidator),
  errorHandler(tokenValidator.adminValidator),
  errorHandler(Controller.getAllUsers)
);
router.get(
  "/getUser",
  errorHandler(tokenValidator.accessTokenValidator),
  errorHandler(Controller.getUser)
);
router.delete("/delete/", errorHandler(Controller.deleteUser));
router.put(
  "/update/",
  errorHandler(tokenValidator.accessTokenValidator),
  errorHandler(Controller.updateUser)
);

//====>>>> Only For Admin route <<<<====//
// TODO: Might add token validation in log out and left to figure out where to store refresh tokens
// Generates a new access token.
router.get(
  "/generateToken",
  errorHandler(tokenValidator.refreshTokenValidator),
  errorHandler(Controller.accessTokenGenerator)
);
router.get("/logout",errorHandler(Controller.logoutHandler));
module.exports = router;

//================================>>>>>>>> Finished Auth Api for now <<<<<<<<<<<<<<<<===========================================//
//================================>>>>>>>> Finished Auth Api for now <<<<<<<<<<<<<<<<===========================================//
//================================>>>>>>>> Finished Auth Api for now <<<<<<<<<<<<<<<<===========================================//
//================================>>>>>>>> Finished Auth Api for now <<<<<<<<<<<<<<<<===========================================//
//================================>>>>>>>> Finished Auth Api for now <<<<<<<<<<<<<<<<===========================================//
