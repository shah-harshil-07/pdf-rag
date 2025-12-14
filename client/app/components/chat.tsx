"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import BotMessage from "./bot-message";
import UserMessage from "./user-message";

interface Document {
  pageContent?: string;
  metdata?: {
    source?: string;
    loc?: {
      pageNumber?: number;
    };
  };
}

interface IMessage {
    role: "assistant" | "user";
    content?: string;
    documents?: Document[];
}

const ChatComponent: React.FC = () => {
  const [message, setMessage] = React.useState<string>("");
  const [messageHistory, setMessageHistory] = React.useState<IMessage[]>([]);

  const handleSendChatMessage = async () => {
    setMessage('');
    setMessageHistory(prevMessages => {
      return [...prevMessages, { role: 'user', content: message }];
    });
    const response = await fetch(`http://localhost:8000/chat?message=${message}`);
    const responseData = await response.json();
    setMessageHistory(prevMessages => {
      return [
        ...prevMessages,
        {
          role: 'assistant',
          documents: responseData?.docs ?? [],
          content: responseData?.message ?? '',
        },
      ];
    });
  };

  return (
    <div className="relative p-4">
      <div className="flex flex-col gap-1.5 overflow-y-auto h-[90vh]">
        {messageHistory.map((messageBody, i) => (
          <React.Fragment key={`message-${i}`}>
            {messageBody?.role === 'user' ? (
              <UserMessage message={messageBody.content ?? ""} />
            ) : (
              <BotMessage message={messageBody.content ?? ""} />
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="fixed bottom-4 w-[65vw] flex gap-2 justify-center">
        <Input
          value={message}
          placeholder={"What can I help you with?"}
          onChange={(e) => {
            setMessage(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSendChatMessage();
          }}
        />
        <Button onClick={handleSendChatMessage} disabled={!message.trim()}>
          Send
        </Button>
      </div>
    </div>
  );
};

export default ChatComponent;
