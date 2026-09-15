import React from 'react';
import { FolderOpenOutlined, FilePdfOutlined, ArrowRightOutlined } from '@ant-design/icons';

interface DocItem {
  id: string;
  fileName: string;
  uploader: string;
  size: string;
  status: 'ready' | 'processing' | 'failed';
  statusText: string;
  time: string;
}

const docs: DocItem[] = [
  { id: '1', fileName: 'Bao_cao_tai_chinh_2024.pdf', uploader: 'Trần Bảo Ngọc', size: '4.8 MB · 64 tr', status: 'ready', statusText: 'Sẵn sàng', time: '25 phút trước' },
  { id: '2', fileName: 'Giao_trinh_Hoc_Sau_v2.pdf', uploader: 'Lê Hoàng Nam', size: '18.2 MB · 210 tr', status: 'processing', statusText: 'Đang xử lý', time: '1 giờ trước' },
  { id: '3', fileName: 'Hop_dong_thuong_mai_QT.pdf', uploader: 'Đỗ Thanh Thảo', size: '2.1 MB · 18 tr', status: 'ready', statusText: 'Sẵn sàng', time: '3 giờ trước' },
  { id: '4', fileName: 'Scan_chung_tu_bi_loi.pdf', uploader: 'Vũ Minh Quân', size: '32.0 MB · 45 tr', status: 'failed', statusText: 'Thất bại', time: 'Hôm qua' },
];

export const RecentDocumentsTable: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col h-full overflow-hidden">
      <div className="px-5 py-4 flex items-center justify-between border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-2">
          <FolderOpenOutlined className="text-indigo-600 text-base" />
          <h3 className="text-base font-bold text-slate-800">Tài liệu gần đây</h3>
        </div>
        <button className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer">
          <span>Xem tất cả</span>
          <ArrowRightOutlined className="text-[10px]" />
        </button>
      </div>

      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50/80 text-slate-400 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-100">
            <tr>
              <th scope="col" className="py-3 px-4">Tài liệu</th>
              <th scope="col" className="py-3 px-3">Người tải</th>
              <th scope="col" className="py-3 px-3">Quy mô</th>
              <th scope="col" className="py-3 px-3">Trạng thái</th>
              <th scope="col" className="py-3 px-4 text-right">Thời gian</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {docs.map((doc) => (
              <tr key={doc.id} className="hover:bg-slate-50/60 transition-colors">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded bg-rose-50 flex items-center justify-center text-rose-500 shrink-0 border border-rose-100">
                      <FilePdfOutlined className="text-sm" />
                    </div>
                    <span className="font-semibold text-slate-800 truncate max-w-[170px]" title={doc.fileName}>
                      {doc.fileName}
                    </span>
                  </div>
                </td>
                <td className="py-3 px-3 text-slate-600 font-medium">{doc.uploader}</td>
                <td className="py-3 px-3 font-mono text-slate-400">{doc.size}</td>
                <td className="py-3 px-3">
                  {doc.status === 'ready' && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" /> {doc.statusText}
                    </span>
                  )}
                  {doc.status === 'processing' && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-100">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse shrink-0" /> {doc.statusText}
                    </span>
                  )}
                  {doc.status === 'failed' && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-100">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" /> {doc.statusText}
                    </span>
                  )}
                </td>
                <td className="py-3 px-4 text-right text-slate-400 text-[11px]">{doc.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentDocumentsTable;