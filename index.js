// -------------------------------- Packages -------------------------------- //
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const path = require("path");
const cors = require("cors");

// -------------------------------- Routes -------------------------------- //
const authRoute = require("./routes/AuthRoutes.js");
const productRouter = require("./routes/ProductRoutes.js");
const wishlistRouter = require("./routes/Wishlist.js");
const cartRouter = require("./routes/CartRoutes.js");
const profileRouter = require("./routes/ProfileRoutes.js");

// -------------------------------- Variables -------------------------------- //
const app = express();
const port = process.env.PORT || 3000;
const connectionString = process.env.CONNECTION_STRING;

// -------------------------------- Middlewares and Cors -------------------------------- //
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/thumbnails", express.static(path.join(__dirname, "thumbnails")));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(morgan("dev"));

// -------------------------------- Using Routes -------------------------------- //
app.use("/api/auth", authRoute);
app.use("/api/carts", cartRouter);
app.use("/api/products", productRouter);
app.use("/api/wishlists", wishlistRouter);
app.use("/api/profile", profileRouter);

// -------------------------------- DB Connection -------------------------------- //
main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(connectionString, {
    dbName: "hamro_store_db",
  });
  console.log("Database is connected successfully.");
}

// -------------------------------- Server Starting -------------------------------- //
app.listen(port, () => {
  console.log(`Server is running in port: ${port}`);
});
