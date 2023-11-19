const router = require("express").Router();
const errorHandler = require("../middleware/error_handler");
const {
  accessTokenValidator,
  userValidator,
} = require("../middleware/token_validator");
const Controller = require("../Controllers/WishlistController");

router.post(
  "/",
  errorHandler(accessTokenValidator),
  errorHandler(userValidator),
  errorHandler(Controller.addWishlist)
);

router.get(
  "/",
  errorHandler(accessTokenValidator),
  errorHandler(userValidator),
  errorHandler(Controller.getWishlists)
);

router.delete(
  "/:id",
  errorHandler(accessTokenValidator),
  errorHandler(userValidator),
  errorHandler(Controller.deleteWishlist)
);

module.exports = router;
