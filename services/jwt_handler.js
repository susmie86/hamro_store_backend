const jwt = require(`jsonwebtoken`);

module.exports.createNewAccessToken = (userEmail) => {
    const accessToken = jwt.sign(
        {"email": userEmail},
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn: "1000s"}
        );

    return accessToken;
}

module.exports.createNewRefreshToken = (userEmail) => {
    const refreshToken = jwt.sign(
        {"email": userEmail},
        process.env.REFRESH_TOKEN_SECRET,
        {expiresIn: "600s"}
        );

    return refreshToken;
}