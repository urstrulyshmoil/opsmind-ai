const pdfParse = require('pdf-parse');
const fs = require('fs');
const Document = require('../models/Document');

// Split text into chunks of 1000 chars with 100 overlap
const chunkText = (text, chunkSize = 1000, overlap = 100) => {
  const chunks = [];
  let start = 0;
  while (start < text.length) {
    const end = start + chunkSize;
    chunks.push({
      text: text.slice(start, end),
      chunkIndex: chunks.length,
    });
    start = end - overlap;
  }
  return chunks;
};

exports.uploadPDF = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Read and parse the PDF
    const dataBuffer = fs.readFileSync(req.file.path);
    const pdfData = await pdfParse(dataBuffer, { version: 'default' });
    const rawText = pdfData.text;

    // Chunk the text
    const chunks = chunkText(rawText);

    // Save to MongoDB
    const doc = new Document({
      filename: req.file.filename,
      originalName: req.file.originalname,
      totalChunks: chunks.length,
      chunks: chunks,
    });

    await doc.save();

    // Delete the temp file
    fs.unlinkSync(req.file.path);

    res.json({
      message: '✅ PDF uploaded and processed!',
      documentId: doc._id,
      totalChunks: chunks.length,
      filename: req.file.originalname,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.getDocuments = async (req, res) => {
  try {
    const docs = await Document.find({}, 'originalName uploadedAt totalChunks');
    res.json(docs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};