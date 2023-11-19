const router = require("express").Router();
const Controller = require("../Controllers/UserProfileController");
const errorHandler = require("../middleware/error_handler");
const tokenValidator = require("../middleware/token_validator");

router.get(
  "/getAllUsers",
  errorHandler(tokenValidator.accessTokenValidator),
  errorHandler(tokenValidator.adminValidator),
  errorHandler(Controller.getAllUsers)
);

router.get(
  "/",
  errorHandler(tokenValidator.accessTokenValidator),
  errorHandler(Controller.getUser)
);

router.delete(
  "/",
  errorHandler(tokenValidator.accessTokenValidator),
  errorHandler(Controller.deleteUser)
);

router.put(
  "/",
  errorHandler(tokenValidator.accessTokenValidator),
  errorHandler(Controller.updateUser)
);
router.patch(
  "/",
  errorHandler(tokenValidator.accessTokenValidator),
  errorHandler(Controller.updateUser)
);

module.exports = router;
