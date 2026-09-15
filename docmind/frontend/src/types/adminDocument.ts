export type DocumentStatus = "READY" | "PROCESSING" | "FAILED";

export interface DocumentItem {
  id: string;
  name: string;
  originalName: string;
  ownerName: string;
  ownerEmail: string;
  size: string; // e.g., "12.4 MB"
  sizeMB: number;
  pages: number;
  status: DocumentStatus;
  statusDetail?: string;
  uploadDate: string;
  mimeType: string;
  chunksCount: number;
  avgTokens: number;
  updatedAt?: string;
  createdAt?: string;
}