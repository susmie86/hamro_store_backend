const express = require("express");
const { createProduct } = require("../Controllers/ProductController");
const router = express.Router(); 

router.post("/products", createProduct);

exports.router = router;
