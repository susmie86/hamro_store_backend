const router = require('express').Router();
const Controller = require("../Controllers/AuthController");
const errorHandler = require('../middleware/error_handler.js');
const tokenValidator = require('../middleware/token_validator.js');
const authMiddle = require("../middleware/auth_middleware")

router.post('/signup', errorHandler(Controller.signUpUser));
router.post('/verify', errorHandler(Controller.verifyEmail));
router.post('/signin', errorHandler(Controller.signIn));
router.get('/getAllUsers', errorHandler(authMiddle.authMiddleware), errorHandler(Controller.getAllUsers));
router.get('/getUser/:id', errorHandler(authMiddle.authMiddleware), authMiddle.isAdmin, errorHandler(Controller.getUser));
router.delete('/delete/:id', errorHandler(Controller.deleteUser))
router.put('/update/:id', errorHandler(Controller.updateUser))

// Generates a new access token.
router.post('/generateToken', errorHandler(tokenValidator.refreshTokenValidator), errorHandler(Controller.accessTokenGenerator));

module.exports = router;