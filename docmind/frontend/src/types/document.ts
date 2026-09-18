export type DocumentStatus = "PROCESSING" | "READY" | "FAILED";

export interface UserDocument {
  _id: string;
  original_name: string;
  display_name: string;
  file_url?: string;
  mime_type: string;
  size: number;
  total_pages: number;
  status: DocumentStatus;
  error_message?: string | null;
  created_at: string;
  updated_at?: string;
}

export interface GetDocumentsResponse {
  success: boolean;
  count: number;
  data: UserDocument[];
}

export interface UploadDocumentResponse {
  success: boolean;
  message: string;
  data: UserDocument;
}
