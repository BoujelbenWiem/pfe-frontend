import api from "@/lib/api";

export interface Conversation {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  archived?: boolean;
}

export interface ConversationMessage {
  id: string;
  role: "user" | "assistant";
  content?: string;
  formatted_response?: any;
  sql_query?: string;
  created_at: string;
}

export interface ConversationDetail extends Conversation {
  messages: ConversationMessage[];
}

export async function getConversations(): Promise<Conversation[]> {
  const { data } = await api.get("/conversations");
  return data;
}

export async function createConversation(title?: string): Promise<Conversation> {
  const { data } = await api.post("/conversations", { title });
  return data;
}

export async function getConversation(id: string): Promise<ConversationDetail> {
  const { data } = await api.get(`/conversations/${id}`);
  return data;
}

export async function renameConversation(id: string, title: string): Promise<Conversation> {
  const { data } = await api.patch(`/conversations/${id}`, { title });
  return data;
}

export async function archiveConversation(id: string): Promise<Conversation> {
  const { data } = await api.patch(`/conversations/${id}`, { archived: true });
  return data;
}

export async function deleteConversation(id: string): Promise<void> {
  await api.delete(`/conversations/${id}`);
}
