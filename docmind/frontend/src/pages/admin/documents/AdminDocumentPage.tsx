import React, { useState, useMemo, useEffect, useRef } from "react";
import { message } from "antd";
import { CloudUploadOutlined } from "@ant-design/icons";
import { useDocumentManagement } from "../../../hooks/admin/useDocumentManagement";
import { DocumentHeader } from "./components/DocumentHeader";
import { DocumentFilterBar } from "./components/DocumentFilterBar";
import { DocumentTable } from "./components/DocumentTable";
import { DocumentDeleteModal } from "./components/DocumentDeleteModal";
import { DocumentDetailDrawer } from "./components/DocumentDetailDrawer";

export default function AdminDocumentPage(): React.ReactElement {
  const {
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
    handleRefresh, // Dùng để load lại danh sách sau khi upload
  } = useDocumentManagement();

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5);

  // States & Refs cho tính năng Upload
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, capacityFilter]);

  const paginatedDocuments = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredDocuments.slice(startIndex, startIndex + pageSize);
  }, [filteredDocuments, currentPage, pageSize]);

  const handlePageChange = (page: number, newPageSize: number) => {
    setCurrentPage(page);
    setPageSize(newPageSize);
  };

  // Logic Upload File
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    if (file.type !== "application/pdf") {
      message.error("Hệ thống chỉ hỗ trợ file PDF!");
      return;
    }

    const formData = new FormData();
    formData.append("pdf_file", file); // Tên field bắt buộc khớp với Backend

    setIsUploading(true);
    message.loading({ content: `Đang tải lên ${file.name}...`, key: "upload" });

    try {
      const token = localStorage.getItem("token") || localStorage.getItem("accessToken") || "";
      const response = await fetch("http://localhost:8080/api/documents/upload", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}` // Đính kèm token bảo mật
        },
        body: formData
      });

      const result = await response.json();
      
      if (result.success) {
        message.success({ content: "Tải tài liệu lên và xử lý thành công!", key: "upload" });
        if (handleRefresh) handleRefresh(); // Gọi lại hàm load dữ liệu mới nhất
      } else {
        message.error({ content: result.message || "Tải lên thất bại", key: "upload" });
      }
    } catch (error) {
      console.error(error);
      message.error({ content: "Lỗi kết nối máy chủ!", key: "upload" });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = ""; // Reset input
    }
  };

  return (
    <div className="w-full bg-slate-50/50 min-h-screen flex flex-col p-6 gap-6">
      
      {/* Container chứa Header cũ và Nút Upload mới */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
        <DocumentHeader
          totalFiles={documents.length}
          totalStorage="1.48 GB"
          totalChunks="124,890"
        />
        
        {/* Nút Upload */}
        <div>
          <input 
            type="file" 
            accept=".pdf" 
            className="hidden" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
          />
          <button 
            onClick={handleUploadClick} 
            disabled={isUploading}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              isUploading 
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm hover:shadow'
            }`}
          >
            <CloudUploadOutlined className={isUploading ? "animate-bounce" : ""} />
            {isUploading ? "Đang xử lý..." : "Tải tài liệu lên"}
          </button>
        </div>
      </div>

      <DocumentFilterBar
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        capacityFilter={capacityFilter}
        setCapacityFilter={setCapacityFilter}
        documents={documents}
        onReset={handleResetFilters}
      />

      <DocumentTable
        documents={paginatedDocuments}
        total={filteredDocuments.length}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        onOpenDeleteModal={handleOpenDeleteModal}
        onOpenDrawer={handleOpenDrawer}
      />

      <DocumentDeleteModal
        open={isDeleteModalOpen}
        doc={selectedDocForDelete}
        onConfirm={handleConfirmDeleteDocument}
        onCancel={() => setIsDeleteModalOpen(false)}
      />

      <DocumentDetailDrawer
        open={isDrawerOpen}
        doc={selectedDocForDrawer}
        onClose={() => setIsDrawerOpen(false)}
        onOpenDeleteModal={handleOpenDeleteModal}
      />
    </div>
  );
}