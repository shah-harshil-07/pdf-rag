"use client";

import { Bot } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface IMessageBody {
  message: string;
}

const BotMessage = ({ message }: IMessageBody) => {
  return (
    <div className="flex justify-start gap-2">
      <Bot />

      <div className="border-2 rounded-3xl p-3 w-[calc(100%-4rem)] bg-blue-600 text-white overflow-x-auto">
        <ReactMarkdown>{message}</ReactMarkdown>
      </div>
    </div>
  );
};

export default BotMessage;
