// utils/multerUpload.js
import multer from 'multer';
import path from 'path';

const storage = multer.memoryStorage();

// File filter
const fileFilter = function (req, file, cb) {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only images are allowed'));
  }
};

// Upload instance (limit set to 2MB)
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 2 MB
  fileFilter,
});

export default upload;
