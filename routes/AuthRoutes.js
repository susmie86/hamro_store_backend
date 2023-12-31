const router = require("express").Router();
const Controller = require("../Controllers/AuthController");
const errorHandler = require("../middleware/error_handler.js");
const tokenValidator = require("../middleware/token_validator.js");

router.post("/signup", errorHandler(Controller.signUpUser));
router.post("/verify", errorHandler(Controller.verifyEmail));
router.post("/resendOtp", errorHandler(Controller.resendOtpCode));
router.post("/signin", errorHandler(Controller.signIn));
router.get(
  "/generateToken",
  errorHandler(tokenValidator.refreshTokenValidator),
  errorHandler(Controller.accessTokenGenerator)
);
router.delete(
  "/logout",
  errorHandler(tokenValidator.accessTokenValidator),
  errorHandler(Controller.logoutHandler)
);

module.exports = router;

//================================>>>>>>>> Finished Auth Api for now <<<<<<<<<<<<<<<<===========================================//
