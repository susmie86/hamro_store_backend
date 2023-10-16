const multer = require("multer");
const path = require("path");

const imagesStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join("./images"));
  },
  filename: (req, file, cb) => {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

module.exports.imagesUpload = multer({ storage: imagesStorage });
