import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

import { Worker } from "bullmq";
import { vectorStore } from "./ai.config.js";

export const worker = new Worker(
  "file-queue",
  async (job) => {
    const fileData = JSON.parse(job.data);
    const { path } = fileData;

    // Load the pdf file. Chunks the file into individual pages. The `docs` array will be an array of pages of the uploaded document.
    const loader = new PDFLoader(path);
    const docs = await loader.load();

    // Put the pdf in Vector DB
    await vectorStore.addDocuments(docs);
  },
  {
    concurrency: 100,
    connection: { host: "localhost", port: process.env.REDIS_PORT },
  }
);
