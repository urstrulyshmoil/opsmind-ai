const Groq = require('groq-sdk');
const { GoogleGenAI } = require('@google/genai');
const Document = require('../models/Document');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Convert question to vector (still using Gemini for embeddings)
const getEmbedding = async (text) => {
  const response = await ai.models.embedContent({
    model: 'gemini-embedding-001',
    contents: text,
  });
  return response.embeddings[0].values;
};

exports.chat = async (req, res) => {
  try {
    const { question } = req.body;
    if (!question) return res.status(400).json({ error: 'Question is required' });

    console.log(`💬 Question: "${question}"`);

    // Step 1: Convert question to vector
    const queryEmbedding = await getEmbedding(question);

    // Step 2: Search MongoDB for relevant chunks
    const results = await Document.aggregate([
      {
        $vectorSearch: {
          index: 'vector_index',
          path: 'chunks.embedding',
          queryVector: queryEmbedding,
          numCandidates: 5,
          limit: 1,
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

    // Step 3: Build context
    if (results.length === 0) {
      return res.json({
        answer: "I don't have enough information to answer this question.",
        sources: [],
      });
    }

    const contextChunks = results.flatMap(doc =>
      doc.chunks.map((chunk, i) => ({
        text: chunk.text,
        source: doc.originalName,
        chunkIndex: i + 1,
      }))
    );

    const contextText = contextChunks
  .map((c, i) => `[Source ${i + 1}: ${c.source}]\n${c.text.slice(0, 1500)}`)
  .join('\n\n---\n\n');

    // Step 4: Send to Groq AI
    const completion = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [
        {
          role: 'system',
          content: `You are OpsMind AI, a helpful corporate knowledge assistant.
Answer questions ONLY based on the provided context.
If the answer is not in the context, say "I don't know based on the available documents."
Always cite your source like: "According to [filename]..."`,
        },
        {
          role: 'user',
          content: `CONTEXT:\n${contextText}\n\nQUESTION: ${question}`,
        },
      ],
    });

    const answer = completion.choices[0].message.content;
    console.log(`✅ Answer generated!`);

    res.json({
      question,
      answer,
      sources: [...new Set(contextChunks.map(c => c.source))],
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};