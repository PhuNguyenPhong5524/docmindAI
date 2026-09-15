import React from 'react';
import { Tooltip } from 'antd';
import { SwapOutlined } from '@ant-design/icons';

export interface DocCardProps {
  label: string;
  type: 'A' | 'B';
  title: string;
  pages: number;
  size: string;
  chunks: number;
  uploadDate: string;
  badgeBg: string;
}

export const DocCard: React.FC<DocCardProps> = ({
  label,
  type,
  title,
  pages,
  size,
  chunks,
  uploadDate,
  badgeBg,
}) => (
  <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all">
    <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
      <div className="flex items-center gap-2">
        <span className={`w-6 h-6 rounded-md ${badgeBg} flex items-center justify-center text-xs font-bold`}>
          {type}
        </span>
        <span className="font-semibold text-slate-800 text-sm md:text-base">{label}</span>
      </div>
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 text-xs font-semibold">
        <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" /> READY
      </span>
    </div>

    <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
      <div className="w-10 h-12 rounded-lg bg-white shadow-sm flex flex-col items-center justify-center shrink-0 text-indigo-600 border border-slate-100">
        <span className="material-symbols-outlined text-xl">picture_as_pdf</span>
        <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">PDF</span>
      </div>
      <div className="flex flex-col min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-semibold text-slate-800 truncate" title={title}>
            {title}
          </p>
          <Tooltip title="Đổi tài liệu">
            <button className="text-slate-400 hover:text-indigo-600 transition-colors p-1">
              <SwapOutlined />
            </button>
          </Tooltip>
        </div>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 mt-1">
          <span>{pages} trang</span>
          <span>•</span>
          <span>{size}</span>
          <span>•</span>
          <span>{chunks} chunks</span>
        </div>
      </div>
    </div>

    <div className="flex items-center justify-between mt-3 pt-1 text-xs text-slate-400">
      <span>Ngày tải lên: {uploadDate}</span>
      <span className="text-indigo-600 font-medium cursor-pointer hover:underline">Xem văn bản</span>
    </div>
  </div>
);