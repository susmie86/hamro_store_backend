const router = require("express").Router();
const Controller = require("../Controllers/AuthController");
const errorHandler = require("../middleware/error_handler.js");
const tokenValidator = require("../middleware/token_validator.js");
// const jwtHandler = require("../middleware/token_validator")

router.post("/signup", errorHandler(Controller.signUpUser));
router.post("/verify", errorHandler(Controller.verifyEmail));
router.post("/signin", errorHandler(Controller.signIn));
router.get("/getAllUsers", errorHandler(Controller.getAllUsers));
router.get(
  "/getUser",
  errorHandler(tokenValidator.accessTokenValidator),
  errorHandler(Controller.getUser)
);
router.delete("/delete/:id", errorHandler(Controller.deleteUser));
router.put("/update/:id", errorHandler(Controller.updateUser));

// Generates a new access token.
router.post(
  "/generateToken",
  errorHandler(tokenValidator.refreshTokenValidator),
  errorHandler(Controller.accessTokenGenerator)
);

module.exports = router;
