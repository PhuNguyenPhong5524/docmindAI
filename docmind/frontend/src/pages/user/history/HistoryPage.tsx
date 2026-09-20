import { useEffect, useMemo, useRef, useState } from "react";
import { Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import type { InputRef } from "antd";

import { NotificationDrawer } from "./components/NotificationDrawer";
import type { NotificationItem } from "./components/NotificationDrawer";
import { MetricRibbon } from "./components/MetricRibbon";
import { HistoryToolbar } from "./components/HistoryToolbar";
import { HistoryTable } from "./components/HistoryTable";
import type { SessionItem } from "./components/HistoryTable";
import { RagTelemetryCards } from "./components/RagTelemetryCards";
import {
  useDeleteHistorySession,
  useMarkAllNotificationsRead,
  useUserHistory,
  useUserNotifications,
} from "../../../hooks/user/useHistory";
import type { HistorySession, NotificationResponseItem } from "../../../types/history";

const formatRelativeTime = (value?: string) => {
  if (!value) return "Chưa cập nhật";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Chưa cập nhật";

  const diffSeconds = Math.max(0, Math.floor((Date.now() - date.getTime()) / 1000));
  if (diffSeconds < 60) return "Vừa xong";
  if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)} phút trước`;
  if (diffSeconds < 86400) return `${Math.floor(diffSeconds / 3600)} giờ trước`;
  if (diffSeconds < 604800) return `${Math.floor(diffSeconds / 86400)} ngày trước`;
  return date.toLocaleDateString("vi-VN");
};

const formatFullTime = (value?: string) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

const getSessionIcon = (session: HistorySession) => {
  if (session.document_status === "FAILED") return "warning";
  if (session.document_status === "PROCESSING") return "sync";
  if (session.last_role === "ai") return "psychology";
  return "forum";
};

const buildSessionTitle = (session: HistorySession) => {
  const label = session.last_role === "user" ? "Câu hỏi gần nhất" : "Phản hồi gần nhất";
  return `${label}: ${session.document_name}`;
};

const toSessionItem = (session: HistorySession): SessionItem => ({
  id: session.id,
  title: buildSessionTitle(session),
  summary: session.last_content,
  document: session.document_name,
  messageCount: session.message_count,
  timeAgo: formatRelativeTime(session.last_active_at),
  fullTime: formatFullTime(session.last_active_at),
  icon: getSessionIcon(session),
  createdAt: session.last_active_at,
});

const notificationTypeMap: Record<NotificationResponseItem["type"], NotificationItem["type"]> = {
  SUCCESS: "success",
  INFO: "system",
  WARNING: "processing",
  ERROR: "error",
};

const toNotificationItem = (item: NotificationResponseItem): NotificationItem => ({
  id: item._id,
  type: notificationTypeMap[item.type] || "system",
  title: item.title,
  message: item.message,
  time: formatRelativeTime(item.createdAt),
  statusTag: item.type,
  read: item.is_read,
});

const downloadCSV = (rows: SessionItem[]) => {
  const headers = ["Document ID", "Tài liệu", "Tóm tắt", "Số tin", "Lần hỏi cuối"];
  const csvRows = rows.map((row) => [
    row.id,
    `"${row.document.replaceAll('"', '""')}"`,
    `"${row.summary.replaceAll('"', '""')}"`,
    row.messageCount,
    row.createdAt,
  ]);
  const content = "\uFEFF" + [headers.join(","), ...csvRows.map((row) => row.join(","))].join("\n");
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `docmind_history_${Date.now()}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const HistoryPage = () => {
  const navigate = useNavigate();
  const searchInputRef = useRef<InputRef>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  const [selectedDoc, setSelectedDoc] = useState("");

  const historyQuery = useUserHistory();
  const notificationsQuery = useUserNotifications();
  const deleteSessionMutation = useDeleteHistorySession();
  const markAllReadMutation = useMarkAllNotificationsRead();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const sessions = useMemo(
    () => (historyQuery.data?.data.sessions || []).map(toSessionItem),
    [historyQuery.data]
  );

  const notifications = useMemo(
    () => (notificationsQuery.data?.data || []).map(toNotificationItem),
    [notificationsQuery.data]
  );

  const documentOptions = useMemo(() => {
    return Array.from(new Set(sessions.map((s) => s.document)));
  }, [sessions]);

  const filteredSessions = useMemo(() => {
    return sessions.filter((session) => {
      const normalizedSearch = searchText.trim().toLowerCase();
      const matchSearch = normalizedSearch
        ? session.title.toLowerCase().includes(normalizedSearch) ||
          session.summary.toLowerCase().includes(normalizedSearch) ||
          session.document.toLowerCase().includes(normalizedSearch)
        : true;

      const matchDoc = selectedDoc ? session.document === selectedDoc : true;
      const createdDate = new Date(session.createdAt);
      const now = new Date();
      let matchDate = true;

      if (dateFilter === "today") {
        matchDate = createdDate.toDateString() === now.toDateString();
      } else if (dateFilter === "7days") {
        matchDate = now.getTime() - createdDate.getTime() <= 7 * 24 * 3600 * 1000;
      } else if (dateFilter === "30days") {
        matchDate = now.getTime() - createdDate.getTime() <= 30 * 24 * 3600 * 1000;
      }

      return matchSearch && matchDoc && matchDate;
    });
  }, [sessions, searchText, selectedDoc, dateFilter]);

  const metrics = historyQuery.data?.data.metrics;
  const unreadNotificationCount = notificationsQuery.data?.unread_count || 0;

  const handleDeleteSession = async (id: string) => {
    try {
      await deleteSessionMutation.mutateAsync(id);
      message.success("Đã xóa lịch sử hội thoại");
    } catch {
      message.error("Không thể xóa lịch sử hội thoại");
    }
  };

  const handleOpenChat = (id: string) => {
    navigate("/chat", { state: { documentId: id } });
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllReadMutation.mutateAsync();
      message.success("Đã đánh dấu tất cả thông báo là đã đọc");
    } catch {
      message.error("Không thể cập nhật thông báo");
    }
  };

  const handleRetryNotification = (_id: string) => {
    message.info("Vui lòng tải lại hoặc upload lại tài liệu tại trang Tài liệu.");
  };

  const handleClearCache = () => {
    historyQuery.refetch();
    notificationsQuery.refetch();
    message.success("Đã làm mới dữ liệu lịch sử");
  };

  const handleResetFilters = () => {
    setSearchText("");
    setDateFilter("all");
    setSelectedDoc("");
    message.info("Đã làm mới bộ lọc");
  };

  const handleExportCSV = () => {
    if (filteredSessions.length === 0) {
      message.warning("Không có dữ liệu để xuất CSV");
      return;
    }
    downloadCSV(filteredSessions);
    message.success("Đã xuất CSV lịch sử hội thoại");
  };

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
            Xem lại lịch sử hỏi đáp theo tài liệu và các thông báo xử lý thuộc tài khoản của bạn.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden sm:flex items-center gap-3 bg-white px-3 py-2 rounded-lg shadow-sm border border-slate-100">
            <div className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-ping" />
            <div className="flex flex-col text-left">
              <span className="text-xs font-semibold text-slate-700">Socket.IO Live</span>
              <span className="text-[11px] font-mono text-slate-400">Realtime ready</span>
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

      {historyQuery.isError && (
        <div className="bg-red-50 border border-red-100 text-red-700 rounded-xl p-4 text-sm flex items-center justify-between">
          <span>Không tải được lịch sử hội thoại.</span>
          <Button size="small" danger onClick={() => historyQuery.refetch()}>Thử lại</Button>
        </div>
      )}

      <MetricRibbon
        metrics={{
          totalSessions: metrics?.total_sessions || 0,
          queriedDocs: metrics?.queried_docs || 0,
          totalMessages: metrics?.total_messages || 0,
          accuracy: metrics?.citation_rate || 0,
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
        onExportCSV={handleExportCSV}
        loading={historyQuery.isLoading || deleteSessionMutation.isPending}
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
};

export default HistoryPage;
