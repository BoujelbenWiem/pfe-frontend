import api from "@/lib/api";
import { ChatResponse } from "@/lib/types";

export async function sendMessage(question: string): Promise<ChatResponse> {
  const { data } = await api.post("/chat", { question });
  return data;
}
