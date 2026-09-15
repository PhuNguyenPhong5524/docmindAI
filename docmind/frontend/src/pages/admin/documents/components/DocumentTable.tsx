import React from "react";
import { Pagination } from "antd";
import type { DocumentItem } from "../../../../types/adminDocument";

interface DocumentTableProps {
  documents: DocumentItem[];
  total: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number, pageSize: number) => void;
  onOpenDeleteModal: (doc: DocumentItem) => void;
  onOpenDrawer: (doc: DocumentItem) => void;
}

export const DocumentTable: React.FC<DocumentTableProps> = ({
  documents,
  total,
  currentPage,
  pageSize,
  onPageChange,
  onOpenDeleteModal,
  onOpenDrawer,
}) => {
  const getInitials = (name: string) => {
    if (!name) return "";
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col">
      <div className="overflow-x-auto w-full">
        <table className="w-full text-left text-xs border-collapse min-w-[820px]">
          <thead>
            <tr className="bg-slate-50/80 text-slate-500 font-bold uppercase tracking-wider select-none border-b border-slate-200/80">
              <th className="py-3 px-4 w-[280px]">Tài liệu</th>
              <th className="py-3 px-4 w-[220px]">Chủ sở hữu</th>
              <th className="py-3 px-4 w-[100px]">Kích thước</th>
              <th className="py-3 px-4 w-[90px]">Số trang</th>
              <th className="py-3 px-4 w-[170px]">Trạng thái</th>
              <th className="py-3 px-4 w-[140px]">Ngày tải lên</th>
              <th className="py-3 px-4 w-[90px] text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {documents.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-500">
                  Không tìm thấy tài liệu phù hợp.
                </td>
              </tr>
            ) : (
              documents.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-9 rounded bg-red-100 text-red-600 flex flex-col items-center justify-center shrink-0 font-bold text-[9px] tracking-tight">
                        <span className="material-symbols-outlined text-[16px] leading-none">picture_as_pdf</span>
                        <span>PDF</span>
                      </div>
                      <div className="flex flex-col min-w-0 max-w-[210px]">
                        <span
                          onClick={() => onOpenDrawer(doc)}
                          title={doc.name}
                          className={`font-semibold text-xs truncate cursor-pointer hover:underline ${
                            doc.status === "FAILED" ? "text-red-600" : "text-slate-900 hover:text-indigo-600"
                          }`}
                        >
                          {doc.name}
                        </span>
                        <span className="font-mono text-[11px] text-slate-400 truncate" title={doc.originalName}>
                          {doc.originalName}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 font-bold text-[11px] flex items-center justify-center shrink-0">
                        {getInitials(doc.ownerName)}
                      </div>
                      <div className="flex flex-col min-w-0 max-w-[180px]">
                        <span className="font-medium text-xs text-slate-900 truncate" title={doc.ownerName}>
                          {doc.ownerName}
                        </span>
                        <span className="font-mono text-[11px] text-slate-500 truncate" title={doc.ownerEmail}>
                          {doc.ownerEmail}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-4 font-mono text-xs font-medium text-slate-800 whitespace-nowrap">
                    {doc.size}
                  </td>

                  <td className="py-3 px-4 font-mono text-xs text-slate-700 whitespace-nowrap">
                    {doc.pages} trang
                  </td>

                  <td className="py-3 px-4 whitespace-nowrap">
                    {doc.status === "READY" && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-200/50">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span>Sẵn sàng</span>
                      </span>
                    )}
                    {doc.status === "PROCESSING" && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-medium border border-amber-200/50">
                        <span className="material-symbols-outlined text-[14px] animate-spin">progress_activity</span>
                        <span>Đang xử lý (45%)</span>
                      </span>
                    )}
                    {doc.status === "FAILED" && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 text-red-700 text-xs font-medium border border-red-200/50">
                        <span className="material-symbols-outlined text-[14px]">warning</span>
                        <span>Thất bại (Lỗi OCR)</span>
                      </span>
                    )}
                  </td>

                  <td className="py-3 px-4 font-mono text-xs text-slate-600 whitespace-nowrap">
                    {doc.uploadDate}
                  </td>

                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => onOpenDrawer(doc)}
                        className="p-1.5 rounded text-slate-400 hover:text-indigo-600 hover:bg-slate-100 transition-colors cursor-pointer"
                        title="Xem chi tiết"
                      >
                        <span className="material-symbols-outlined text-[18px]">visibility</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onOpenDeleteModal(doc)}
                        className="p-1.5 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                        title="Xóa tài liệu"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="px-4 py-3 bg-slate-50/80 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
        <span>
          Hiển thị {total > 0 ? (currentPage - 1) * pageSize + 1 : 0} -{" "}
          {Math.min(currentPage * pageSize, total)} trong tổng số {total} tài liệu
        </span>

        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={total}
          onChange={onPageChange}
          showSizeChanger
          pageSizeOptions={["5", "10", "20", "50"]}
          size="small"
        />
      </div>
    </div>
  );
};