const Document = require('../models/documentModel');

// @desc    Upload a document
// @route   POST /api/documents
// @access  Private
const uploadDocument = async (req, res) => {
  const { documentType } = req.body;
  
  if (req.file) {
    const document = new Document({
      user: req.user._id,
      documentType,
      fileName: req.file.filename,
      filePath: `/${req.file.path}`,
    });

    const createdDocument = await document.save();
    res.status(201).json(createdDocument);
  } else {
    res.status(400).json({ message: 'Please upload a file' });
  }
};

// @desc    Get documents for logged in user
// @route   GET /api/documents
// @access  Private
const getDocumentsForUser = async (req, res) => {
  const documents = await Document.find({ user: req.user._id });
  res.json(documents);
};

module.exports = { uploadDocument, getDocumentsForUser };