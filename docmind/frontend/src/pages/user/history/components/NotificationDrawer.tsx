// Drawer thông báo sự kiện Socket.IO Realtime
import React from 'react';
import { Drawer, Button, Progress } from 'antd';

export interface NotificationItem {
  id: string;
  type: 'success' | 'processing' | 'error' | 'system';
  title: string;
  message: string;
  time: string;
  statusTag?: string;
  read: boolean;
  progress?: number;
}

interface NotificationDrawerProps {
  open: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAllRead: () => void;
  onRetry: (id: string) => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  open,
  onClose,
  notifications,
  onMarkAllRead,
  onRetry,
}) => {
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <Drawer
      title={
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[20px]">notifications_active</span>
          </div>
          <div className="flex flex-col min-w-0">
            <h2 className="text-base font-bold text-slate-800 truncate">Thông báo hệ thống</h2>
            <span className="text-xs text-indigo-600 flex items-center gap-1 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Socket.IO Realtime
            </span>
          </div>
        </div>
      }
      placement="right"
      width={440}
      onClose={onClose}
      open={open}
      extra={
        <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full font-bold">
          {unreadCount} mới
        </span>
      }
      footer={
        <div className="flex items-center justify-between py-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-xs text-slate-600">Tự động làm mới qua WebSockets</span>
          </div>
          <Button onClick={onClose} size="small">
            Đóng
          </Button>
        </div>
      }
    >
      <div className="flex items-center justify-between pb-4 mb-3 border-b border-slate-100">
        <span className="text-xs font-medium text-slate-500">Sự kiện xử lý tài liệu</span>
        <button
          type="button"
          onClick={onMarkAllRead}
          disabled={unreadCount === 0}
          className={`text-xs text-indigo-600 hover:text-indigo-800 font-semibold transition-colors flex items-center gap-1 ${
            unreadCount === 0 ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">done_all</span>
          <span>Đánh dấu tất cả đã đọc</span>
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {notifications.map((item) => (
          <div
            key={item.id}
            className={`relative p-3.5 rounded-xl transition-all flex items-start gap-3 shadow-sm border-l-4 ${
              item.type === 'success'
                ? 'bg-slate-50 border-l-emerald-500'
                : item.type === 'processing'
                ? 'bg-white border-l-indigo-500 border border-slate-100'
                : item.type === 'error'
                ? 'bg-red-50/60 border-l-red-500'
                : 'bg-white border-l-purple-500 border border-slate-100'
            }`}
          >
            <div className="mt-0.5 shrink-0">
              {item.type === 'success' && (
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">check_circle</span>
                </div>
              )}
              {item.type === 'processing' && (
                <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px] animate-spin">sync</span>
                </div>
              )}
              {item.type === 'error' && (
                <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">warning</span>
                </div>
              )}
              {item.type === 'system' && (
                <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">neurology</span>
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1">
                <span className="text-sm font-bold text-slate-800">{item.title}</span>
                {!item.read && <span className="w-2 h-2 rounded-full bg-indigo-600 shrink-0" />}
              </div>
              <p className="text-xs text-slate-600 mt-1">{item.message}</p>

              {item.type === 'processing' && item.progress !== undefined && (
                <div className="mt-2">
                  <Progress percent={item.progress} size="small" status="active" />
                </div>
              )}

              <div className="flex items-center justify-between mt-2 pt-1 text-[11px] text-slate-400">
                <span>{item.time}</span>
                {item.statusTag && (
                  <span className="px-1.5 py-0.5 rounded bg-slate-100 font-mono font-medium text-slate-700">
                    {item.statusTag}
                  </span>
                )}
                {item.type === 'error' && (
                  <button
                    type="button"
                    onClick={() => onRetry(item.id)}
                    className="text-red-600 font-semibold hover:underline flex items-center gap-0.5"
                  >
                    <span>Thử lại</span>
                    <span className="material-symbols-outlined text-[13px]">refresh</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Drawer>
  );
};