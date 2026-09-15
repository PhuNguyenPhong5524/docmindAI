import React, { useState } from 'react';
import { Button, Tag, Avatar } from 'antd';
import { 
  ShareAltOutlined, 
  ReloadOutlined, 
  CopyOutlined, 
  LikeOutlined, 
  FilePdfOutlined, 
  CheckCircleOutlined,
  RobotOutlined,
  SyncOutlined
} from '@ant-design/icons';
import { ChatSidebar } from './components/ChatSidebar';
import { ChatSourcesPanel } from './components/ChatSourcesPanel';
import { ChatComposer } from './components/ChatComposer';

export const UserChatPage: React.FC = () => {
  const [activeChatId, setActiveChatId] = useState('1');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSendMessage = (msg: string) => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
    }, 1500);
  };

  return (
    <div className="h-[calc(100vh-64px)] w-full flex overflow-hidden bg-gray-50">
      
      {/* PANE 1: Sidebar Trò chuyện */}
      <ChatSidebar activeId={activeChatId} onSelectChat={setActiveChatId} />

      {/* PANE 2: Khung Chat Trung tâm */}
      <main className="flex-1 flex flex-col min-w-0 bg-white relative">
        
        {/* Header Cuộc trò chuyện */}
        <header className="h-14 px-6 bg-white border-b border-gray-100 flex items-center justify-between shrink-0 shadow-2xs">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <RobotOutlined className="text-lg" />
            </div>
            <div className="flex flex-col min-w-0">
              <h1 className="text-sm font-bold text-gray-900 truncate">Điều kiện xét tốt nghiệp</h1>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-indigo-600 font-mono bg-indigo-50 px-1.5 py-0.2 rounded font-medium">
                  DOCMIND RAG v2.4 (Hybrid Search)
                </span>
                <span className="text-gray-300">•</span>
                <span className="text-[11px] text-emerald-600 flex items-center gap-1 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Connected
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <Button type="text" icon={<ShareAltOutlined className="text-gray-500" />} />
            <Button type="text" icon={<ReloadOutlined className="text-gray-500" />} />
          </div>
        </header>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Tin nhắn từ User */}
          <div className="flex justify-end gap-3 max-w-4xl ml-auto">
            <div className="flex flex-col items-end max-w-[80%]">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold text-gray-700">Nguyễn Văn An</span>
                <span className="text-[11px] text-gray-400 font-mono">11:40 AM</span>
              </div>
              <div className="bg-indigo-600 text-white p-3.5 rounded-2xl rounded-tr-xs shadow-sm text-sm leading-relaxed">
                Điều kiện xét tốt nghiệp theo quy chế mới là gì? Có bắt buộc chứng chỉ ngoại ngữ không?
              </div>
            </div>
            <Avatar className="bg-indigo-700 shrink-0 font-bold">NV</Avatar>
          </div>

          {/* Tin nhắn Phản hồi từ AI */}
          <div className="flex items-start gap-3.5 max-w-4xl">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <RobotOutlined className="text-lg" />
            </div>
            
            <div className="flex-1 space-y-3 min-w-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-indigo-600">DOCMIND RAG Engine</span>
                  <Tag color="indigo" className="m-0 text-[10px] font-mono font-semibold">Grounded QA</Tag>
                </div>
                <div className="flex items-center gap-1 text-gray-400">
                  <Button type="text" size="small" icon={<CopyOutlined />} />
                  <Button type="text" size="small" icon={<LikeOutlined />} />
                </div>
              </div>

              {/* Nội dung kết quả RAG */}
              <div className="bg-gray-50 p-5 rounded-2xl rounded-tl-xs border border-gray-100 space-y-4 text-gray-800 text-sm leading-relaxed">
                <p>
                  Chào bạn, căn cứ theo tài liệu <Tag color="blue" className="font-mono text-xs"><FilePdfOutlined /> Quy_che_dao_tao_UIT.pdf</Tag>, sinh viên được xét tốt nghiệp khi đáp ứng đầy đủ các điều kiện sau:
                </p>

                <div className="space-y-3 pl-1">
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">1</span>
                    <div><strong className="text-gray-900">Tích lũy đủ số tín chỉ:</strong> Hoàn thành tối thiểu <span className="bg-white border px-1.5 py-0.5 rounded font-semibold">135 tín chỉ</span>.</div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">2</span>
                    <div><strong className="text-gray-900">Điểm trung bình tích lũy (GPA):</strong> Đạt từ <strong className="text-indigo-600">2.00 / 4.00</strong> trở lên.</div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">3</span>
                    <div>
                      <strong className="text-gray-900">Chuẩn đầu ra Ngoại ngữ & Tin học (Bắt buộc):</strong>
                      <ul className="mt-1 space-y-1 pl-4 list-disc text-gray-600 text-xs">
                        <li>Bắt buộc có chứng chỉ tiếng Anh tương đương <strong className="text-gray-800">TOEIC 550</strong> hoặc <strong className="text-gray-800">IELTS 5.5</strong>.</li>
                        <li>Chứng chỉ chuẩn kỹ năng ứng dụng CNTT nâng cao.</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Grounded Citations */}
                <div className="pt-3 border-t border-gray-200/70 space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-gray-700">
                    <span className="flex items-center gap-1.5"><CheckCircleOutlined className="text-emerald-600" /> Nguồn trích dẫn (2 nguồn)</span>
                    <span className="font-mono text-[11px] text-gray-400">Confidence: 98.4%</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div className="bg-white p-3 rounded-xl border border-gray-200 text-xs hover:border-indigo-300 cursor-pointer transition-all">
                      <div className="font-mono text-[11px] text-indigo-600 font-semibold mb-1">
                        Quy_che_dao_tao_UIT.pdf · Trang 23
                      </div>
                      <p className="text-gray-500 line-clamp-2 text-[11px]">
                        "...Sinh viên được công nhận tốt nghiệp khi tích lũy đủ tín chỉ quy định, điểm trung bình toàn khóa từ 2.00 trở lên..."
                      </p>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-gray-200 text-xs hover:border-indigo-300 cursor-pointer transition-all">
                      <div className="font-mono text-[11px] text-indigo-600 font-semibold mb-1">
                        Quy_che_dao_tao_UIT.pdf · Trang 25
                      </div>
                      <p className="text-gray-500 line-clamp-2 text-[11px]">
                        "...Quy định về thời hạn nộp chứng chỉ tiếng Anh quốc tế trước đợt xét tốt nghiệp tối thiểu 30 ngày..."
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Trạng thái sinh phản hồi AI */}
          {isGenerating && (
            <div className="flex items-center gap-2 text-xs text-gray-500 pl-12">
              <SyncOutlined spin className="text-indigo-600" />
              <span>Đang đối chiếu vector ngữ nghĩa & BM25 retrieval...</span>
            </div>
          )}
        </div>

        {/* Khung Nhập Liệu */}
        <ChatComposer onSendMessage={handleSendMessage} isGenerating={isGenerating} />
      </main>

      {/* PANE 3: Sources Panel */}
      <ChatSourcesPanel />
    </div>
  );
};

export default UserChatPage;