const mongoose = require('mongoose');

const chunkSchema = new mongoose.Schema({
  text: String,
  embedding: [Number],
  pageNumber: Number,
  chunkIndex: Number,
});

const documentSchema = new mongoose.Schema({
  filename: String,
  originalName: String,
  uploadedAt: { type: Date, default: Date.now },
  chunks: [chunkSchema],
  totalChunks: Number,
});

module.exports = mongoose.model('Document', documentSchema);