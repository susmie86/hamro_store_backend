require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const authRoute = require("./routes/AuthRoutes.js");
const productRouter = require("./routes/products");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");

const app = express();

// Using middlewares
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(morgan("dev"))

// Custom Middleware
app.use("/api/product", productRouter);
app.use("/api/auth/", authRoute);

// Link variables
const port = process.env.PORT || 3000;
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
