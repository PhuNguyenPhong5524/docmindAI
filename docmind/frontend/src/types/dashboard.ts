import type { DocumentStatus } from "./document";

export interface DashboardStats {
  total_documents: number;
  ready_documents: number;
  processing_documents: number;
  failed_documents: number;
  total_storage_bytes: number;
  total_pages: number;
  chat_sessions: number;
  total_questions: number;
  storage_limit_bytes: number;
}

export interface DashboardDocument {
  _id: string;
  original_name: string;
  display_name: string;
  size: number;
  total_pages: number;
  status: DocumentStatus;
  error_message?: string | null;
  created_at: string;
  updated_at?: string;
}

export interface DashboardChat {
  document_id: string;
  last_message_id: string;
  last_role: "user" | "ai";
  last_content: string;
  citations_count: number;
  updated_at: string;
  document_name: string;
}

export interface UserDashboardData {
  stats: DashboardStats;
  recent_documents: DashboardDocument[];
  recent_chats: DashboardChat[];
}

export interface UserDashboardResponse {
  success: boolean;
  data: UserDashboardData;
}
