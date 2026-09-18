import api from "../lib/api";
import type { GetDocumentsResponse, UploadDocumentResponse } from "../types/document";

export const getDocuments = async (): Promise<GetDocumentsResponse> => {
  const { data } = await api.get<GetDocumentsResponse>("/api/documents");
  return data;
};

export const uploadDocument = async (file: File): Promise<UploadDocumentResponse> => {
  const formData = new FormData();
  formData.append("pdf_file", file);

  const { data } = await api.post<UploadDocumentResponse>(
    "/api/documents/upload",
    formData
  );

  return data;
};

export const deleteDocument = async (id: string): Promise<void> => {
  await api.delete(`/api/documents/${id}`);
};
