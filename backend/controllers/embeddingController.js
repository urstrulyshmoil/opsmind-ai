const { GoogleGenAI } = require('@google/genai');
const Document = require('../models/Document');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Convert text to vector numbers
const getEmbedding = async (text) => {
  const response = await ai.models.embedContent({
    model: 'gemini-embedding-001',
    contents: text,
  });
  return response.embeddings[0].values;
};

exports.embedDocument = async (req, res) => {
  try {
    const { documentId } = req.params;

    const doc = await Document.findById(documentId);
    if (!doc) return res.status(404).json({ error: 'Document not found' });

    console.log(`⏳ Embedding ${doc.totalChunks} chunks...`);

    for (let i = 0; i < doc.chunks.length; i++) {
      console.log(`  Processing chunk ${i + 1}/${doc.chunks.length}`);
      const embedding = await getEmbedding(doc.chunks[i].text);
      doc.chunks[i].embedding = embedding;
      await new Promise(r => setTimeout(r, 500));
    }

    await doc.save();

    res.json({
      message: '✅ Document embedded successfully!',
      documentId: doc._id,
      chunksEmbedded: doc.chunks.length,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};