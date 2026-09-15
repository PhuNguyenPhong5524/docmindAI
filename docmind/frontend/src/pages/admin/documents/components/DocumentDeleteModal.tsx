import React from "react";
import { Modal } from "antd";
import type { DocumentItem } from "../../../../types/adminDocument";

interface DocumentDeleteModalProps {
  open: boolean;
  doc: DocumentItem | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DocumentDeleteModal: React.FC<DocumentDeleteModalProps> = ({
  open,
  doc,
  onConfirm,
  onCancel,
}) => {
  if (!doc) return null;

  return (
    <Modal open={open} onCancel={onCancel} footer={null} centered width={520} closable={false}>
      <div className="flex flex-col gap-4 py-1">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[28px]">warning</span>
          </div>
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-bold text-slate-900">
              Xóa tài liệu khỏi hệ thống?
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Tài liệu, dữ liệu xử lý và các chunk liên quan sẽ bị xóa vĩnh viễn khỏi vector database (Milvus) và bộ nhớ lưu trữ. Hành động này không thể hoàn tác.
            </p>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-red-500 text-[18px]">description</span>
            <span className="text-sm font-bold text-slate-900 truncate">
              {doc.name}
            </span>
          </div>
          <div className="text-xs text-slate-600 flex flex-col gap-1 pt-1">
            <div>
              <span className="font-medium text-slate-700">Chủ sở hữu:</span> {doc.ownerName} ({doc.ownerEmail})
            </div>
            <div>
              <span className="font-medium text-slate-700">Thông số:</span> {doc.size} | {doc.pages} trang | Trạng thái: {doc.status}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium transition-colors cursor-pointer"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition-colors shadow-xs flex items-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">delete</span>
            <span>Xóa tài liệu</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};