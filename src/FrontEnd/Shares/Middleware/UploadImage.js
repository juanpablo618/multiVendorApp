const Multer = require("multer");
const uuid = require("uuid/v1");
const MIME_TYPE = {
  "image/png": "png",
  "image/jpg": "jpg",
  "image/jpeg": "jpeg"
};
const fileUpload = Multer({
  limits: 500000,
  storage: Multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "src/Upload/Images");
    },
    filename: (req, file, cb) => {
      const extension = MIME_TYPE[file.mimetype];
      cb(null, uuid() + "." + extension);
    }
  }),
  fileFilter: (req, file, cb) => {
    const isValid = !!MIME_TYPE[file.mimetype];
    const error = isValid ? null : new Error("Invalid Image Type");
    cb(error, isValid);
  }
});
module.exports = fileUpload;
