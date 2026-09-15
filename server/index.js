import cors from "cors";
import multer from "multer";
import express from "express";
import { createClient } from 'redis';
import { configDotenv } from "dotenv";
import { CohereClientV2 } from "cohere-ai";
import { Queue, Worker, createNodeRedisClient  } from "bullmq";

import { chunkAndAddToVectorDB } from "./worker.js";
import { vectorStore, openAiClient } from "./ai.config.js";
import { readHistory, saveChatMessage } from "./conversationHistory.js";

configDotenv();
const port = process.env.PORT;
const redisPort = process.env.REDIS_PORT;

const rawClient = createClient({ url: `redis://localhost:${redisPort}` });
const redisClient = createNodeRedisClient(rawClient);

const fileQueue = new Queue("file-queue", { connection: redisClient });
const fileWorker = new Worker(
  "file-queue",
  chunkAndAddToVectorDB,
  { connection: redisClient },
);

fileWorker.on('completed', job => {
  console.log(`Job: ${job.id} has completed!`);
});

fileWorker.on('failed', (job, err) => {
  console.log(`Job: ${job.id} has failed with ${err.message}`);
});

const storage = multer.diskStorage({
  destination: function (_, __, cb) {
    cb(null, "uploads/");
  },
  filename: function (_, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const multerInstance = multer({ storage });

const cohereClient = new CohereClientV2({
  token: process.env.COHERE_API_KEY,
});

const app = express();

app.use(cors());

const STATIC_SYSTEM_PROMPT = `You are a helpful AI assistant who answers the user query based on available context from the PDF file.`;

app.post("/upload", multerInstance.single("pdf"), async (req, res) => {
  await fileQueue.add(
    "file-ready",
    JSON.stringify({
      path: req.file.path ?? "",
      fileName: req.file.originalname ?? "",
      destination: req.file.destination ?? "",
    }),
  );

  return res.json({ message: "uploaded" });
});

app.get('/chat', async (req, res) => {
  const userQuery = req.query.message;

  const queriedDocs = await vectorStore.similaritySearch(userQuery, 20);

  const queriedPages = [];
  for (const doc of queriedDocs) queriedPages.push(doc.pageContent ?? '');

  const rerankedDocs = await cohereClient.rerank({
    topN: 3,
    query: userQuery,
    documents: queriedPages,
    model: "rerank-v4.0-pro",
  });

  const systemPrompt = `${STATIC_SYSTEM_PROMPT}
    \nContext: ${JSON.stringify(queriedDocs)}
    \nReranking results: ${JSON.stringify(rerankedDocs.results)}
  `;

  const conversationHistory = await readHistory();

  const chatResult = await openAiClient.chat.completions.create({
    model: "gpt-4",
    messages: [
      { role: 'system', content: systemPrompt },
      ...conversationHistory,
      { role: 'user', content: userQuery },
    ],
  });

  const botResponseText = chatResult?.choices?.[0]?.message?.content ?? "";

  await saveChatMessage({ role: 'user', content: userQuery });
  await saveChatMessage({ role: 'assistant', content: botResponseText });

  return res.json({ docs: rerankedDocs, message: botResponseText });
});

app.listen(port, () => {
  console.log(`Server listening on port: ${port}`);
});
