import React from 'react';
import { ThunderboltOutlined } from '@ant-design/icons';

export interface MatrixItemProps {
  index: string;
  title: string;
  subtitle: string;
  tagText: string;
  tagType: 'error' | 'warning' | 'success';
  docA: { clause: string; content: React.ReactNode; page: number; chunk: string };
  docB: { clause: string; content: React.ReactNode; page: number; chunk: string };
  aiInsight: string;
}

export const MatrixCard: React.FC<MatrixItemProps> = ({
  index,
  title,
  subtitle,
  tagText,
  tagType,
  docA,
  docB,
  aiInsight,
}) => {
  const tagStyles = {
    error: 'bg-red-50 text-red-600 border-red-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    success: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  };

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <span className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 font-bold text-xs flex items-center justify-center">
            {index}
          </span>
          <div>
            <h3 className="text-base font-bold text-slate-800">{title}</h3>
            <span className="text-xs text-slate-500">{subtitle}</span>
          </div>
        </div>
        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full border text-xs font-semibold ${tagStyles[tagType]}`}>
          {tagText}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Doc A */}
        <div className="rounded-lg p-4 bg-slate-50 flex flex-col justify-between border border-slate-100">
          <div>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-semibold text-slate-400 uppercase">Tài liệu A · 2021</span>
              <span className="font-mono text-indigo-500">{docA.clause}</span>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed font-medium">{docA.content}</p>
          </div>
          <div className="mt-4 pt-2 flex items-center justify-between text-xs border-t border-slate-200/60">
            <span className="text-indigo-600 font-mono cursor-pointer hover:underline">
              Trích dẫn: Trang {docA.page} (PDF_2021)
            </span>
            <span className="text-slate-400 font-mono">{docA.chunk}</span>
          </div>
        </div>

        {/* Doc B */}
        <div className="rounded-lg p-4 bg-slate-50 flex flex-col justify-between border border-slate-100">
          <div>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-semibold text-indigo-600 uppercase">Tài liệu B · 2024</span>
              <span className="font-mono text-indigo-600 font-semibold">{docB.clause}</span>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed font-medium">{docB.content}</p>
          </div>
          <div className="mt-4 pt-2 flex items-center justify-between text-xs border-t border-slate-200/60">
            <span className="text-indigo-600 font-mono cursor-pointer hover:underline">
              Trích dẫn: Trang {docB.page} (PDF_2024)
            </span>
            <span className="text-slate-400 font-mono">{docB.chunk}</span>
          </div>
        </div>
      </div>

      <div className="mt-3 p-3 rounded-lg bg-indigo-50/50 text-slate-600 text-xs flex items-start gap-2 border border-indigo-100/50">
        <ThunderboltOutlined className="text-indigo-600 mt-0.5" />
        <div>
          <strong className="text-slate-800">Đánh giá tác động AI: </strong>
          {aiInsight}
        </div>
      </div>
    </div>
  );
};