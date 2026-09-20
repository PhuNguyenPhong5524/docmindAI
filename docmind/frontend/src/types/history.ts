export interface HistoryMetrics {
  total_sessions: number;
  queried_docs: number;
  total_messages: number;
  total_questions: number;
  citation_rate: number;
}

export interface HistorySession {
  id: string;
  document_id: string;
  document_name: string;
  document_status: "PROCESSING" | "READY" | "FAILED";
  last_message_id: string;
  last_role: "user" | "ai";
  last_content: string;
  citations_count: number;
  last_active_at: string;
  first_active_at: string;
  message_count: number;
  question_count: number;
}

export interface UserHistoryData {
  metrics: HistoryMetrics;
  sessions: HistorySession[];
}

export interface UserHistoryResponse {
  success: boolean;
  data: UserHistoryData;
}

export interface NotificationResponseItem {
  _id: string;
  title: string;
  message: string;
  type: "INFO" | "SUCCESS" | "WARNING" | "ERROR";
  is_read: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface NotificationsResponse {
  success: boolean;
  unread_count: number;
  data: NotificationResponseItem[];
}
