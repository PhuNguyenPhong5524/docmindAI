import React from "react";
import { Button, Popconfirm, Table, Tag, Tooltip } from "antd";
import type { ColumnsType } from "antd/es/table";

export interface SessionItem {
  id: string;
  title: string;
  summary: string;
  document: string;
  messageCount: number;
  timeAgo: string;
  fullTime: string;
  icon?: string;
  createdAt: string;
}

interface HistoryTableProps {
  dataSource: SessionItem[];
  onDeleteSession: (id: string) => void;
  onOpenChat: (id: string) => void;
  onExportCSV: () => void;
  loading?: boolean;
}

export const HistoryTable: React.FC<HistoryTableProps> = ({
  dataSource,
  onDeleteSession,
  onOpenChat,
  onExportCSV,
  loading = false,
}) => {
  const columns: ColumnsType<SessionItem> = [
    {
      title: "Cuộc trò chuyện",
      dataIndex: "title",
      key: "title",
      render: (text: string, record: SessionItem) => (
        <div className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 shrink-0 group-hover:scale-105 transition-transform">
            <span className="material-symbols-outlined text-[20px]">{record.icon || "forum"}</span>
          </div>
          <div className="flex flex-col min-w-0">
            <span
              onClick={() => onOpenChat(record.id)}
              className="font-semibold text-sm text-slate-800 hover:text-indigo-600 cursor-pointer transition-colors truncate"
            >
              {text}
            </span>
            <span className="text-xs text-slate-400 truncate">{record.summary}</span>
          </div>
        </div>
      ),
    },
    {
      title: "Tài liệu tham chiếu",
      dataIndex: "document",
      key: "document",
      width: 240,
      render: (docName: string) => (
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-100 text-slate-700 font-mono text-xs max-w-full">
          <span className="material-symbols-outlined text-[16px] text-red-500">picture_as_pdf</span>
          <span className="truncate max-w-[180px]" title={docName}>
            {docName}
          </span>
        </div>
      ),
    },
    {
      title: "Số tin",
      dataIndex: "messageCount",
      key: "messageCount",
      align: "center",
      width: 100,
      render: (count: number) => (
        <Tag color="purple" className="rounded-full px-2.5 py-0.5 border-none font-semibold text-xs">
          {count}
        </Tag>
      ),
    },
    {
      title: "Lần hỏi cuối",
      dataIndex: "lastActive",
      key: "lastActive",
      width: 160,
      render: (_, record: SessionItem) => (
        <div className="flex flex-col">
          <span className="text-xs font-medium text-slate-700">{record.timeAgo}</span>
          <span className="text-[11px] font-mono text-slate-400">{record.fullTime}</span>
        </div>
      ),
    },
    {
      title: "Thao tác",
      key: "actions",
      align: "right",
      width: 180,
      render: (_, record: SessionItem) => (
        <div className="flex items-center justify-end gap-2">
          <Button
            type="primary"
            size="small"
            className="bg-indigo-600 hover:bg-indigo-700 text-xs flex items-center gap-1 rounded-md"
            onClick={() => onOpenChat(record.id)}
          >
            <span>Mở trò chuyện</span>
            <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
          </Button>

          <Popconfirm
            title="Xóa phiên hội thoại"
            description="Bạn có chắc chắn muốn xóa lịch sử hội thoại này?"
            onConfirm={() => onDeleteSession(record.id)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Tooltip title="Xóa cuộc trò chuyện">
              <Button
                type="text"
                danger
                size="small"
                icon={<span className="material-symbols-outlined text-[18px]">delete</span>}
              />
            </Tooltip>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-800 text-sm">Danh sách phiên hội thoại RAG</span>
          <span className="text-xs text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded font-medium">
            {dataSource.length} phiên hiển thị
          </span>
        </div>
        <button type="button" onClick={onExportCSV} className="hover:text-indigo-600 flex items-center gap-1 transition-colors text-xs text-slate-500">
          <span className="material-symbols-outlined text-[16px]">file_download</span> Xuất CSV
        </button>
      </div>

      <Table<SessionItem>
        dataSource={dataSource}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={{
          pageSize: 5,
          showSizeChanger: false,
          showTotal: (total, range) => (
            <span className="text-xs text-slate-500">
              Hiển thị <strong>{range[0]} - {range[1]}</strong> trong <strong>{total}</strong> cuộc trò chuyện
            </span>
          ),
        }}
        scroll={{ x: 900 }}
      />
    </div>
  );
};
