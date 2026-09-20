import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const NewUsersList: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token") || localStorage.getItem("accessToken") || "";
        const res = await fetch("http://localhost:8080/api/admin/users", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const data = await res.json();
        if (Array.isArray(data)) {
          setUsers(data.slice(0, 5)); // Chỉ lấy 5 người mới nhất
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
          </span>
          Người dùng mới
        </h2>
        <Link to="/admin/users" className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 cursor-pointer">
          Xem tất cả →
        </Link>
      </div>
      <div className="flex-1 overflow-auto">
        <div className="space-y-4">
          {users.map((u, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold">
                  {u.name ? u.name.substring(0, 2).toUpperCase() : 'U'}
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">{u.name || 'Người dùng'}</p>
                  <p className="text-xs text-slate-500">{u.email}</p>
                </div>
              </div>
              <span className="text-[11px] font-medium text-slate-400 bg-slate-50 px-2 py-1 rounded-md">
                {u.status === 'ACTIVE' ? 'Hoạt động' : 'Đã khóa'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default NewUsersList;