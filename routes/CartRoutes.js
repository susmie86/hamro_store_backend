const router = require("express").Router();
const errorHandler = require("../middleware/error_handler");
const {
  accessTokenValidator,
  userValidator,
} = require("../middleware/token_validator");
const Controller = require("../Controllers/CartController");

router.post(
  "/",
  errorHandler(accessTokenValidator),
  errorHandler(userValidator),
  errorHandler(Controller.addCart)
);

router.post(
  "/addAll",
  errorHandler(accessTokenValidator),
  errorHandler(userValidator),
  errorHandler(Controller.addAllToCart)
);

router.get(
  "/",
  errorHandler(accessTokenValidator),
  errorHandler(userValidator),
  errorHandler(Controller.getCarts)
);

router.delete(
  "/:id",
  errorHandler(accessTokenValidator),
  errorHandler(userValidator),
  errorHandler(Controller.deleteCart)
);

module.exports = router;
