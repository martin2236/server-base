const multer = require('multer');
const path = require('path');
const fs = require('fs');

const tempPath = process.env.IMAGENES_DIR;
if (!fs.existsSync(tempPath)) {
  fs.mkdirSync(tempPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, tempPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const multerUpload = multer({ storage });

module.exports = multerUpload;