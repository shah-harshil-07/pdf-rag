import fs from "fs";
import { getDocumentProxy, extractText } from "unpdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

import { vectorStore } from "./ai.config.js";

export async function chunkAndAddToVectorDB(job) {
  const fileData = JSON.parse(job.data);
  const { path: filePath } = fileData;

  try {
    // Load the pdf file. Chunks the file into individual pages.
    const fileBuffer = fs.readFileSync(filePath);
    const pdf = await getDocumentProxy(new Uint8Array(fileBuffer));

    const { text: pages } = await extractText(pdf);
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    const fileChunks = await splitter.createDocuments(pages);

    // Put the pdf in Vector DB
    await vectorStore.addDocuments(fileChunks); 
  } catch (error) {
    console.error("Error in uploading chunks: ", error);
  }
}

