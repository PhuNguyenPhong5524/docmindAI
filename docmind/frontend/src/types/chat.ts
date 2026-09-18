export interface Citation {
  document_id: string;
  document_name: string;
  page_number: number;
  excerpt: string;
}

export type ChatRole = "user" | "ai";

export interface ChatMessage {
  _id: string;
  user_id: string;
  document_id: string;
  role: ChatRole;
  content: string;
  citations?: Citation[];
  createdAt: string;
  updatedAt?: string;
}

export interface AskQuestionRequest {
  document_id: string;
  question: string;
}

export interface AskQuestionResponse {
  success: boolean;
  answer: string;
  citations: Citation[];
}

export interface ChatHistoryResponse {
  success: boolean;
  data: ChatMessage[];
}
