import api from "../lib/api";
import type {
  AskQuestionRequest,
  AskQuestionResponse,
  ChatHistoryResponse,
} from "../types/chat";

export const askQuestion = async (
  payload: AskQuestionRequest
): Promise<AskQuestionResponse> => {
  const { data } = await api.post<AskQuestionResponse>("/api/chat", payload);
  return data;
};

export const getChatHistory = async (
  documentId: string
): Promise<ChatHistoryResponse> => {
  const { data } = await api.get<ChatHistoryResponse>(
    `/api/chat/history/${documentId}`
  );
  return data;
};
