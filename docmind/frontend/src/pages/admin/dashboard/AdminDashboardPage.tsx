import React, { useState, useCallback, useRef } from 'react';
import { ReloadOutlined, CloudUploadOutlined } from '@ant-design/icons';
import { message } from 'antd';
import MetricCards from './components/MetricCards';
import PipelineStatus from './components/PipelineStatus';
import NewUsersList from './components/NewUsersList';
import RecentDocumentsTable from './components/RecentDocumentsTable';
import InfraBanner from './components/InfraBanner';

export const AdminDashboardPage: React.FC = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleRefreshData = useCallback(() => {
    setIsRefreshing(true);
    window.location.reload(); // Tải lại trang để cập nhật toàn bộ component con
  }, []);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    if (file.type !== "application/pdf") {
      message.error("Hệ thống chỉ hỗ trợ file PDF!");
      return;
    }

    const formData = new FormData();
    formData.append("pdf_file", file);

    setIsUploading(true);
    message.loading({ content: `Đang tải lên ${file.name}...`, key: "upload-dash" });

    try {
      const token = localStorage.getItem("token") || localStorage.getItem("accessToken") || "";
      const response = await fetch("http://localhost:8080/api/documents/upload", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData
      });

      const result = await response.json();
      
      if (result.success) {
        message.success({ content: "Tải tài liệu thành công! Đang làm mới hệ thống...", key: "upload-dash" });
        setTimeout(() => window.location.reload(), 1000); // Tự động làm mới Dashboard để nhảy số
      } else {
        message.error({ content: result.message || "Tải lên thất bại", key: "upload-dash" });
      }
    } catch (error) {
      console.error(error);
      message.error({ content: "Lỗi kết nối máy chủ!", key: "upload-dash" });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto w-full">
      {/* Top Controls Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Dashboard</h1>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700">
            v2.4 Live
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white border border-slate-200 shadow-sm text-slate-600 text-sm font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>RAG Engine: 99.98% Up</span>
          </div>
          
          <button
            onClick={handleRefreshData}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors shadow-sm text-sm font-medium"
          >
            <ReloadOutlined className={isRefreshing ? 'animate-spin text-indigo-600' : 'text-slate-500'} />
            <span>Làm mới</span>
          </button>

          {/* Upload Button */}
          <div>
            <input 
              type="file" 
              accept=".pdf" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
            />
            <button
              onClick={handleUploadClick}
              disabled={isUploading}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium shadow-sm transition-all ${
                isUploading 
                  ? 'bg-indigo-400 cursor-not-allowed' 
                  : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow'
              }`}
            >
              <CloudUploadOutlined className={isUploading ? "animate-bounce text-sm" : "text-sm"} />
              <span>{isUploading ? "Đang tải..." : "Tải tài liệu"}</span>
            </button>
          </div>
        </div>
      </div>

      <MetricCards />
      <PipelineStatus />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5">
          <NewUsersList />
        </div>
        <div className="lg:col-span-7">
          <RecentDocumentsTable />
        </div>
      </div>

      <InfraBanner />
    </div>
  );
};

export default AdminDashboardPage;