# 📄 PDF RAG System (Node.js + LangChain)

An AI-powered backend system that allows users to upload PDF documents, generate embeddings, and ask context-aware questions using Retrieval-Augmented Generation (RAG).

---

## 🚀 Features

* Upload PDF files
* Extract and clean text
* Chunk large documents
* Generate embeddings using OpenAI
* Store vectors in FAISS (in-memory)
* Ask questions based on document context
* Generate document summaries
* Return source chunks for transparency

---

## 🛠️ Tech Stack

* **Backend:** Node.js, Express.js
* **AI / RAG:** LangChain.js
* **LLM & Embeddings:** OpenAI API
* **Vector Store:** FAISS (in-memory via LangChain)
* **PDF Parsing:** pdf-parse
* **File Uploads:** multer

---

## 📦 Dependencies

Key packages used:

* express
* multer
* dotenv
* pdf-parse (v1.1.1)
* openai (v4)
* @langchain/core (v0.3.x)
* @langchain/openai
* @langchain/community
* langchain

---

## ⚙️ Setup Instructions

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd pdf-rag-system
```

---

### 2. Install dependencies

```bash
npm install
```

---

### 3. Setup environment variables

Create a `.env` file in root:

```env
OPENAI_API_KEY=your_openai_api_key
PORT=5000
```

---

### 4. Create uploads directory

```bash
mkdir uploads
```

---

## ▶️ How to Run

### Start development server

```bash
npm run dev
```

Server will run on:

```
http://localhost:5000
```

---

## 🔌 API Endpoints

### 1. Upload PDF

```
POST /api/pdf/upload
```

**Form-data:**

* key: `pdf`
* value: (PDF file)

---

### 2. Ask Question

```
POST /api/qa/ask
```

**Body:**

```json
{
  "question": "What is the main topic of the document?"
}
```

---

### 3. Get Summary

```
GET /api/qa/summarize
```

---

## 🧠 Architecture Overview

```
PDF Upload
   ↓
Text Extraction (pdf-parse)
   ↓
Text Cleaning
   ↓
Chunking (LangChain TextSplitter)
   ↓
Embeddings (OpenAI)
   ↓
Vector Storage (FAISS - in memory)
   ↓
User Query
   ↓
Similarity Search
   ↓
Relevant Chunks
   ↓
LLM (RAG Prompt)
   ↓
Final Answer + Sources
```

---

## ⚙️ System Design

### 🔹 Document Processing Pipeline

* Extract → Clean → Chunk → Embed → Store

### 🔹 Query Pipeline

* Query → Embed → Retrieve → Generate Answer

---

## 🎯 Design Decisions & Trade-offs

### 1. FAISS (In-Memory)

**Why:**

* Fast and simple
* No external DB setup

**Trade-off:**

* Data lost on server restart

---

### 2. Chunking Strategy

**Why:**

* Improves retrieval accuracy
* Prevents token overflow

**Trade-off:**

* Requires tuning for optimal results

---

### 3. OpenAI API

**Why:**

* High-quality embeddings and responses

**Trade-off:**

* Paid usage (minimal cost)

---

### 4. No Frontend

**Why:**

* Focus on backend + AI pipeline

**Trade-off:**

* Requires Postman/curl for testing

---

## ⚠️ Limitations

* In-memory storage (no persistence)
* Single document at a time
* No authentication
* Limited to ~10MB PDFs

---

## 🚀 Future Improvements

* Persistent vector DB (Chroma / Pinecone)
* Multi-document support
* Streaming responses
* Frontend UI (Flutter / Web)
* Caching embeddings
* Better chunk ranking

---

## 🧪 Testing

Use:

* Postman
* Thunder Client (VS Code)

---

## 💡 Example Output

```json
{
  "answer": "The document discusses...",
  "sourceChunks": [
    {
      "content": "The study focuses on...",
      "source": "sample.pdf",
      "chunkIndex": 2
    }
  ]
}
```

---

## 📌 Summary

This project demonstrates:

* Real-world RAG pipeline
* LLM integration
* Vector search
* Backend system design

---

## 👨‍💻 Author

Krishna Verma

---
