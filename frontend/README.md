# ⚡ OpsMind AI — Enterprise SOP Intelligence Platform

<div align="center">

![OpsMind AI Banner](https://img.shields.io/badge/OpsMind-AI%20Powered-6c63ff?style=for-the-badge&logo=openai&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Google Gemini](https://img.shields.io/badge/Google%20Gemini-4285F4?style=for-the-badge&logo=google&logoColor=white)

**An intelligent AI agent that transforms your company SOPs into an interactive knowledge base.**
Upload documents. Ask questions. Get instant, cited answers — powered by RAG architecture.

🌐 **[Live Demo](https://opsmind-ai.vercel.app)** · 🔧 **[Backend API](https://opsmind-ai-backend-jcgu.onrender.com)** · 📬 **[Contact](mailto:shmoilowaisk@gmail.com)**

</div>

---

## 🎯 What is OpsMind AI?

OpsMind AI is a **production-grade RAG (Retrieval-Augmented Generation)** application built for enterprises that want to unlock the knowledge hidden inside their PDF documents. Instead of manually searching through hundreds of pages, employees can simply **ask a question** and get an accurate, sourced answer in seconds.

> 💡 Built from scratch by **Shmoil Owais K** at **Zaalima Development** as part of the Q4 product roadmap.

---

## ✨ Key Features

| Feature | Description |
|--------|-------------|
| 📄 **Smart PDF Ingestion** | Upload any PDF and the system automatically chunks, processes, and indexes it |
| 🧠 **Vector Embeddings** | Uses Google Gemini `gemini-embedding-001` to generate 3072-dimension semantic vectors |
| 🔍 **Vector Similarity Search** | MongoDB Atlas Vector Search finds the most relevant document chunks for any query |
| 🤖 **AI-Powered Chat** | Groq's LLaMA 3.1 8B model generates accurate, context-aware responses |
| 🔐 **JWT Authentication** | Secure login/register system with role-based access control |
| 👑 **Admin Dashboard** | Full control panel with stats, document management, and user oversight |
| 📊 **Real-time Stats** | Track total documents, users, chunks, and AI model usage |
| 🗑️ **Document Management** | Admins can upload and delete documents at any time |

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        USER INTERFACE                        │
│                    React + Vite (Vercel)                     │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTP Requests
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                      BACKEND API                             │
│                  Node.js + Express (Render)                  │
│                                                              │
│   ┌─────────────┐  ┌──────────────┐  ┌─────────────────┐   │
│   │ Auth Routes │  │ Upload Routes│  │  Chat Routes    │   │
│   │  JWT + BCrypt│  │ Multer+Parse │  │  RAG Pipeline   │   │
│   └─────────────┘  └──────┬───────┘  └────────┬────────┘   │
└──────────────────────────┼───────────────────┼─────────────┘
                           │                   │
              ┌────────────▼──────┐   ┌────────▼────────────┐
              │  Google Gemini    │   │   MongoDB Atlas      │
              │  Embedding API    │   │   Vector Search      │
              │  (3072 dimensions)│   │   (cosine similarity)│
              └────────────┬──────┘   └────────┬────────────┘
                           │                   │
                           └─────────┬─────────┘
                                     │
                          ┌──────────▼──────────┐
                          │     Groq API         │
                          │  LLaMA 3.1 8B Instant│
                          │  (Response Generation)│
                          └─────────────────────┘
```

---

## 🛠️ Tech Stack

### 🎨 Frontend
- **React 18** + **Vite** — Fast, modern UI framework
- **Framer Motion** — Smooth animations and transitions
- **Axios** — HTTP client for API calls
- **React Dropzone** — Drag & drop file uploads
- **React Hot Toast** — Beautiful notifications
- **Custom CSS** — Dark theme with CSS variables (no UI library)

### ⚙️ Backend
- **Node.js** + **Express** — RESTful API server
- **MongoDB Atlas** — Cloud database with Vector Search index
- **Mongoose** — MongoDB ODM
- **Multer** — PDF file upload handling
- **pdf-parse** — Extract text content from PDFs
- **Google Gemini** (`@google/genai`) — Generate 3072-dim embeddings
- **Groq SDK** — LLaMA 3.1 8B Instant for chat completions
- **JWT** + **bcryptjs** — Authentication & password hashing

### ☁️ Infrastructure
- **Vercel** — Frontend deployment (CDN, auto-deploy)
- **Render** — Backend deployment (free tier)
- **MongoDB Atlas** — Cloud database (M0 free cluster)

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Google Gemini API key
- Groq API key

### 1. Clone the repository
```bash
git clone https://github.com/urstrulyshmoil/opsmind-ai.git
cd opsmind-ai
```

### 2. Setup Backend
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` folder:
```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
GEMINI_API_KEY=your_google_gemini_api_key
GROQ_API_KEY=your_groq_api_key
JWT_SECRET=your_super_secret_jwt_key
```

Start the backend:
```bash
node server.js
```

### 3. Setup Frontend
```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend` folder:
```env
VITE_API_URL=http://localhost:5000
```

Start the frontend:
```bash
npm run dev
```

### 4. Setup MongoDB Atlas Vector Search Index

In your MongoDB Atlas dashboard, create a Vector Search index on your `documents` collection:

```json
{
  "fields": [
    {
      "type": "vector",
      "path": "chunks.embedding",
      "numDimensions": 3072,
      "similarity": "cosine"
    }
  ]
}
```
Index name: `vector_index`

---

## 📁 Project Structure

```
opsmind-ai/
├── backend/
│   ├── controllers/
│   │   ├── authController.js      # Register, login, JWT
│   │   ├── uploadController.js    # PDF upload & chunking
│   │   ├── embeddingController.js # Gemini embeddings
│   │   └── chatController.js      # RAG chat pipeline
│   ├── middleware/
│   │   └── auth.js                # JWT verification
│   ├── models/
│   │   ├── Document.js            # PDF + chunks schema
│   │   └── User.js                # User schema
│   ├── routes/
│   │   ├── upload.js              # All document routes
│   │   └── auth.js                # Auth routes
│   └── server.js                  # Express app entry
│
└── frontend/
    └── src/
        ├── components/
        │   ├── ChatWindow.jsx     # AI chat interface
        │   ├── Sidebar.jsx        # Navigation + doc list
        │   └── UploadModal.jsx    # Drag & drop uploader
        ├── context/
        │   └── AuthContext.jsx    # Global auth state
        ├── pages/
        │   ├── LoginPage.jsx      # Login form
        │   ├── RegisterPage.jsx   # Register form
        │   └── AdminDashboard.jsx # Admin control panel
        ├── config.js              # API URL config
        └── App.jsx                # Root component
```

---

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login + get JWT token |
| GET | `/api/auth/me` | Get current user |

### Documents
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/upload` | Upload PDF file |
| POST | `/api/embed/:documentId` | Generate embeddings |
| POST | `/api/search` | Vector similarity search |
| POST | `/api/chat` | AI chat with RAG |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/stats` | Dashboard statistics |
| GET | `/api/admin/documents` | List all documents |
| DELETE | `/api/admin/document/:id` | Delete a document |

---

## 🧠 How RAG Works in OpsMind AI

1. **Upload** — User uploads a PDF file
2. **Parse** — `pdf-parse` extracts raw text
3. **Chunk** — Text is split into 1000-char chunks with 100-char overlap
4. **Embed** — Each chunk is sent to Google Gemini to generate a 3072-dimension vector
5. **Store** — Chunks + vectors are stored in MongoDB Atlas
6. **Query** — User asks a question → question is embedded → vector similarity search finds top matching chunks
7. **Generate** — Matching chunks are sent as context to Groq LLaMA 3.1 → AI generates a cited answer

---

## 👨‍💻 About the Developer

**Shmoil Owais K**
Full Stack Developer @ Zaalima Development

- 📧 shmoilowaisk@gmail.com
- 🐙 [GitHub](https://github.com/urstrulyshmoil)

---

## 📄 License

This project is proprietary software developed for **Zaalima Development**.

---

<div align="center">
  <strong>Built with ❤️ by Shmoil Owais K — Zaalima Development</strong>
</div>