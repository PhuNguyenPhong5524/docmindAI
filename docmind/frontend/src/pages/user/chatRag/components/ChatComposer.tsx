import React, { useState } from 'react';
import { Input, Button, Tag, Tooltip } from 'antd';
import {
  SendOutlined,
  BulbOutlined,
  CloseOutlined,
  FilePdfOutlined,
  ThunderboltOutlined
} from '@ant-design/icons';

const { TextArea } = Input;

interface ChatComposerProps {
  onSendMessage: (msg: string) => void;
  isGenerating: boolean;
  selectedDocumentName?: string;
  disabled?: boolean;
}

export const ChatComposer: React.FC<ChatComposerProps> = ({
  onSendMessage,
  isGenerating,
  selectedDocumentName,
  disabled = false,
}) => {
  const [text, setText] = useState('');

  const handleSend = () => {
    if (!text.trim() || disabled || isGenerating) return;
    onSendMessage(text.trim());
    setText('');
  };

  return (
    <footer className="p-4 pt-2 bg-gray-50/50">
      <div className="max-w-4xl mx-auto space-y-2">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <span className="text-xs text-gray-400 shrink-0 flex items-center gap-1 font-medium">
            <BulbOutlined className="text-amber-500" /> Gợi ý:
          </span>
          <button
            onClick={() => setText('Tóm tắt các ý chính của tài liệu này')}
            className="shrink-0 text-xs bg-white hover:bg-gray-100 px-3 py-1 rounded-full text-gray-700 border border-gray-200 transition-colors shadow-2xs"
          >
            Tóm tắt các ý chính
          </button>
          <button
            onClick={() => setText('Tài liệu này trình bày nội dung gì?')}
            className="shrink-0 text-xs bg-white hover:bg-gray-100 px-3 py-1 rounded-full text-gray-700 border border-gray-200 transition-colors shadow-2xs"
          >
            Nội dung tài liệu
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-3 space-y-2">
          <div className="flex items-center justify-between pb-1 border-b border-gray-100">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-[11px] text-gray-400 uppercase font-semibold">Phạm vi:</span>
              <Tag color={selectedDocumentName ? 'indigo' : 'default'} className="m-0 flex items-center gap-1 rounded-md text-[11px] max-w-[280px] truncate">
                <FilePdfOutlined /> {selectedDocumentName || 'Chưa chọn tài liệu READY'}
                <CloseOutlined className="cursor-pointer text-[10px] ml-1" />
              </Tag>
            </div>
            <div className="flex items-center gap-2 text-gray-400 font-mono text-[11px]">
              <span>Top-K: 5</span>
              <span>•</span>
              <span>RAG</span>
            </div>
          </div>

          <TextArea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={selectedDocumentName ? 'Hỏi điều gì đó về tài liệu của bạn...' : 'Chọn một tài liệu READY trước khi hỏi AI'}
            autoSize={{ minRows: 2, maxRows: 5 }}
            variant="borderless"
            disabled={disabled || isGenerating}
            className="p-0 text-sm focus:shadow-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />

          <div className="flex items-center justify-between pt-1">
            <Tooltip title="Chỉ hỏi trên tài liệu READY đang chọn">
              <Button type="text" icon={<FilePdfOutlined className="text-gray-400" />} />
            </Tooltip>

            <Button
              type="primary"
              icon={isGenerating ? <ThunderboltOutlined spin /> : <SendOutlined />}
              onClick={handleSend}
              loading={isGenerating}
              disabled={disabled || !text.trim()}
              className="bg-indigo-600 hover:bg-indigo-700 font-semibold"
            >
              Gửi câu hỏi
            </Button>
          </div>
        </div>

        <div className="text-center">
          <span className="text-[11px] text-gray-400">
            DOCMIND AI có thể mắc lỗi logic. Luôn đối chiếu với tài liệu gốc.
          </span>
        </div>
      </div>
    </footer>
  );
};
