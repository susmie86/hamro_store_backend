const jwt = require(`jsonwebtoken`);

// Creates a new access token for a user.
module.exports.createNewAccessToken = (userEmail) => {
    const accessToken = jwt.sign(
        {"email": userEmail},
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn: "2d"}
        );

    return accessToken;
}

// Creates a new refresh token for a user.
module.exports.createNewRefreshToken = (userEmail) => {
    const refreshToken = jwt.sign(
        {"email": userEmail},
        process.env.REFRESH_TOKEN_SECRET,
        {expiresIn: "4d"}
        );

    return refreshToken;
}

// Verify the access token and return the email address
module.exports.validateAccessToken = (accessToken) => {
    try {
        const jwtVerification = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
        return jwtVerification.email;
    } catch (err) {
        
        // Checks if the access token is valid
        if(err.message == "jwt malformed" || err.message == "invalid token") {
            throw 'Please provide a valid access token.'
        } else if (err.message == "jwt expired") {
            throw 'The token is expired.'
        }
    }
}

// Verify the refresh token.
module.exports.validateRefreshToken = (refreshToken) => {
    try {
        const jwtVerification = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        return jwtVerification.email;
    } catch (err) {
        
        // Verify that the refresh token is valid.
        if(err.message == "jwt malformed") {
            throw 'Please provide a valid refresh token.'
        } else if (err.message == "jwt expired") {
            throw 'The refresh token is expired.'
        }
    }
}