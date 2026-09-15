import React from 'react';
import {
  CheckCircleOutlined,
  SyncOutlined,
  WarningOutlined,
} from '@ant-design/icons';

export const PipelineStatus: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-5">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-600"></span>
            </span>
            <h2 className="text-lg font-bold text-slate-900">Trạng thái xử lý tài liệu &amp; Pipeline RAG</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Đánh chỉ mục Embedding text-embedding-3-small, OCR đa lớp &amp; lưu trữ Milvus VectorDB
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Sẵn sàng: 318 (93.0%)
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-100">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-spin" />
            Đang xử lý: 16 (4.7%)
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-100">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            Thất bại: 8 (2.3%)
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full space-y-2">
        <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex p-0.5">
          <div className="h-full bg-emerald-500 rounded-l-full transition-all duration-500" style={{ width: '93.0%' }} title="READY: 318" />
          <div className="h-full bg-amber-500 mx-0.5 transition-all duration-500" style={{ width: '4.7%' }} title="PROCESSING: 16" />
          <div className="h-full bg-rose-500 rounded-r-full transition-all duration-500" style={{ width: '2.3%' }} title="FAILED: 8" />
        </div>
        <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 font-medium pt-1">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-emerald-500 inline-block" /> READY (318 Docs)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-amber-500 inline-block" /> PROCESSING (16 Ingesting)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-rose-500 inline-block" /> FAILED (8 Requires OCR Review)
            </span>
          </div>
          <span className="font-mono text-slate-600">Tổng: 342 tệp (100%)</span>
        </div>
      </div>

      {/* Health Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
        <div className="flex items-center gap-3 p-3 bg-slate-50/80 rounded-xl border border-slate-100">
          <div className="w-9 h-9 rounded-lg bg-emerald-100/80 flex items-center justify-center text-emerald-600 shrink-0">
            <CheckCircleOutlined className="text-lg" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-bold text-slate-800 truncate">Tỉ lệ hoàn tất Vector hóa</span>
            <span className="text-[11px] text-slate-500 truncate">93.0% thông suốt hoàn hảo</span>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-slate-50/80 rounded-xl border border-slate-100">
          <div className="w-9 h-9 rounded-lg bg-amber-100/80 flex items-center justify-center text-amber-600 shrink-0">
            <SyncOutlined className="text-lg" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-bold text-slate-800 truncate">Hàng đợi chuyển ngữ Chunking</span>
            <span className="text-[11px] text-slate-500 truncate">16 tệp (~3.4 phút còn lại)</span>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-slate-50/80 rounded-xl border border-slate-100">
          <div className="w-9 h-9 rounded-lg bg-rose-100/80 flex items-center justify-center text-rose-600 shrink-0">
            <WarningOutlined className="text-lg" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-bold text-slate-800 truncate">Tài liệu lỗi định dạng</span>
            <span className="text-[11px] text-rose-600 font-medium truncate">8 tệp cần xử lý thủ công</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PipelineStatus;