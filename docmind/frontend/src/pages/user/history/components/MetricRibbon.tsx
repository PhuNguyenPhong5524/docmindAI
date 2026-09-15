// Các thẻ thống kê chỉ số RAG (Total, Accuracy...)
import React from 'react';

export interface MetricData {
  totalSessions: number;
  queriedDocs: number;
  totalMessages: number;
  accuracy: number;
}

interface MetricRibbonProps {
  metrics: MetricData;
}

export const MetricRibbon: React.FC<MetricRibbonProps> = ({ metrics }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-xs font-medium text-slate-500">Tổng số phiên hỏi</span>
          <span className="text-2xl font-bold text-slate-800 mt-1">{metrics.totalSessions}</span>
          <span className="text-xs text-indigo-600 font-mono flex items-center gap-1 mt-1">
            <span className="material-symbols-outlined text-[14px]">arrow_upward</span> +18.4% tuần này
          </span>
        </div>
        <div className="w-11 h-11 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
          <span className="material-symbols-outlined text-[24px]">forum</span>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-xs font-medium text-slate-500">Tài liệu đã truy vấn</span>
          <span className="text-2xl font-bold text-slate-800 mt-1">{metrics.queriedDocs} PDF</span>
          <span className="text-xs text-slate-400 font-mono mt-1">4.2GB dung lượng vector</span>
        </div>
        <div className="w-11 h-11 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
          <span className="material-symbols-outlined text-[24px]">source</span>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-xs font-medium text-slate-500">Tổng tin nhắn RAG</span>
          <span className="text-2xl font-bold text-slate-800 mt-1">{metrics.totalMessages}</span>
          <span className="text-xs text-indigo-600 font-mono mt-1">Avg. 9.1 msgs / session</span>
        </div>
        <div className="w-11 h-11 rounded-lg bg-sky-50 flex items-center justify-center text-sky-600">
          <span className="material-symbols-outlined text-[24px]">chat_bubble</span>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-xs font-medium text-slate-500">Độ chính xác truy vấn</span>
          <span className="text-2xl font-bold text-slate-800 mt-1">{metrics.accuracy}%</span>
          <span className="text-xs text-emerald-600 font-mono mt-1">Vector Cosine &gt; 0.88</span>
        </div>
        <div className="w-11 h-11 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
          <span className="material-symbols-outlined text-[24px]">verified</span>
        </div>
      </div>
    </div>
  );
};