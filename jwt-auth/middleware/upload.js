import multer from "multer";
import path from "path";
import fs from "fs";

const dir = path.join("uploads");
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}
// Storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // save to /uploads
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // e.g., 3891723.jpg
  },
});

// File filter (optional)
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPG/PNG files allowed"), false);
  }
};

const upload = multer({ storage, fileFilter });

export default upload;
