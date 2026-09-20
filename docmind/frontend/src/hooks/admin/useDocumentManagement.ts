import { useState, useMemo, useCallback, useEffect } from "react";
import { message } from "antd";
import type { DocumentItem, DocumentStatus } from "../../types/adminDocument";

export function useDocumentManagement() {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [statusFilter, setStatusFilter] = useState<DocumentStatus | "ALL">("ALL");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [capacityFilter, setCapacityFilter] = useState<string>("");

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [selectedDocForDelete, setSelectedDocForDelete] = useState<DocumentItem | null>(null);

  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [selectedDocForDrawer, setSelectedDocForDrawer] = useState<DocumentItem | null>(null);

  const fetchDocuments = async () => {
    message.loading({ content: "Syncing documents...", key: "fetchDocs" });
    try {
      const response = await fetch("http://localhost:8080/api/documents");
      const result = await response.json();

      if (result.success && Array.isArray(result.data)) {
        const formattedDocs = result.data.map((doc: any) => ({
          id: doc._id,
          name: doc.display_name || doc.original_name,
          originalName: doc.original_name,
          // ĐÃ SỬA: Bắt thẳng tên thật từ Backend của Tiến gửi sang
          ownerName: doc.owner_name || "Người dùng ẩn",
          ownerEmail: "",
          size: doc.size ? `${(doc.size / (1024 * 1024)).toFixed(2)} MB` : "0 MB",
          sizeMB: doc.size ? doc.size / (1024 * 1024) : 0,
          pages: doc.total_pages || 0,
          status: doc.status || "PROCESSING",
          uploadDate: new Date(doc.created_at || Date.now()).toLocaleString("vi-VN"),
          mimeType: doc.mime_type || "application/pdf",
          chunksCount: 0,
          avgTokens: 0,
        }));
        setDocuments(formattedDocs);
        message.success({ content: "Documents synced successfully!", key: "fetchDocs" });
      } else {
        message.error({ content: "Failed to load document data structure.", key: "fetchDocs" });
      }
    } catch (error) {
      console.error(error);
      message.error({ content: "Connection to Backend failed!", key: "fetchDocs" });
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      if (statusFilter !== "ALL" && doc.status !== statusFilter) return false;

      if (searchTerm.trim() !== "") {
        const query = searchTerm.toLowerCase().trim();
        const matchName = doc.name.toLowerCase().includes(query);
        const matchOriginalName = doc.originalName.toLowerCase().includes(query);
        const matchOwner = doc.ownerName.toLowerCase().includes(query);
        const matchEmail = doc.ownerEmail.toLowerCase().includes(query);
        if (!matchName && !matchOriginalName && !matchOwner && !matchEmail) return false;
      }

      if (capacityFilter === "small" && doc.sizeMB >= 10) return false;
      if (capacityFilter === "medium" && (doc.sizeMB < 10 || doc.sizeMB > 50)) return false;
      if (capacityFilter === "large" && doc.sizeMB <= 50) return false;

      return true;
    });
  }, [documents, statusFilter, searchTerm, capacityFilter]);

  const handleOpenDeleteModal = useCallback((doc: DocumentItem) => {
    setSelectedDocForDelete(doc);
    setIsDeleteModalOpen(true);
  }, []);

  const handleConfirmDeleteDocument = useCallback(async () => {
    if (selectedDocForDelete) {
      try {
        const response = await fetch(`http://localhost:8080/api/documents/${selectedDocForDelete.id}`, {
          method: 'DELETE',
        });
        const result = await response.json();
        
        if (result.success) {
          setDocuments((prev) => prev.filter((d) => d.id !== selectedDocForDelete.id));
          message.success(`Deleted document: ${selectedDocForDelete.name}`);
        } else {
          message.error("Failed to delete document on server.");
        }
      } catch (error) {
        message.error("Error communicating with server.");
      } finally {
        setIsDeleteModalOpen(false);
        setSelectedDocForDelete(null);
        if (selectedDocForDrawer?.id === selectedDocForDelete?.id) {
          setIsDrawerOpen(false);
        }
      }
    }
  }, [selectedDocForDelete, selectedDocForDrawer]);

  const handleOpenDrawer = useCallback((doc: DocumentItem) => {
    setSelectedDocForDrawer(doc);
    setIsDrawerOpen(true);
  }, []);

  const handleResetFilters = useCallback(() => {
    setStatusFilter("ALL");
    setSearchTerm("");
    setCapacityFilter("");
    message.info("Filters reset.");
  }, []);

  const handleRefresh = useCallback(() => {
    fetchDocuments();
  }, []);

  return {
    documents,
    filteredDocuments,
    statusFilter,
    setStatusFilter,
    searchTerm,
    setSearchTerm,
    capacityFilter,
    setCapacityFilter,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    selectedDocForDelete,
    isDrawerOpen,
    setIsDrawerOpen,
    selectedDocForDrawer,
    handleOpenDeleteModal,
    handleConfirmDeleteDocument,
    handleOpenDrawer,
    handleResetFilters,
    handleRefresh,
  };
}