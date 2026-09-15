import { useState, useMemo, useCallback } from "react";
import { message } from "antd";
import type { DocumentItem, DocumentStatus } from "../../types/adminDocument";

const INITIAL_DOCUMENTS: DocumentItem[] = [
  {
    id: "DOC-8821",
    name: "Tai_lieu_thuat_toan_RAG_v2.pdf",
    originalName: "rag_indexing_whitepaper_final.pdf",
    ownerName: "Nguyễn Văn An",
    ownerEmail: "nguyenvanan@uit.edu.vn",
    size: "12.4 MB",
    sizeMB: 12.4,
    pages: 48,
    status: "READY",
    uploadDate: "24/10/2024 14:20",
    mimeType: "application/pdf",
    chunksCount: 240,
    avgTokens: 512,
  },
  {
    id: "DOC-9402",
    name: "Scan_giao_trinh_cu_bi_loi.pdf",
    originalName: "scan_c2_he_thong_nhung_1998.pdf",
    ownerName: "Hoàng Văn Bình",
    ownerEmail: "binh.hoang@uit.edu.vn",
    size: "34.5 MB",
    sizeMB: 34.5,
    pages: 120,
    status: "FAILED",
    statusDetail: "Lỗi OCR font: File PDF quét ở độ phân giải quá thấp hoặc bị khóa bảo vệ.",
    uploadDate: "24/10/2024 13:05",
    mimeType: "application/pdf",
    chunksCount: 0,
    avgTokens: 0,
  },
  {
    id: "DOC-8822",
    name: "Bao_cao_tai_chinh_Q3_Enterprise.pdf",
    originalName: "audited_q3_report_2024.pdf",
    ownerName: "Trần Mai Anh",
    ownerEmail: "maianh.tran@techcorp.vn",
    size: "8.2 MB",
    sizeMB: 8.2,
    pages: 32,
    status: "PROCESSING",
    statusDetail: "Đang tiến hành vector hóa và tính toán embedding (45%).",
    uploadDate: "24/10/2024 15:42",
    mimeType: "application/pdf",
    chunksCount: 96,
    avgTokens: 512,
  },
  {
    id: "DOC-8823",
    name: "ISO_27001_Information_Security_Manual.pdf",
    originalName: "iso_policy_revised_signed.pdf",
    ownerName: "Lê Quang Đức",
    ownerEmail: "duc.le@securenets.io",
    size: "19.1 MB",
    sizeMB: 19.1,
    pages: 86,
    status: "READY",
    uploadDate: "23/10/2024 18:11",
    mimeType: "application/pdf",
    chunksCount: 310,
    avgTokens: 512,
  },
  {
    id: "DOC-8824",
    name: "So_tay_nhan_su_Docmind_2024.pdf",
    originalName: "internal_docmind_handbook.pdf",
    ownerName: "Vũ Thị Hằng",
    ownerEmail: "hang.vu@docmind.ai",
    size: "5.8 MB",
    sizeMB: 5.8,
    pages: 24,
    status: "READY",
    uploadDate: "22/10/2024 09:15",
    mimeType: "application/pdf",
    chunksCount: 112,
    avgTokens: 512,
  },
];

export function useDocumentManagement() {
  const [documents, setDocuments] = useState<DocumentItem[]>(INITIAL_DOCUMENTS);
  const [statusFilter, setStatusFilter] = useState<DocumentStatus | "ALL">("ALL");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [capacityFilter, setCapacityFilter] = useState<string>("");

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [selectedDocForDelete, setSelectedDocForDelete] = useState<DocumentItem | null>(null);

  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [selectedDocForDrawer, setSelectedDocForDrawer] = useState<DocumentItem | null>(null);

  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      // Filter status
      if (statusFilter !== "ALL" && doc.status !== statusFilter) return false;

      // Filter search
      if (searchTerm.trim() !== "") {
        const query = searchTerm.toLowerCase().trim();
        const matchName = doc.name.toLowerCase().includes(query);
        const matchOriginalName = doc.originalName.toLowerCase().includes(query);
        const matchOwner = doc.ownerName.toLowerCase().includes(query);
        const matchEmail = doc.ownerEmail.toLowerCase().includes(query);
        if (!matchName && !matchOriginalName && !matchOwner && !matchEmail) return false;
      }

      // Filter capacity
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

  const handleConfirmDeleteDocument = useCallback(() => {
    if (selectedDocForDelete) {
      setDocuments((prev) => prev.filter((d) => d.id !== selectedDocForDelete.id));
      message.success(`Đã xóa tài liệu "${selectedDocForDelete.name}" khỏi hệ thống.`);
      setIsDeleteModalOpen(false);
      setSelectedDocForDelete(null);
      if (selectedDocForDrawer?.id === selectedDocForDelete.id) {
        setIsDrawerOpen(false);
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
    message.info("Đã làm mới bộ lọc.");
  }, []);

  const handleRefresh = useCallback(() => {
    message.success("Đã cập nhật danh sách tài liệu mới nhất.");
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