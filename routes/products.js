const express = require("express");
const router = express.Router();
const Controller = require("../Controllers/ProductController");
const errorHandler = require("../middleware/error_handler");

router.post("/createProduct", errorHandler(Controller.createProduct));
router.get("/", errorHandler(Controller.getProductsByPage));
router.get("/:id", errorHandler(Controller.getProduct));

module.exports = router;
