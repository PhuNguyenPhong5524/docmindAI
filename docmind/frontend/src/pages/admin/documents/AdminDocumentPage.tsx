import React, { useState, useMemo, useEffect } from "react";
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
  } = useDocumentManagement();

  // State Phân Trang
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5);

  // Tự động chuyển về trang 1 khi thay đổi điều kiện tìm kiếm/lọc
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, capacityFilter]);

  // Cắt danh sách filteredDocuments theo trang
  const paginatedDocuments = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredDocuments.slice(startIndex, startIndex + pageSize);
  }, [filteredDocuments, currentPage, pageSize]);

  const handlePageChange = (page: number, newPageSize: number) => {
    setCurrentPage(page);
    setPageSize(newPageSize);
  };

  return (
    <div className="w-full bg-slate-50/50 min-h-screen flex flex-col p-6 gap-6">
      <DocumentHeader
        totalFiles={documents.length || 342}
        totalStorage="1.48 GB"
        totalChunks="124,890"
      />

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