import React from 'react';
import { DatabaseOutlined } from '@ant-design/icons';

export const InfraBanner: React.FC = () => {
  return (
    <div className="bg-indigo-50/50 rounded-2xl p-4 border border-indigo-100/80 flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-indigo-600 shadow-sm border border-indigo-100 shrink-0">
          <DatabaseOutlined className="text-xl" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-slate-900">Milvus Cluster &amp; Embedding Model v3</h4>
          <p className="text-xs text-slate-500 mt-0.5">
            Độ trễ trung bình vector query: 38ms · 128,400 chunks đã nhúng · Bộ nhớ đệm 84% khả dụng
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <span className="px-3 py-1 rounded-lg bg-white border border-slate-200 text-slate-600 font-mono text-xs shadow-sm">
          Index: HNSW_M16_EF64
        </span>
        <span className="px-3 py-1 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold">
          Synced
        </span>
      </div>
    </div>
  );
};

export default InfraBanner;