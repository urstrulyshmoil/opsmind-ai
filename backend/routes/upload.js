const authMiddleware = require('../middleware/auth');
const { chat } = require('../controllers/chatController');
const { searchChunks } = require('../controllers/searchController');
const { embedDocument } = require('../controllers/embeddingController');
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { uploadPDF, getDocuments } = require('../controllers/uploadController');

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') cb(null, true);
    else cb(new Error('Only PDF files allowed!'));
  },
});

router.post('/upload', upload.single('pdf'), uploadPDF);
router.get('/documents', getDocuments);

router.post('/embed/:documentId', embedDocument);
router.post('/search', searchChunks);
router.post('/chat', chat);

router.get('/admin/stats', authMiddleware, async (req, res) => {
  try {
    const Document = require('../models/Document');
    const User = require('../models/User');
    const totalDocs = await Document.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalChunks = await Document.aggregate([
      { $group: { _id: null, total: { $sum: '$totalChunks' } } }
    ]);
    const recentDocs = await Document.find()
      .sort({ uploadedAt: -1 })
      .limit(5)
      .select('originalName totalChunks uploadedAt');
    res.json({
      totalDocs,
      totalUsers,
      totalChunks: totalChunks[0]?.total || 0,
      recentDocs,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/admin/document/:id', authMiddleware, async (req, res) => {
  try {
    const Document = require('../models/Document');
    await Document.findByIdAndDelete(req.params.id);
    res.json({ message: '✅ Document deleted successfully!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/admin/documents', authMiddleware, async (req, res) => {
  try {
    const Document = require('../models/Document');
    const docs = await Document.find()
      .sort({ uploadedAt: -1 })
      .select('originalName totalChunks uploadedAt');
    res.json(docs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;