import React, { useState } from 'react';
import { Modal, message, Progress, Tag, Button } from 'antd';
import {
  FolderOpenOutlined,
  MessageOutlined,
  ThunderboltOutlined,
  HistoryOutlined,
  UploadOutlined,
  PlusOutlined,
  FilePdfOutlined,
  LoadingOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
  CheckCircleOutlined,
  BulbOutlined,
  FileTextOutlined,
  SwapOutlined,
  ArrowRightOutlined,
  RiseOutlined,
  VerifiedOutlined,
  DatabaseOutlined
} from '@ant-design/icons';

const UserDashboardPage = () => {
  // --- STATES ---
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [selectedError, setSelectedError] = useState('');
  
  // Danh sách tài liệu
  const [documents, setDocuments] = useState([
    { id: 1, name: 'Quy_che_dao_tao_UIT.pdf', size: '2.4 MB', pages: 48, time: '14:20 hôm nay', status: 'ready' },
    { id: 2, name: 'Hop_dong_nghien_cuu_AI.pdf', size: '1.8 MB', pages: 24, time: '10:15 hôm qua', status: 'ready' },
    { id: 3, name: 'Bao_cao_tai_chinh_Q3.pdf', size: '8.2 MB', pages: 112, time: '08:30 hôm nay', status: 'processing' },
    { id: 4, name: 'Scan_giao_trinh_cu.pdf', size: '15.1 MB', pages: 30, time: '2 ngày trước', status: 'failed', error: 'Lỗi OCR: PDF scan có độ phân giải thấp (<150 DPI) hoặc bị bóng mờ. Vui lòng sử dụng tài liệu rõ nét hơn.' }
  ]);

  // Danh sách cuộc trò chuyện
  const [conversations, setConversations] = useState([
    {
      id: 1,
      title: 'Điều kiện xét tốt nghiệp',
      time: '10 phút trước',
      docName: 'Quy_che_dao_tao_UIT.pdf',
      userQuery: 'Còn yêu cầu về chuẩn đầu ra ngoại ngữ thì sao?',
      citations: '3 trích dẫn nguồn'
    },
    {
      id: 2,
      title: 'Phân tích điều khoản bảo mật',
      time: '2 giờ trước',
      docName: 'Hop_dong_nghien_cuu_AI.pdf',
      userQuery: 'Thời hạn hiệu lực của thỏa thuận NDA kéo dài bao lâu sau khi bàn giao dự án?',
      verified: 'Đã đối soát điều 8.3'
    },
    {
      id: 3,
      title: 'Tóm tắt quy chế đào tạo tín chỉ',
      time: 'Hôm qua',
      docName: 'Quy_che_dao_tao_UIT.pdf',
      aiAnswer: 'Tóm tắt 4 điều kiện cốt lõi: 1. Tích lũy đủ số tín chỉ; 2. Điểm TB tích lũy ≥ 2.0; 3. Chứng chỉ...',
      summaryBadge: 'Bản tóm tắt tự động'
    }
  ]);

  // --- HANDLERS ---
  const handleUploadPDF = () => {
    setIsUploadModalOpen(false);
    const newDoc = {
      id: Date.now(),
      name: `Tai_lieu_moi_${documents.length + 1}.pdf`,
      size: '3.5 MB',
      pages: 15,
      time: 'Vừa xong',
      status: 'ready'
    };
    setDocuments([newDoc, ...documents]);
    message.success('Đã tải tài liệu PDF mới thành công!');
  };

  const handleStartNewChat = () => {
    const newConv = {
      id: Date.now(),
      title: 'Trò chuyện ngữ cảnh mới',
      time: 'Vừa xong',
      docName: documents[0]?.name || 'Tài liệu mặc định',
      userQuery: 'Hãy bắt đầu phân tích tài liệu này...',
      citations: '1 trích dẫn nguồn'
    };
    setConversations([newConv, ...conversations]);
    message.info('Đã tạo phiên hỏi đáp ngữ cảnh mới!');
  };

  const handleShowErrorModal = (errorMsg: string) => {
    setSelectedError(errorMsg);
    setIsErrorModalOpen(true);
  };

  return (
    <div className="p-6 max-w-[1440px] mx-auto flex flex-col gap-6">
      
      {/* Welcome & System Model Version */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Tổng quan</h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-600 text-xs font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse"></span>
              v2.4 Neural Core
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Chào mừng trở lại. Tiếp tục khám phá tài liệu của bạn cùng DOCMIND AI.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-xl shadow-sm border border-gray-100">
          <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
            ⚡
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-gray-400">Chỉ mục Vector</span>
            <span className="text-xs font-mono font-medium text-gray-800">UIT-Milvus: Đã đồng bộ</span>
          </div>
        </div>
      </div>

      {/* --- STATISTIC CARDS METRICS --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        
        {/* Card 1: Documents */}
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-gray-500 text-sm">
            <span className="font-medium">Tổng tài liệu</span>
            <div className="p-2 rounded-lg bg-gray-50 text-indigo-600">
              <FilePdfOutlined className="text-lg" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-gray-900 tracking-tight">{documents.length}</span>
            <span className="text-xs text-gray-500">tệp tin</span>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between text-xs">
            <span className="text-indigo-600 font-semibold flex items-center gap-1">
              <RiseOutlined /> +2 tuần này
            </span>
            <span className="text-gray-400 font-mono">Index: 100%</span>
          </div>
        </div>

        {/* Card 2: Conversations */}
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-gray-500 text-sm">
            <span className="font-medium">Cuộc trò chuyện</span>
            <div className="p-2 rounded-lg bg-gray-50 text-indigo-600">
              <MessageOutlined className="text-lg" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-gray-900 tracking-tight">{conversations.length}</span>
            <span className="text-xs text-gray-500">phiên hỏi đáp</span>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between text-xs">
            <span className="text-gray-700 font-medium flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-500"></span> 3 đang mở
            </span>
            <span className="text-gray-400 font-mono">RAG Active</span>
          </div>
        </div>

        {/* Card 3: Prompts Sent */}
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-gray-500 text-sm">
            <span className="font-medium">Câu hỏi đã gửi</span>
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
              <ThunderboltOutlined className="text-lg" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-gray-900 tracking-tight">42</span>
            <span className="text-xs text-gray-500">truy vấn RAG</span>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between text-xs">
            <span className="text-emerald-600 font-semibold flex items-center gap-1">
              <VerifiedOutlined /> 99.4% trích dẫn
            </span>
            <span className="text-gray-400 font-mono">Top-K: 4</span>
          </div>
        </div>

        {/* Card 4: Storage */}
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-gray-500 text-sm">
            <span className="font-medium">Dung lượng đã dùng</span>
            <div className="p-2 rounded-lg bg-gray-50 text-gray-700">
              <DatabaseOutlined className="text-lg" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-3xl font-bold text-gray-900 tracking-tight">24.5</span>
            <span className="text-sm text-gray-400">/ 100 MB</span>
          </div>
          <div className="mt-3 flex flex-col gap-1.5">
            <Progress percent={24.5} showInfo={false} strokeColor="#4f46e5" size="small" />
            <div className="flex justify-between items-center text-xs text-gray-400">
              <span className="font-mono">Còn trống 75.5 MB</span>
              <span className="font-semibold text-indigo-600">24%</span>
            </div>
          </div>
        </div>

      </div>

      {/* --- QUICK ACTIONS CONTROL STRIP --- */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <ThunderboltOutlined className="text-indigo-600 text-lg" />
          <span className="text-xs font-bold uppercase tracking-wider text-gray-800">Thao tác nhanh</span>
        </div>
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <Button 
            type="primary" 
            icon={<UploadOutlined />} 
            onClick={() => setIsUploadModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 shadow-none font-medium text-xs h-9"
          >
            Tải tài liệu PDF
          </Button>
          <Button 
            icon={<PlusOutlined />} 
            onClick={handleStartNewChat}
            className="text-xs h-9 text-gray-700 border-gray-200 hover:text-indigo-600"
          >
            Bắt đầu trò chuyện mới
          </Button>
          <Button 
            icon={<FileTextOutlined />} 
            onClick={() => message.info('Tính năng Tóm tắt hàng loạt đang hoạt động')}
            className="text-xs h-9 text-gray-700 border-gray-200 hover:text-indigo-600"
          >
            Tóm tắt tài liệu
          </Button>
          <Button 
            icon={<SwapOutlined />} 
            onClick={() => message.info('Vui lòng chọn 2 tài liệu để so sánh')}
            className="text-xs h-9 text-gray-700 border-gray-200 hover:text-indigo-600"
          >
            So sánh 2 tài liệu
          </Button>
        </div>
      </div>

      {/* --- TWO COLUMN LAYOUT: DOCUMENTS & CONVERSATIONS --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: Recent Documents (7 cols) */}
        <section className="lg:col-span-7 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FolderOpenOutlined className="text-indigo-600 text-lg" />
              <h2 className="text-base font-semibold text-gray-900">Tài liệu gần đây</h2>
            </div>
            <button className="text-xs font-medium text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
              Xem tất cả <ArrowRightOutlined />
            </button>
          </div>

          {/* Document Dynamic List */}
          <div className="divide-y divide-gray-50">
            {documents.map((doc) => (
              <div key={doc.id} className="p-4 flex items-center justify-between gap-3 hover:bg-gray-50/80 transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                    doc.status === 'failed' ? 'bg-red-50 text-red-600' : 
                    doc.status === 'processing' ? 'bg-gray-100 text-gray-500' : 'bg-indigo-50 text-indigo-600'
                  }`}>
                    <FilePdfOutlined className="text-xl" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-medium text-gray-800 truncate hover:text-indigo-600 cursor-pointer">
                      {doc.name}
                    </span>
                    <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5">
                      <span>{doc.size}</span>
                      <span>•</span>
                      <span>{doc.pages} trang</span>
                      <span>•</span>
                      <span>{doc.time}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {doc.status === 'ready' && (
                    <>
                      <Tag color="cyan" className="m-0 rounded border-0 text-xs py-0.5 font-medium">Sẵn sàng</Tag>
                      <Button 
                        size="small" 
                        type="primary" 
                        icon={<ThunderboltOutlined />} 
                        className="bg-indigo-600 hover:bg-indigo-700 text-xs"
                        onClick={() => message.info(`Bắt đầu hỏi AI về tài liệu: ${doc.name}`)}
                      >
                        Hỏi AI
                      </Button>
                    </>
                  )}

                  {doc.status === 'processing' && (
                    <>
                      <Tag icon={<LoadingOutlined />} color="processing" className="m-0 rounded border-0 text-xs py-0.5">
                        Đang xử lý
                      </Tag>
                      <Button size="small" disabled className="text-xs">
                        Đang vector hóa...
                      </Button>
                    </>
                  )}

                  {doc.status === 'failed' && (
                    <>
                      <Tag color="error" className="m-0 rounded border-0 text-xs py-0.5 font-medium">Xử lý thất bại</Tag>
                      <Button 
                        size="small" 
                        danger 
                        type="text" 
                        icon={<InfoCircleOutlined />} 
                        onClick={() => handleShowErrorModal(doc.error || 'Lỗi không xác định')}
                        className="text-xs hover:bg-red-50"
                      >
                        Xem lỗi
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <CheckCircleOutlined className="text-emerald-500" />
              Công cụ trích xuất: DOCMIND Parser Engine v3.1 (OCR Tiếng Việt)
            </span>
            <span className="font-mono text-gray-400">Chunk Size: 512t</span>
          </div>
        </section>

        {/* RIGHT COLUMN: Recent Conversations (5 cols) */}
        <section className="lg:col-span-5 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageOutlined className="text-indigo-600 text-lg" />
              <h2 className="text-base font-semibold text-gray-900">Cuộc trò chuyện gần đây</h2>
            </div>
            <button className="text-xs font-medium text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
              Xem tất cả <ArrowRightOutlined />
            </button>
          </div>

          {/* Conversation Cards */}
          <div className="p-4 flex flex-col gap-3">
            {conversations.map((chat) => (
              <div 
                key={chat.id} 
                className="p-3.5 rounded-xl bg-gray-50 hover:bg-indigo-50/50 border border-transparent hover:border-indigo-100 transition-all cursor-pointer group flex flex-col gap-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-xs font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors line-clamp-1">
                    {chat.title}
                  </h3>
                  <span className="text-[11px] font-mono text-gray-400 shrink-0">{chat.time}</span>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <FilePdfOutlined className="text-indigo-500 text-xs" />
                  <span className="truncate">{chat.docName}</span>
                </div>

                <p className="text-xs text-gray-600 bg-white p-2 rounded-lg border border-gray-100 line-clamp-2">
                  {chat.userQuery ? (
                    <>
                      <span className="font-semibold text-gray-900">Bạn: </span>
                      "{chat.userQuery}"
                    </>
                  ) : (
                    <>
                      <span className="font-semibold text-indigo-600">DOCMIND: </span>
                      "{chat.aiAnswer}"
                    </>
                  )}
                </p>

                <div className="flex items-center justify-between text-xs pt-1">
                  {chat.citations && (
                    <span className="text-indigo-600 font-medium flex items-center gap-1">
                      <FileTextOutlined className="text-[11px]" /> {chat.citations}
                    </span>
                  )}
                  {chat.verified && (
                    <span className="text-emerald-600 font-medium flex items-center gap-1">
                      <CheckCircleOutlined className="text-[11px]" /> {chat.verified}
                    </span>
                  )}
                  {chat.summaryBadge && (
                    <span className="text-gray-400 font-medium flex items-center gap-1">
                      <HistoryOutlined className="text-[11px]" /> {chat.summaryBadge}
                    </span>
                  )}
                  <ArrowRightOutlined className="text-[10px] text-gray-300 group-hover:text-indigo-600 transition-all" />
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 pt-0 mt-auto">
            <Button 
              type="dashed" 
              block 
              icon={<PlusOutlined />} 
              onClick={handleStartNewChat}
              className="text-indigo-600 border-indigo-200 hover:border-indigo-500 text-xs font-semibold h-9"
            >
              Mở phiên hỏi đáp ngữ cảnh mới
            </Button>
          </div>
        </section>

      </div>

      {/* --- BOTTOM BANNER --- */}
      <div className="rounded-xl p-4 bg-gradient-to-r from-indigo-500/10 via-indigo-50/50 to-gray-50 border border-indigo-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm">
            <BulbOutlined className="text-xl" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900">Mẹo tối ưu câu hỏi RAG</h4>
            <p className="text-xs text-gray-600 mt-0.5">
              Bạn có thể trích xuất chính xác điều khoản hợp đồng bằng cách hỏi: "Trích dẫn nguyên văn điều 4 về quyền sở hữu trí tuệ kèm số trang". DOCMIND sẽ ghim trực tiếp đoạn gốc để bạn đối chứng.
            </p>
          </div>
        </div>
        <Button 
          className="bg-white text-gray-700 hover:text-indigo-600 border-gray-200 text-xs font-medium shrink-0 h-9"
          onClick={() => message.info('Mở tài liệu hướng dẫn viết Prompt')}
        >
          Xem hướng dẫn prompt
        </Button>
      </div>

      {/* --- MODAL UPLOAD PDF --- */}
      <Modal
        title="Tải lên tài liệu PDF mới"
        open={isUploadModalOpen}
        onOk={handleUploadPDF}
        onCancel={() => setIsUploadModalOpen(false)}
        okText="Bắt đầu Xử lý & Vector hóa"
        cancelText="Hủy bỏ"
        okButtonProps={{ className: 'bg-indigo-600 hover:bg-indigo-700' }}
      >
        <div className="py-6 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 my-2">
          <UploadOutlined className="text-3xl text-indigo-500 mb-2" />
          <p className="text-sm font-medium text-gray-700">Kéo thả file PDF vào đây hoặc bấm chọn file</p>
          <p className="text-xs text-gray-400 mt-1">Hỗ trợ PDF đến 50MB (Bao gồm cả file scan OCR)</p>
        </div>
      </Modal>

      {/* --- MODAL VIEW ERROR DETAILS --- */}
      <Modal
        title={
          <div className="flex items-center gap-2 text-red-600">
            <ExclamationCircleOutlined />
            <span>Chi tiết lỗi xử lý tài liệu</span>
          </div>
        }
        open={isErrorModalOpen}
        onOk={() => setIsErrorModalOpen(false)}
        onCancel={() => setIsErrorModalOpen(false)}
        footer={[
          <Button key="close" onClick={() => setIsErrorModalOpen(false)}>
            Đóng
          </Button>
        ]}
      >
        <div className="py-3">
          <div className="p-3 rounded-lg bg-red-50 border border-red-100 text-red-700 text-xs leading-relaxed">
            {selectedError}
          </div>
        </div>
      </Modal>

    </div>
  );
};

export default UserDashboardPage;