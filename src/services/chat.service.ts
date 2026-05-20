import api from "@/lib/api";
import { ChatResponse } from "@/lib/types";

export interface ChatRequest {
  question: string;
  conversation_id?: string | null;
}

export interface ChatResponseWithConversation extends ChatResponse {
  conversation_id?: string;
}

export async function sendMessage(question: string, conversation_id?: string | null): Promise<ChatResponseWithConversation> {
  const { data } = await api.post("/chat", { question, conversation_id: conversation_id || null });
  return data;
}
