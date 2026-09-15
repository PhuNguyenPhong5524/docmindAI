import React, { useState } from 'react';
import { Input, Button, Tag, Tooltip } from 'antd';
import { 
  SendOutlined, 
  PaperClipOutlined, 
  AudioOutlined, 
  BulbOutlined, 
  CloseOutlined, 
  FilePdfOutlined,
  ThunderboltOutlined 
} from '@ant-design/icons';

const { TextArea } = Input;

interface ChatComposerProps {
  onSendMessage: (msg: string) => void;
  isGenerating: boolean;
}

export const ChatComposer: React.FC<ChatComposerProps> = ({ onSendMessage, isGenerating }) => {
  const [text, setText] = useState('');

  const handleSend = () => {
    if (!text.trim()) return;
    onSendMessage(text);
    setText('');
  };

  return (
    <footer className="p-4 pt-2 bg-gray-50/50">
      <div className="max-w-4xl mx-auto space-y-2">
        {/* Suggestion Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <span className="text-xs text-gray-400 shrink-0 flex items-center gap-1 font-medium">
            <BulbOutlined className="text-amber-500" /> Gợi ý:
          </span>
          <button 
            onClick={() => setText('Tóm tắt các mốc thời gian quan trọng xét tốt nghiệp')}
            className="shrink-0 text-xs bg-white hover:bg-gray-100 px-3 py-1 rounded-full text-gray-700 border border-gray-200 transition-colors shadow-2xs"
          >
            Tóm tắt các mốc thời gian quan trọng
          </button>
          <button 
            onClick={() => setText('Các trường hợp được miễn chuẩn đầu ra tiếng Anh')}
            className="shrink-0 text-xs bg-white hover:bg-gray-100 px-3 py-1 rounded-full text-gray-700 border border-gray-200 transition-colors shadow-2xs"
          >
            Trường hợp miễn chuẩn đầu ra
          </button>
        </div>

        {/* Khung soạn thảo */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-3 space-y-2">
          {/* Phạm vi tìm kiếm */}
          <div className="flex items-center justify-between pb-1 border-b border-gray-100">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-[11px] text-gray-400 uppercase font-semibold">Phạm vi:</span>
              <Tag color="indigo" className="m-0 flex items-center gap-1 rounded-md text-[11px]">
                <FilePdfOutlined /> Quy_che_dao_tao_UIT.pdf
                <CloseOutlined className="cursor-pointer text-[10px] ml-1" />
              </Tag>
            </div>
            <div className="flex items-center gap-2 text-gray-400 font-mono text-[11px]">
              <span>Chunk: 512</span>
              <span>•</span>
              <span>Top-K: 4</span>
            </div>
          </div>

          {/* Text Area */}
          <TextArea 
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Hỏi điều gì đó về tài liệu của bạn... (Enter để gửi, Shift+Enter xuống dòng)"
            autoSize={{ minRows: 2, maxRows: 5 }}
            bordered={false}
            className="p-0 text-sm focus:shadow-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />

          {/* Toolbar Actions */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-1">
              <Tooltip title="Đính kèm file">
                <Button type="text" icon={<PaperClipOutlined className="text-gray-400" />} />
              </Tooltip>
              <Tooltip title="Nhập giọng nói">
                <Button type="text" icon={<AudioOutlined className="text-gray-400" />} />
              </Tooltip>
            </div>

            <Button 
              type="primary" 
              icon={isGenerating ? <ThunderboltOutlined spin /> : <SendOutlined />}
              onClick={handleSend}
              loading={isGenerating}
              className="bg-indigo-600 hover:bg-indigo-700 font-semibold"
            >
              Gửi câu hỏi
            </Button>
          </div>
        </div>

        <div className="text-center">
          <span className="text-[11px] text-gray-400">
            DOCMIND AI có thể mắc lỗi logic. Luôn đối chiếu với bản in ấn chính thức của Nhà trường.
          </span>
        </div>
      </div>
    </footer>
  );
};