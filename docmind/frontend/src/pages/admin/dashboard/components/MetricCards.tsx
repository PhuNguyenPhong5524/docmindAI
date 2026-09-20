import React, { useState, useEffect } from 'react';

const MetricCards: React.FC = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalDocs, setTotalDocs] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token") || localStorage.getItem("accessToken") || "";
        const headers = { "Authorization": `Bearer ${token}` };

        // Gọi API đếm tổng User
        const userRes = await fetch("http://localhost:8080/api/admin/users", { headers });
        const userData = await userRes.json();
        if (Array.isArray(userData)) setTotalUsers(userData.length);

        // Gọi API đếm tổng Tài liệu
        const docRes = await fetch("http://localhost:8080/api/documents", { headers });
        const docData = await docRes.json();
        if (docData.success && Array.isArray(docData.data)) setTotalDocs(docData.data.length);
      } catch (error) {
        console.error("Lỗi lấy dữ liệu Dashboard:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-center">
        <span className="text-sm font-medium text-slate-500 mb-1">Tổng người dùng</span>
        <span className="text-3xl font-bold text-slate-900">{totalUsers}</span>
      </div>
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-center">
        <span className="text-sm font-medium text-slate-500 mb-1">Tổng tài liệu</span>
        <span className="text-3xl font-bold text-slate-900">{totalDocs}</span>
      </div>
    </div>
  );
};

export default MetricCards;