require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const authRoute = require("./routes/AuthRoutes.js");
const productRouter = require("./routes/ProductRoutes.js");
const cartRouter = require("./routes/CartRoutes.js");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const path = require("path");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000;


app.use("/images", express.static(path.join(__dirname, "images")));

// Using middlewares
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
app.use("/thumbnails", express.static(path.join(__dirname, "thumbnails")));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(morgan("dev"));

// Custom Middleware
app.use("/api/carts", cartRouter);
app.use("/api/products", productRouter);
app.use("/api/auth/", authRoute);

// Link variables

const connectionString = process.env.CONNECTION_STRING;

// Connecting to mongoose database
main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(connectionString, {
    dbName: "hamro_store_db",
  });
  console.log("Database is connected successfully.");
}

app.listen(port, () => {
  console.log(`Server is running in port: ${port}`);
});
