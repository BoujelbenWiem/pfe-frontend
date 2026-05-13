"use client";

import { useState, useRef, useEffect } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import ChatInput from "@/components/chat/ChatInput";
import ChatMessage from "@/components/chat/ChatMessage";
import { sendMessage } from "@/services/chat.service";
import { ChatResponse } from "@/lib/types";

interface Message {
  id: string;
  role: "user" | "assistant";
  content?: string;
  response?: ChatResponse;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (question: string) => {
    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: question,
    };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const response = await sendMessage(question);
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        response,
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        response: {
          error: "An error occurred. Please try again.",
          timestamp: new Date().toISOString(),
        },
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="flex flex-col h-[calc(100vh-8rem)] max-w-4xl mx-auto px-4">
        {/* Messages area */}
        <div className="flex-1 overflow-y-auto py-6 space-y-2">
          {messages.length === 0 && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center space-y-3">
                <div className="text-4xl">💬</div>
                <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
                  Bureau Vallée ChatBot
                </h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm max-w-md">
                  Posez vos questions sur les ventes, stocks, clients et plus encore.
                  Je peux afficher des tableaux et graphiques.
                </p>
              </div>
            </div>
          )}

          {messages.map((msg) => (
            <ChatMessage
              key={msg.id}
              role={msg.role}
              content={msg.content}
              response={msg.response}
            />
          ))}

          {loading && (
            <div className="flex justify-start mb-4">
              <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl rounded-tl-sm px-4 py-3 max-w-xs">
                <div className="flex space-x-1.5">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input area */}
        <div className="pb-4 flex-shrink-0 mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
          <ChatInput onSend={handleSend} loading={loading} />
        </div>
      </div>
    </ProtectedRoute>
  );
}
