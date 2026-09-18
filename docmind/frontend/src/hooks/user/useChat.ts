import { useMutation, useQuery } from "@tanstack/react-query";
import { askQuestion, getChatHistory } from "../../services/chatService";

export const useAskQuestion = () => {
  return useMutation({
    mutationFn: askQuestion,
  });
};

export const useChatHistory = (documentId?: string) => {
  return useQuery({
    queryKey: ["chat-history", documentId],
    queryFn: () => getChatHistory(documentId as string),
    enabled: Boolean(documentId),
  });
};
