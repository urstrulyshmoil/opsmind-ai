const { GoogleGenAI } = require('@google/genai');
const Document = require('../models/Document');
const mongoose = require('mongoose');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Convert question to vector
const getEmbedding = async (text) => {
  const response = await ai.models.embedContent({
    model: 'gemini-embedding-001',
    contents: text,
  });
  return response.embeddings[0].values;
};

exports.searchChunks = async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) return res.status(400).json({ error: 'Query is required' });

    console.log(`🔍 Searching for: "${query}"`);

    // Convert question to vector
    const queryEmbedding = await getEmbedding(query);

    // Search MongoDB for similar chunks
    const results = await Document.aggregate([
      {
        $vectorSearch: {
          index: 'vector_index',
          path: 'chunks.embedding',
          queryVector: queryEmbedding,
          numCandidates: 10,
          limit: 3,
        },
      },
      {
        $project: {
          originalName: 1,
          chunks: 1,
          score: { $meta: 'vectorSearchScore' },
        },
      },
    ]);

    console.log(`✅ Found ${results.length} relevant documents`);

    res.json({
      query,
      results: results.map(doc => ({
        filename: doc.originalName,
        score: doc.score,
        chunks: doc.chunks.map(c => c.text),
      })),
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};