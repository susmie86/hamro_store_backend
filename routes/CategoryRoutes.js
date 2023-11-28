const router = require("express").Router();
const errorHandler = require("../middleware/error_handler");
const tokenValidator = require("../middleware/token_validator");
const Controller = require("../Controllers/CategoryController");
const { iconUpload } = require("../middleware/file_uploader");

router.post(
  "/",
  errorHandler(tokenValidator.accessTokenValidator),
  errorHandler(tokenValidator.adminValidator),
  iconUpload.single("icon"),
  errorHandler(Controller.addCategory)
);
router.patch(
  "/:id",
  errorHandler(tokenValidator.accessTokenValidator),
  errorHandler(tokenValidator.adminValidator),
  iconUpload.single("icon"),
  errorHandler(Controller.updateCategory)
);
router.get(
  "/",
  errorHandler(tokenValidator.accessTokenValidator),
  errorHandler(Controller.getCategories)
);
router.delete(
  "/:id",
  errorHandler(tokenValidator.accessTokenValidator),
  errorHandler(tokenValidator.adminValidator),
  errorHandler(Controller.deleteCategory)
);

module.exports = router;