const express = require('express');
const router = express.Router();
const { uploadDocument, getDocumentsForUser } = require('../controllers/documentController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.route('/')
    .get(protect, getDocumentsForUser)
    .post(protect, upload.single('document'), uploadDocument);

module.exports = router;