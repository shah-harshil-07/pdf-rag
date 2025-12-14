import { configDotenv } from "dotenv";
import OpenAI from "openai/index.mjs";
import { OpenAIEmbeddings } from "@langchain/openai";
import { QdrantVectorStore } from "@langchain/qdrant";

configDotenv();
const qdrantPort = process.env.QDRANT_PORT;
const openAiSecretKey = process.env.OPENAI_SECRET_KEY;

export const openAiClient = new OpenAI({ apiKey: openAiSecretKey });

export const embeddings = new OpenAIEmbeddings({
  apiKey: openAiSecretKey,
  model: "text-embedding-3-small",
});

export const vectorStore = await QdrantVectorStore.fromExistingCollection(
  embeddings,
  {
    collectionName: "pdf-docs",
    url: `http://localhost:${qdrantPort}`,
  }
);
