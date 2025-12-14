📄🤖 RAG-based PDF Chatbot

A Retrieval-Augmented Generation (RAG) powered chatbot that allows users to upload a PDF and ask questions directly from its content.
The chatbot answers strictly based on the uploaded document, ensuring accurate, context-aware responses.

✨ Features

📤 Upload any PDF document

🧠 Automatically processes and “learns” from the document

🔍 Semantic search using vector embeddings

💬 Chat with the document in natural language

⚡ Async processing using queues for scalability

🚫 No hallucinations — answers are grounded in the document

🏗️ Tech Stack
Frontend

Next.js

Backend

Node.js

Express.js

AI & Data Processing

LangChain – PDF loading, chunking & orchestration

OpenAI Embeddings & LLMs

Qdrant – Vector database for semantic search

Infrastructure

BullMQ – Background job processing

Redis – Queue storage for BullMQ

🧠 How It Works (RAG Flow)

User uploads a PDF file

PDF is parsed and split into chunks using LangChain

Each chunk is converted into embeddings via OpenAI

Embeddings are stored in Qdrant Vector DB

User asks a question

Relevant chunks are retrieved using vector similarity

LLM generates an answer using retrieved context

🚀 Getting Started
Prerequisites

Node.js (v18+ recommended)

Redis (running locally or via Docker)

Qdrant (local or cloud)

OpenAI API Key

Installation
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name

Install dependencies
npm install

Environment Variables

Create a .env file in the root directory:

OPENAI_SECRET_KEY=your_openai_api_key
QDRANT_URL=http://localhost:6333
QDRANT_PORT=6333
REDIS_HOST=localhost
REDIS_PORT=6379

Running the Application
Start Redis & Qdrant

You can use Docker:

docker run -p 6333:6333 qdrant/qdrant
docker run -p 6379:6379 redis

Start Backend
npm run dev

Start Frontend
npm run dev

📽️ Demo

📌 Upload a PDF → Ask questions → Get precise answers
https://www.linkedin.com/feed/update/urn:li:ugcPost:7405906365300469760/
