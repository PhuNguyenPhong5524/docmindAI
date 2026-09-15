import React, { useState, useCallback } from 'react';
import { ReloadOutlined, CloudUploadOutlined } from '@ant-design/icons';
import MetricCards from './components/MetricCards';
import PipelineStatus from './components/PipelineStatus';
import NewUsersList from './components/NewUsersList';
import RecentDocumentsTable from './components/RecentDocumentsTable';
import InfraBanner from './components/InfraBanner';

export const AdminDashboardPage: React.FC = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefreshData = useCallback(() => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 700);
  }, []);

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto w-full">
      {/* Top Controls Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Dashboard</h1>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-600 border border-indigo-100">
              v2.4 Live
            </span>
          </div>
          <p className="text-sm text-slate-500">
            Tổng quan hoạt động & chỉ số pipeline xử lý tài liệu DOCMIND AI
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* RAG Engine Status */}
          <div className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white border border-slate-200 shadow-sm text-slate-600 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>RAG Engine: 99.98% Up</span>
          </div>

          {/* Refresh Button */}
          <button
            onClick={handleRefreshData}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-medium shadow-sm transition-all active:scale-95 cursor-pointer"
          >
            <ReloadOutlined className={isRefreshing ? 'animate-spin text-indigo-600' : 'text-slate-500'} />
            <span>Làm mới</span>
          </button>

          {/* Upload Button */}
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 text-xs font-medium shadow-sm transition-all active:scale-95 cursor-pointer">
            <CloudUploadOutlined className="text-sm" />
            <span>Tải tài liệu</span>
          </button>
        </div>
      </div>

      {/* Primary Metric Cards */}
      <MetricCards />

      {/* Pipeline RAG Status */}
      <PipelineStatus />

      {/* Compact Lists & Tables Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5">
          <NewUsersList />
        </div>
        <div className="lg:col-span-7">
          <RecentDocumentsTable />
        </div>
      </div>

      {/* Infrastructure Health Banner */}
      <InfraBanner />
    </div>
  );
};

export default AdminDashboardPage;