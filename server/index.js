import cors from "cors";
import multer from "multer";
import express from "express";
import { Queue } from "bullmq";
import { configDotenv } from "dotenv";

import { vectorStore, openAiClient } from "./ai.config.js";

configDotenv();
const port = process.env.PORT;
const redisPort = process.env.REDIS_PORT;

const fileQueue = new Queue("file-queue", {
  connection: { host: "localhost", port: redisPort },
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

const upload = multer({ storage });

const app = express();

app.use(cors());

app.post("/upload", upload.single("pdf"), async (req, res) => {
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

  const retriever = vectorStore.asRetriever({ k: 2 });
  const result = await retriever.invoke(userQuery);

  const SYSTEM_PROMPT = `You are a helpful AI assistant who answers the user query based on available context from the PDF file. Context: ${JSON.stringify(result)}`;

  const chatResult = await openAiClient.chat.completions.create({
    model: "chatgpt-4o-latest",
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: userQuery },
    ]
  });

  return res.json({ docs: result, message: chatResult.choices[0].message.content });
});

app.listen(port, () => {
  console.log(`Server listening on port: ${port}`);
});
