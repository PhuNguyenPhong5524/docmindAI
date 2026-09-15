// Bento widgets giám sát Vector DB & Cache
import React from 'react';

interface RagTelemetryCardsProps {
  onClearCache: () => void;
}

export const RagTelemetryCards: React.FC<RagTelemetryCardsProps> = ({ onClearCache }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col justify-between">
        <div className="flex items-center justify-between pb-2">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-indigo-600 text-[20px]">hub</span>
            <span className="text-sm font-semibold text-slate-800">Mật độ Vector Embeddings</span>
          </div>
          <span className="text-xs font-mono text-slate-400">Qdrant Vector DB</span>
        </div>
        <p className="text-xs text-slate-500 my-2">
          Phân bố tài liệu tham chiếu theo nhóm chủ đề: Pháp quy đào tạo (58%), Hợp đồng & Pháp lý (24%), Tài chính (18%).
        </p>
        <div className="w-full bg-slate-100 rounded-full h-2.5 flex overflow-hidden">
          <div className="bg-indigo-600 h-full" style={{ width: '58%' }} title="Đào tạo 58%" />
          <div className="bg-indigo-400 h-full" style={{ width: '24%' }} title="Pháp lý 24%" />
          <div className="bg-sky-500 h-full" style={{ width: '18%' }} title="Tài chính 18%" />
        </div>
        <div className="flex items-center justify-between mt-3 text-[11px] font-mono text-slate-500">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-indigo-600" /> Đào tạo</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-indigo-400" /> Pháp lý</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-sky-500" /> Tài chính</span>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col justify-between">
        <div className="flex items-center justify-between pb-2">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-purple-600 text-[20px]">auto_fix_high</span>
            <span className="text-sm font-semibold text-slate-800">Tối ưu bộ nhớ đệm (Cache)</span>
          </div>
          <span className="text-xs text-emerald-600 font-semibold font-mono">92% Hit Ratio</span>
        </div>
        <p className="text-xs text-slate-500 my-2">
          Các đoạn trích dẫn lặp lại được gom cụm lưu trên Redis, giúp tăng tốc độ phản hồi RAG thêm 350ms.
        </p>
        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-slate-400">Bộ nhớ đã dùng: 284 MB</span>
          <button
            type="button"
            onClick={onClearCache}
            className="px-3 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
          >
            Dọn dẹp Cache
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col justify-between">
        <div className="flex items-center justify-between pb-2">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-indigo-500 text-[20px]">stream</span>
            <span className="text-sm font-semibold text-slate-800">Socket.IO Heartbeat</span>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">
            Healthy
          </span>
        </div>
        <div className="flex flex-col gap-1 text-xs font-mono text-slate-500 my-1">
          <div className="flex justify-between">
            <span>Transport:</span>
            <span className="text-slate-800 font-medium">WebSocket (WSS)</span>
          </div>
          <div className="flex justify-between">
            <span>Server:</span>
            <span className="text-slate-800 font-medium">node-ai-rag-worker-01</span>
          </div>
          <div className="flex justify-between">
            <span>Uptime:</span>
            <span className="text-slate-800 font-medium">18 ngày, 4 giờ</span>
          </div>
        </div>
        <div className="pt-2">
          <a href="#" className="text-indigo-600 text-xs font-semibold hover:underline flex items-center gap-1">
            <span>Kiểm tra nhật ký hệ thống</span>
            <span className="material-symbols-outlined text-[14px]">north_east</span>
          </a>
        </div>
      </div>
    </div>
  );
};