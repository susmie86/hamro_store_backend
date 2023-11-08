const router = require("express").Router();
const Controller = require("../Controllers/ProductController");
const errorHandler = require("../middleware/error_handler.js");
const tokenValidator = require("../middleware/token_validator.js");
const { imagesUpload } = require("../middleware/images_uploader");
const { thumbnailUpload } = require("../middleware/file_uploader");

// Product Creation : Only By admin
router.post(
  "/",
  errorHandler(tokenValidator.accessTokenValidator),
  errorHandler(tokenValidator.adminValidator),
  thumbnailUpload.single("thumbnail"),
  imagesUpload.array("images", 5),
  errorHandler(Controller.createProduct)
);

// Product Update route : Only by admin
router.put(
  "/:id",
  errorHandler(tokenValidator.accessTokenValidator),
  errorHandler(tokenValidator.adminValidator),
  imagesUpload.array("images", 4),
  errorHandler(Controller.updateProduct)
);

// Product Delete route : Only by admin
router.delete(
  "/:id",
  errorHandler(tokenValidator.accessTokenValidator),
  errorHandler(tokenValidator.adminValidator),
  errorHandler(Controller.deleteProduct)
);

//====>>>> Get Product routes <<<<====//
router.get("/:id", errorHandler(Controller.getProduct));
router.get("/", errorHandler(Controller.getProducts));

module.exports = router;
