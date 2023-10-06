const router = require('express').Router();
const Controller = require("../Controllers/AuthController");
const errorHandler = require('../middleware/error_handler.js');

router.post('/signup', errorHandler(Controller.signUpUser));
router.post('/verify', errorHandler(Controller.verifyEmail));
router.post('/signin', errorHandler(Controller.signIn));

module.exports = router;