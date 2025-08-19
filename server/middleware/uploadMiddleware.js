const multer = require('multer');
const path = require('path');

// Set storage engine
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: function (req, file, cb) {
    // This function runs after the 'protect' middleware, so req.user is available
    cb(null, `${file.fieldname}-${req.user._id}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

// Check file type to allow only certain formats
function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|pdf/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: You can only upload PDF, PNG, and JPG files!');
  }
}

// Initialize the upload variable with multer configuration
const upload = multer({
  storage: storage,
  limits: { fileSize: 5000000 }, // Limit file size to 5MB
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

module.exports = upload; // This line is crucial