import React from "react";
import type { DocumentStatus, DocumentItem } from "../../../../types/adminDocument";

interface DocumentFilterBarProps {
  statusFilter: DocumentStatus | "ALL";
  setStatusFilter: (status: DocumentStatus | "ALL") => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  capacityFilter: string;
  setCapacityFilter: (cap: string) => void;
  documents: DocumentItem[];
  onReset: () => void;
}

export const DocumentFilterBar: React.FC<DocumentFilterBarProps> = ({
  statusFilter,
  setStatusFilter,
  searchTerm,
  setSearchTerm,
  capacityFilter,
  setCapacityFilter,
  documents,
  onReset,
}) => {
  const readyCount = documents.filter((d) => d.status === "READY").length;
  const processingCount = documents.filter((d) => d.status === "PROCESSING").length;
  const failedCount = documents.filter((d) => d.status === "FAILED").length;

  return (
    <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
      {/* Segmented Filter Group */}
      <div className="flex items-center bg-slate-100/80 p-1 rounded-lg overflow-x-auto select-none border border-slate-200/50">
        <button
          type="button"
          onClick={() => setStatusFilter("ALL")}
          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            statusFilter === "ALL"
              ? "font-bold bg-white text-indigo-600 shadow-xs"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <span>Tất cả</span>
          <span className={`px-1.5 py-0.5 rounded-full text-[11px] font-bold ${
            statusFilter === "ALL" ? "bg-indigo-50 text-indigo-600" : "bg-slate-200/70 text-slate-700"
          }`}>
            {documents.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter("READY")}
          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            statusFilter === "READY"
              ? "font-bold bg-white text-emerald-700 shadow-xs"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>Sẵn sàng</span>
          <span className="px-1.5 py-0.5 rounded-full bg-slate-200/70 text-slate-700 text-[11px]">
            {readyCount}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter("PROCESSING")}
          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            statusFilter === "PROCESSING"
              ? "font-bold bg-white text-amber-700 shadow-xs"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          <span>Đang xử lý</span>
          <span className="px-1.5 py-0.5 rounded-full bg-slate-200/70 text-slate-700 text-[11px]">
            {processingCount}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter("FAILED")}
          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            statusFilter === "FAILED"
              ? "font-bold bg-white text-red-600 shadow-xs"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-red-500" />
          <span>Thất bại</span>
          <span className="px-1.5 py-0.5 rounded-full bg-slate-200/70 text-slate-700 text-[11px]">
            {failedCount}
          </span>
        </button>
      </div>

      {/* Search & Capacity Filters */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <div className="relative flex-1">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
            search
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm kiếm tên tài liệu, chủ sở hữu, email..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-900 text-xs rounded-lg outline-none transition-all placeholder:text-slate-400"
          />
        </div>

        <div className="relative shrink-0">
          <select
            value={capacityFilter}
            onChange={(e) => setCapacityFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-medium rounded-lg pl-3 pr-8 py-2 outline-none cursor-pointer appearance-none hover:bg-slate-100 transition-colors"
          >
            <option value="">Dung lượng</option>
            <option value="small">&lt; 10 MB</option>
            <option value="medium">10 - 50 MB</option>
            <option value="large">&gt; 50 MB</option>
          </select>
          <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 text-[16px] pointer-events-none">
            expand_more
          </span>
        </div>

        <button
          type="button"
          onClick={onReset}
          title="Làm mới bộ lọc"
          className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-indigo-600 transition-colors cursor-pointer shrink-0"
        >
          <span className="material-symbols-outlined text-[20px]">refresh</span>
        </button>
      </div>
    </div>
  );
};