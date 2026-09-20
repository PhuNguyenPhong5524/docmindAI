import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const RecentDocumentsTable: React.FC = () => {
  const [docs, setDocs] = useState<any[]>([]);

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/documents");
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          setDocs(data.data.slice(0, 5)); // Lấy 5 tài liệu gần nhất
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchDocs();
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
          </span>
          Tài liệu gần đây
        </h2>
        <Link to="/admin/documents" className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 cursor-pointer">
          Xem tất cả →
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 text-[11px] uppercase tracking-wider text-slate-500">
              <th className="pb-3 font-medium">Tài liệu</th>
              <th className="pb-3 font-medium">Kích thước</th>
              <th className="pb-3 font-medium">Trạng thái</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {docs.map((doc, i) => (
              <tr key={i} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                <td className="py-3 text-slate-800 font-medium truncate max-w-[250px]">{doc.original_name}</td>
                <td className="py-3 text-slate-500 text-xs">{(doc.size / (1024 * 1024)).toFixed(2)} MB</td>
                <td className="py-3">
                  <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-medium bg-emerald-50 text-emerald-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    Sẵn sàng
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default RecentDocumentsTable;