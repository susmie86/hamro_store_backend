// my Multer thumbnail middleware in file_uploader.js
const multer = require("multer");
const path = require("path");

const iconStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./categoryIcons");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

module.exports.iconUpload = multer({
  storage: iconStorage,
  fileFilter: (req, file, cb) => {
    const allowedExtensions = [".jpg", ".png", ".jpeg"];
    const fileExtension = path.extname(file.originalname).toLowerCase();
    if (allowedExtensions.includes(fileExtension)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type"));
    }
  },
});
