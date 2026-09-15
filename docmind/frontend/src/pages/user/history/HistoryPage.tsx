import  { useState, useRef, useEffect, useMemo } from 'react';
import { message } from 'antd';
import type { InputRef } from 'antd';

import { NotificationDrawer } from './components/NotificationDrawer';
import type { NotificationItem } from './components/NotificationDrawer';
import { MetricRibbon } from './components/MetricRibbon';
import { HistoryToolbar } from './components/HistoryToolbar';
import { HistoryTable} from './components/HistoryTable';
import type { SessionItem } from './components/HistoryTable';
import { RagTelemetryCards } from './components/RagTelemetryCards';

const MOCK_SESSIONS: SessionItem[] = [
  {
    id: '1',
    title: 'Điều kiện xét tốt nghiệp',
    summary: 'Hỏi về chuẩn đầu ra tiếng Anh, chứng chỉ tin học và số tín chỉ tích lũy tối thiểu...',
    document: 'Quy_che_dao_tao_UIT.pdf',
    messageCount: 14,
    timeAgo: '10 phút trước',
    fullTime: '14:28:12 GMT+7',
    icon: 'school',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Hợp đồng nghiên cứu bảo mật NDA',
    summary: 'Trích xuất điều khoản phạt vi phạm bí mật thuật toán và thời hạn hiệu lực...',
    document: 'Hop_dong_nghien_cuu_AI.pdf',
    messageCount: 8,
    timeAgo: '2 giờ trước',
    fullTime: '12:35:44 GMT+7',
    icon: 'gavel',
    createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
  },
  {
    id: '3',
    title: 'Quy định tính điểm rèn luyện sinh viên',
    summary: 'Phân bổ điểm tiêu chí 1 đến tiêu chí 5 và mức trừ điểm khi vi phạm nề nếp...',
    document: 'Quy_che_UIT.pdf',
    messageCount: 22,
    timeAgo: 'Hôm qua',
    fullTime: '18:10:02 GMT+7',
    icon: 'military_tech',
    createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
  },
  {
    id: '4',
    title: 'Phân tích báo cáo kiểm toán tài chính',
    summary: 'So sánh EBITDA, tỷ lệ nợ ròng và đối chiếu bảng lưu chuyển tiền tệ quý 3...',
    document: 'Bao_cao_tai_chinh_Q3.pdf',
    messageCount: 6,
    timeAgo: '3 ngày trước',
    fullTime: '10:04:19 GMT+7',
    icon: 'analytics',
    createdAt: new Date(Date.now() - 72 * 3600 * 1000).toISOString(),
  },
];

const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n1',
    type: 'success',
    title: 'Tài liệu đã xử lý xong',
    message: 'Quy_che_dao_tao_UIT.pdf (48 trang) đã vector hóa thành công và sẵn sàng để hỏi đáp.',
    time: '5 phút trước',
    statusTag: 'status: INDEXED',
    read: false,
  },
  {
    id: 'n2',
    type: 'processing',
    title: 'Bắt đầu vector hóa tài liệu',
    message: 'Bao_cao_tai_chinh_Q3.pdf đang được trích xuất ngữ cảnh RAG (45%).',
    time: '20 phút trước',
    progress: 45,
    statusTag: 'chunk: 18/40',
    read: true,
  },
  {
    id: 'n3',
    type: 'error',
    title: 'Xử lý tài liệu thất bại',
    message: 'Không thể xử lý Scan_giao_trinh_cu.pdf do độ phân giải thấp, không thể OCR.',
    time: '1 giờ trước',
    read: false,
  },
  {
    id: 'n4',
    type: 'system',
    title: 'Cập nhật mô hình AI',
    message: 'DOCMIND AI đã nâng cấp engine RAG v2.4 tối ưu tốc độ trích dẫn gấp 2 lần.',
    time: '1 ngày trước',
    statusTag: 'v2.4.0-stable',
    read: true,
  },
];

const HistoryPage = () => {
  const searchInputRef = useRef<InputRef>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [sessions, setSessions] = useState<SessionItem[]>(MOCK_SESSIONS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(MOCK_NOTIFICATIONS);

  const [searchText, setSearchText] = useState<string>('');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [selectedDoc, setSelectedDoc] = useState<string>('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const documentOptions = useMemo(() => {
    return Array.from(new Set(MOCK_SESSIONS.map((s) => s.document)));
  }, []);

  const filteredSessions = useMemo(() => {
    return sessions.filter((session) => {
      const matchSearch =
        session.title.toLowerCase().includes(searchText.toLowerCase()) ||
        session.summary.toLowerCase().includes(searchText.toLowerCase()) ||
        session.document.toLowerCase().includes(searchText.toLowerCase());

      const matchDoc = selectedDoc ? session.document === selectedDoc : true;

      let matchDate = true;
      const createdDate = new Date(session.createdAt);
      const now = new Date();
      if (dateFilter === 'today') {
        matchDate = createdDate.toDateString() === now.toDateString();
      } else if (dateFilter === '7days') {
        matchDate = now.getTime() - createdDate.getTime() <= 7 * 24 * 3600 * 1000;
      } else if (dateFilter === '30days') {
        matchDate = now.getTime() - createdDate.getTime() <= 30 * 24 * 3600 * 1000;
      }

      return matchSearch && matchDoc && matchDate;
    });
  }, [sessions, searchText, selectedDoc, dateFilter]);

  const handleDeleteSession = (id: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
    message.success('Đã xóa phiên hội thoại thành công');
  };

  const handleOpenChat = (id: string) => {
    message.info(`Đang chuyển hướng tới phiên hội thoại #${id}`);
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    message.success('Đã đánh dấu tất cả thông báo là đã đọc');
  };

  const handleRetryNotification = (_id: string) => {
    message.loading('Đang gửi lại yêu cầu xử lý tài liệu...');
  };

  const handleClearCache = () => {
    message.success('Bộ nhớ đệm Redis đã được làm sạch');
  };

  const handleResetFilters = () => {
    setSearchText('');
    setDateFilter('all');
    setSelectedDoc('');
    message.info('Đã làm mới bộ lọc');
  };

  const unreadNotificationCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="p-6 md:p-8 bg-slate-50 min-h-screen flex flex-col gap-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex flex-col gap-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-widest text-indigo-700 font-bold px-2 py-0.5 rounded bg-indigo-100">
              Session Memory & Event Bus
            </span>
            <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Synced with RAG Engine
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            Lịch sử hội thoại & Trung tâm thông báo
          </h1>
          <p className="text-xs md:text-sm text-slate-500 max-w-3xl">
            Xem lại lịch sử các phiên hỏi đáp tài liệu và thông báo xử lý thời gian thực từ Socket.IO.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden sm:flex items-center gap-3 bg-white px-3 py-2 rounded-lg shadow-sm border border-slate-100">
            <div className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-ping" />
            <div className="flex flex-col text-left">
              <span className="text-xs font-semibold text-slate-700">Socket.IO Live</span>
              <span className="text-[11px] font-mono text-slate-400">Latency: 18ms</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsDrawerOpen(true)}
            className="relative flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-lg shadow-md hover:bg-indigo-700 transition-all text-xs font-semibold"
          >
            <span className="material-symbols-outlined text-[18px]">notifications_active</span>
            <span>Bảng sự kiện Realtime</span>
            {unreadNotificationCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-bold">
                {unreadNotificationCount} mới
              </span>
            )}
          </button>
        </div>
      </div>

      <MetricRibbon
        metrics={{
          totalSessions: 142,
          queriedDocs: 36,
          totalMessages: 1289,
          accuracy: 99.4,
        }}
      />

      <HistoryToolbar
        searchInputRef={searchInputRef}
        searchText={searchText}
        onSearchChange={setSearchText}
        dateFilter={dateFilter}
        onDateFilterChange={setDateFilter}
        selectedDoc={selectedDoc}
        onDocChange={setSelectedDoc}
        onResetFilters={handleResetFilters}
        documentOptions={documentOptions}
      />

      <HistoryTable
        dataSource={filteredSessions}
        onDeleteSession={handleDeleteSession}
        onOpenChat={handleOpenChat}
      />

      <RagTelemetryCards onClearCache={handleClearCache} />

      <NotificationDrawer
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        notifications={notifications}
        onMarkAllRead={handleMarkAllRead}
        onRetry={handleRetryNotification}
      />
    </div>
  );
}


export default HistoryPage;