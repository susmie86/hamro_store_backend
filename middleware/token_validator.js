const jwtHandler = require(`../services/jwt_handler.js`);

// Validates an access token.
module.exports.accessTokenValidator = async (req, res, next) => {

    // Gets the access token from the Authorization header.
    const bearerToken = req.headers['authorization'];
    if (bearerToken == undefined || bearerToken == "" || bearerToken.trim() == "") {
        throw 'Access token is required.'
    }
    const accessToken = bearerToken.split(' ')[1];

    // Validates an access token.
    const userEmail = await jwtHandler.validateAccessToken(accessToken);

    // Sets the email address of the user.
    req.body.email = userEmail;
    req.params.email = userEmail;
    next();
}

// Validates a refresh token.
module.exports.refreshTokenValidator = async (req, res, next) => {

    // Get refresh token from authorization header.
    const bearerToken = req.headers['authorization'];
    if (bearerToken == undefined || bearerToken == "" || bearerToken.trim() == "") {
        throw 'Refresh token is required.'
    }
    const refreshToken = bearerToken.split(' ')[1];

    const userEmail = await jwtHandler.validateRefreshToken(refreshToken);
    req.body.email = userEmail;
    next();
}