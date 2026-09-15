import path from "path";
import fs from "fs/promises";

const HISTORY_FILE = path.join(
  process.cwd(),
  "data",
  "conversations.jsonl",
);

export async function readHistory() {
  try {
    const data = await fs.readFile(HISTORY_FILE, "utf-8");
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error reading conversation history:", error);
    throw error;
  }
}

async function writeHistory(history) {
  await fs.mkdir(path.dirname(HISTORY_FILE), { recursive: true });
  await fs.writeFile(HISTORY_FILE, JSON.stringify(history));
}

export async function saveChatMessage(message) {
    const messageHistory = await readHistory();
    const history = messageHistory && Array.isArray(messageHistory) ? messageHistory : [];
    history.push(message);
    await writeHistory(history);
}



