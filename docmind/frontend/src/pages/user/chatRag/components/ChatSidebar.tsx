import React, { useMemo, useState } from 'react';
import { Input, Button, Badge, Empty } from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  MessageOutlined,
  SafetyCertificateOutlined
} from '@ant-design/icons';
import type { UserDocument } from '../../../../types/document';

interface ChatSidebarProps {
  activeId: string;
  onSelectChat: (id: string) => void;
  documents: UserDocument[];
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({
  activeId,
  onSelectChat,
  documents,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDocuments = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return documents;
    return documents.filter((doc) => doc.display_name.toLowerCase().includes(query));
  }, [documents, searchTerm]);

  return (
    <aside className="w-[260px] shrink-0 bg-white flex flex-col justify-between border-r border-gray-200 z-10 select-none">
      <div className="flex flex-col h-full min-h-0">
        <div className="p-3 pb-2">
          <Button
            type="primary"
            block
            icon={<PlusOutlined />}
            size="large"
            className="bg-indigo-600 hover:bg-indigo-700 font-semibold shadow-sm"
          >
            Cuộc trò chuyện mới
          </Button>
        </div>

        <div className="px-3 py-1.5">
          <Input
            prefix={<SearchOutlined className="text-gray-400" />}
            placeholder="Tìm tài liệu READY..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-gray-50 border-gray-200 rounded-lg text-xs"
          />
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-4">
          <div>
            <div className="px-2 py-1 text-[11px] font-semibold text-gray-400 uppercase tracking-wider flex items-center justify-between">
              <span>Tài liệu READY</span>
              <Badge count={filteredDocuments.length} size="small" />
            </div>
            <div className="mt-1 space-y-1">
              {filteredDocuments.map((doc) => (
                <button
                  key={doc._id}
                  type="button"
                  onClick={() => onSelectChat(doc._id)}
                  className={`w-full text-left p-2 rounded-lg cursor-pointer transition-all ${
                    activeId === doc._id ? 'bg-indigo-50 text-indigo-900 border border-indigo-100' : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1.5">
                    <div className="flex items-center gap-2 min-w-0">
                      <MessageOutlined className={activeId === doc._id ? 'text-indigo-600' : 'text-gray-400'} />
                      <span className="text-xs font-semibold truncate">{doc.display_name}</span>
                    </div>
                    <span className="text-[10px] bg-indigo-100 text-indigo-700 px-1 rounded font-mono shrink-0">{doc.total_pages || 0}p</span>
                  </div>
                  <div className="mt-1 flex items-center gap-1.5 text-[11px] text-gray-400 pl-5">
                    <span className="font-mono">READY</span>
                    <span>•</span>
                    <span className="truncate">{doc.original_name}</span>
                  </div>
                </button>
              ))}

              {filteredDocuments.length === 0 && (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Không có tài liệu READY" />
              )}
            </div>
          </div>
        </div>

        <div className="p-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SafetyCertificateOutlined className="text-indigo-600" />
            <span className="text-xs font-medium text-gray-700">User scoped RAG</span>
          </div>
          <span className="text-[10px] bg-white px-1.5 py-0.5 rounded border border-gray-200 text-gray-500 font-mono font-bold">READY</span>
        </div>
      </div>
    </aside>
  );
};
