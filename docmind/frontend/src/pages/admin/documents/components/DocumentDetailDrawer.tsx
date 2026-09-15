import React from "react";
import { Drawer } from "antd";
import type { DocumentItem } from "../../../../types/adminDocument";

interface DocumentDetailDrawerProps {
  open: boolean;
  doc: DocumentItem | null;
  onClose: () => void;
  onOpenDeleteModal: (doc: DocumentItem) => void;
}

export const DocumentDetailDrawer: React.FC<DocumentDetailDrawerProps> = ({
  open,
  doc,
  onClose,
  onOpenDeleteModal,
}) => {
  if (!doc) return null;

  return (
    <Drawer
      open={open}
      onClose={onClose}
      width={480}
      title={
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-indigo-600 text-[22px]">assignment</span>
          <span className="text-base text-slate-900 font-bold">
            Chi tiết tài liệu - {doc.id}
          </span>
        </div>
      }
      footer={
        <div className="flex items-center justify-between gap-3 py-1">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium transition-colors cursor-pointer"
          >
            Đóng
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenDeleteModal(doc);
            }}
            className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">delete_forever</span>
            <span>Xóa tài liệu</span>
          </button>
        </div>
      }
    >
      <div className="flex flex-col gap-5">
        {/* Status Notice */}
        {doc.status === "READY" && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100 flex flex-col gap-1.5">
            <div className="flex items-center gap-2 text-emerald-700">
              <span className="material-symbols-outlined text-[18px]">verified</span>
              <span className="text-sm font-bold">Sẵn sàng phục vụ AI RAG</span>
            </div>
            <p className="text-xs text-emerald-800 leading-relaxed">
              Tài liệu đã sẵn sàng để sử dụng trong AI Chat. Toàn bộ {doc.chunksCount || 240} chunks đã hoàn tất embedding bằng mô hình text-embedding-3-large và lưu trữ tại Milvus Index.
            </p>
          </div>
        )}

        {doc.status === "FAILED" && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-800 flex flex-col gap-1.5">
            <div className="flex items-center gap-2 text-red-600 font-bold">
              <span className="material-symbols-outlined text-[18px]">error</span>
              <span className="text-sm font-bold">Xử lý tài liệu thất bại</span>
            </div>
            <p className="text-xs text-red-700 leading-relaxed">
              {doc.statusDetail || "Lỗi xử lý hệ thống không thể bóc tách nội dung file này."}
            </p>
          </div>
        )}

        {doc.status === "PROCESSING" && (
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-100 text-amber-800 flex flex-col gap-1.5">
            <div className="flex items-center gap-2 text-amber-700 font-bold">
              <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
              <span className="text-sm font-bold">Đang tiến hành Vector hóa</span>
            </div>
            <p className="text-xs text-amber-800 leading-relaxed">
              Tài liệu đang trong tiến trình trích xuất text và tạo embeddings. Vui lòng quay lại sau ít phút.
            </p>
          </div>
        )}

        {/* General Attributes */}
        <div className="flex flex-col gap-2 bg-slate-50 border border-slate-100 p-4 rounded-xl">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 pb-1">
            Thuộc tính văn bản
          </span>
          <div className="flex justify-between items-center py-1.5 text-xs">
            <span className="text-slate-500">Tên tài liệu</span>
            <span className="font-semibold text-slate-900 text-right truncate max-w-[220px]" title={doc.name}>
              {doc.name}
            </span>
          </div>
          <div className="flex justify-between items-center py-1.5 text-xs">
            <span className="text-slate-500">Tên gốc</span>
            <span className="font-mono text-slate-600 text-right truncate max-w-[220px]" title={doc.originalName}>
              {doc.originalName}
            </span>
          </div>
          <div className="flex justify-between items-center py-1.5 text-xs">
            <span className="text-slate-500">MIME Type</span>
            <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-200/70 text-slate-800">
              {doc.mimeType || "application/pdf"}
            </span>
          </div>
          <div className="flex justify-between items-center py-1.5 text-xs">
            <span className="text-slate-500">Dung lượng</span>
            <span className="font-semibold text-slate-900">{doc.size}</span>
          </div>
          <div className="flex justify-between items-center py-1.5 text-xs">
            <span className="text-slate-500">Số trang</span>
            <span className="font-semibold text-slate-900">{doc.pages} trang</span>
          </div>
          <div className="flex justify-between items-center py-1.5 text-xs">
            <span className="text-slate-500">Chủ sở hữu</span>
            <span className="font-medium text-indigo-600 hover:underline text-right truncate max-w-[220px]" title={`${doc.ownerName} (${doc.ownerEmail})`}>
              {doc.ownerName} ({doc.ownerEmail})
            </span>
          </div>
          <div className="flex justify-between items-center py-1.5 text-xs">
            <span className="text-slate-500">Ngày tạo</span>
            <span className="font-mono text-slate-800">{doc.uploadDate}</span>
          </div>
          <div className="flex justify-between items-center py-1.5 text-xs">
            <span className="text-slate-500">Ngày cập nhật</span>
            <span className="font-mono text-slate-800">{doc.updatedAt || doc.uploadDate}</span>
          </div>
        </div>

        {/* Vector Ingestion Pipeline */}
        <div className="flex flex-col gap-2 bg-slate-50 border border-slate-100 p-4 rounded-xl">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 pb-1">
            Vector Ingestion Pipeline
          </span>
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="p-3 rounded-lg bg-white border border-slate-200/60 flex flex-col">
              <span className="text-xs text-slate-500">Chunk Count</span>
              <span className="text-base font-bold text-slate-900 mt-1">
                {doc.chunksCount || 0} Chunks
              </span>
            </div>
            <div className="p-3 rounded-lg bg-white border border-slate-200/60 flex flex-col">
              <span className="text-xs text-slate-500">Avg Tokens / Chunk</span>
              <span className="text-base font-bold text-slate-900 mt-1">
                {doc.avgTokens || 0} Tokens
              </span>
            </div>
          </div>
        </div>
      </div>
    </Drawer>
  );
};