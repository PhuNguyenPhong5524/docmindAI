import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteDocument, getDocuments, uploadDocument } from "../../services/documentService";

export const documentsQueryKey = ["documents"] as const;

export const useDocuments = () => {
  return useQuery({
    queryKey: documentsQueryKey,
    queryFn: getDocuments,
  });
};

export const useUploadDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadDocument,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: documentsQueryKey });
    },
  });
};

export const useDeleteDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteDocument,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: documentsQueryKey });
    },
  });
};
