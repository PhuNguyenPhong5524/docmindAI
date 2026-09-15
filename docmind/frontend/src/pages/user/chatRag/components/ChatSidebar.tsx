import React, { useState } from 'react';
import { Input, Button, Badge } from 'antd';
import { 
  PlusOutlined, 
  SearchOutlined, 
  MessageOutlined, 
  FileTextOutlined, 
  FolderOutlined,
  SafetyCertificateOutlined 
} from '@ant-design/icons';

interface ChatSidebarProps {
  activeId: string;
  onSelectChat: (id: string) => void;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({ activeId, onSelectChat }) => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <aside className="w-[260px] shrink-0 bg-white flex flex-col justify-between border-r border-gray-200 z-10 select-none">
      <div className="flex flex-col h-full min-h-0">
        {/* CTA Tạo cuộc trò chuyện mới */}
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

        {/* Khung tìm kiếm */}
        <div className="px-3 py-1.5">
          <Input 
            prefix={<SearchOutlined className="text-gray-400" />} 
            placeholder="Tìm cuộc trò chuyện..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-gray-50 border-gray-200 rounded-lg text-xs"
          />
        </div>

        {/* Danh sách nhóm trò chuyện */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-4">
          {/* Hôm nay */}
          <div>
            <div className="px-2 py-1 text-[11px] font-semibold text-gray-400 uppercase tracking-wider flex items-center justify-between">
              <span>Hôm nay</span>
              <span className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded font-mono">2</span>
            </div>
            <div className="mt-1 space-y-1">
              <div 
                onClick={() => onSelectChat('1')}
                className={`p-2 rounded-lg cursor-pointer transition-all ${
                  activeId === '1' ? 'bg-indigo-50 text-indigo-900 border border-indigo-100' : 'hover:bg-gray-50 text-gray-700'
                }`}
              >
                <div className="flex items-center justify-between gap-1.5">
                  <div className="flex items-center gap-2 min-w-0">
                    <MessageOutlined className={activeId === '1' ? 'text-indigo-600' : 'text-gray-400'} />
                    <span className="text-xs font-semibold truncate">Điều kiện xét tốt nghiệp</span>
                  </div>
                  <span className="text-[10px] bg-indigo-100 text-indigo-700 px-1 rounded font-mono shrink-0">2 docs</span>
                </div>
                <div className="mt-1 flex items-center gap-1.5 text-[11px] text-gray-400 pl-5">
                  <span className="font-mono">11:42</span>
                  <span>•</span>
                  <span className="truncate">UIT Đào tạo chuẩn...</span>
                </div>
              </div>

              <div 
                onClick={() => onSelectChat('2')}
                className={`p-2 rounded-lg cursor-pointer transition-all ${
                  activeId === '2' ? 'bg-indigo-50 text-indigo-900 border border-indigo-100' : 'hover:bg-gray-50 text-gray-700'
                }`}
              >
                <div className="flex items-center justify-between gap-1.5">
                  <div className="flex items-center gap-2 min-w-0">
                    <MessageOutlined className="text-gray-400" />
                    <span className="text-xs font-medium truncate">Chuẩn đầu ra Tiếng Anh</span>
                  </div>
                  <span className="text-[10px] text-gray-400 font-mono">10:15</span>
                </div>
              </div>
            </div>
          </div>

          {/* 7 ngày qua */}
          <div>
            <div className="px-2 py-1 text-[11px] font-semibold text-gray-400 uppercase tracking-wider flex items-center justify-between">
              <span>7 ngày qua</span>
              <span className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded font-mono">1</span>
            </div>
            <div className="mt-1 space-y-1">
              <div 
                onClick={() => onSelectChat('3')}
                className="p-2 rounded-lg cursor-pointer hover:bg-gray-50 text-gray-700 transition-all flex items-center justify-between"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <FileTextOutlined className="text-gray-400" />
                  <span className="text-xs font-medium truncate">Hợp đồng nghiên cứu bảo mật</span>
                </div>
                <span className="text-[10px] bg-gray-100 text-gray-600 px-1 rounded font-mono">3 docs</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer bảo mật */}
        <div className="p-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SafetyCertificateOutlined className="text-indigo-600" />
            <span className="text-xs font-medium text-gray-700">UIT Security Shield</span>
          </div>
          <span className="text-[10px] bg-white px-1.5 py-0.5 rounded border border-gray-200 text-gray-500 font-mono font-bold">AES-256</span>
        </div>
      </div>
    </aside>
  );
};