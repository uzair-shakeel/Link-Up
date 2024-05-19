import multer from "multer";
import path from "path";

// Configure storage for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "../client/public/upload/CVs");
  },
  filename: (req, file, cb) => {
    cb(null, path.basename(file.originalname)); // Use path.basename() to get only the filename
  },
});

// File type validation function
const fileFilter = (req, file, cb) => {
  const filetypes = /pdf/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: Only PDFs are allowed!");
  }
};

// Initialize multer with the storage configuration and file filter
const upload = multer({
  storage,
  fileFilter,
});

export default upload;
