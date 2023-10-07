const userModel = require("../models/users");
const jwt = require("jsonwebtoken");

module.exports.authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            throw new Error("No token attached.");
        }
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        console.log(decoded)
        const user = await userModel.findById(decoded._id);

        if (!user) {
            throw new Error("User not found.");
        }

        req.user = user;
        next();
    } catch (err) {
        if (err.name === "TokenExpiredError") {
            return res.status(401).json({ error: "Token expired." });
        }
        return res.status(401).json({ error: "Authentication failed." });
    }
};


module.exports.isAdmin = async (req, res, next) => {
    console.log(req.user);
}