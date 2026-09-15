import React from "react";

interface DocumentHeaderProps {
  totalFiles: number;
  totalStorage: string;
  totalChunks: string;
}

export const DocumentHeader: React.FC<DocumentHeaderProps> = ({
  totalFiles,
  totalStorage,
  totalChunks,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-indigo-600 uppercase font-semibold tracking-wider">
            Storage &amp; RAG Pipeline
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
          <span className="text-xs text-slate-500">
            Cluster: ap-southeast-1
          </span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Quản lý tài liệu
        </h1>
        <p className="text-sm text-slate-500">
          Theo dõi tài liệu được người dùng tải lên hệ thống và giám sát tiến trình vector hóa Milvus.
        </p>
      </div>

      <div className="flex items-center gap-6 bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
            <span className="material-symbols-outlined text-[22px]">database</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-slate-500 font-medium">
              Vector Database
            </span>
            <span className="text-base font-bold text-slate-900">
              {totalFiles} Files / {totalStorage}
            </span>
          </div>
        </div>
        <div className="h-8 w-px bg-slate-200" />
        <div className="flex flex-col text-right">
          <span className="text-xs text-slate-500 font-medium">
            Milvus Chunks Indexed
          </span>
          <span className="text-base font-bold text-indigo-600">
            {totalChunks} Chunks
          </span>
        </div>
      </div>
    </div>
  );
};