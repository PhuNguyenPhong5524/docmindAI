import { useMemo, useState } from "react";
import { Button, Empty, Modal, Progress, Skeleton, Tag, message } from "antd";
import { useNavigate } from "react-router-dom";
import {
  ArrowRightOutlined,
  BulbOutlined,
  CheckCircleOutlined,
  DatabaseOutlined,
  ExclamationCircleOutlined,
  FilePdfOutlined,
  FileTextOutlined,
  FolderOpenOutlined,
  InfoCircleOutlined,
  LoadingOutlined,
  MessageOutlined,
  PlusOutlined,
  RiseOutlined,
  SwapOutlined,
  ThunderboltOutlined,
  UploadOutlined,
  VerifiedOutlined,
} from "@ant-design/icons";
import { useAuth } from "../../../contexts/AuthContext";
import { useUserDashboard } from "../../../hooks/user/useDashboard";
import type { DashboardDocument } from "../../../types/dashboard";
import type { DocumentStatus } from "../../../types/document";

const statusLabel: Record<DocumentStatus, string> = {
  READY: "Sẵn sàng",
  PROCESSING: "Đang xử lý",
  FAILED: "Xử lý thất bại",
};

const formatBytes = (bytes = 0) => {
  if (!bytes) return "0 MB";
  const units = ["B", "KB", "MB", "GB"];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / 1024 ** index;
  return `${value.toFixed(value >= 10 || index === 0 ? 0 : 1)} ${units[index]}`;
};

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

const getDocumentIconClass = (status: DocumentStatus) => {
  if (status === "FAILED") return "bg-red-50 text-red-600";
  if (status === "PROCESSING") return "bg-gray-100 text-gray-500";
  return "bg-indigo-50 text-indigo-600";
};

const UserDashboardPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data, isLoading, isError, refetch } = useUserDashboard();
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [selectedError, setSelectedError] = useState("");

  const dashboard = data?.data;
  const stats = dashboard?.stats;
  const documents = dashboard?.recent_documents || [];
  const conversations = dashboard?.recent_chats || [];

  const storagePercent = useMemo(() => {
    if (!stats?.storage_limit_bytes) return 0;
    return Math.min(100, Math.round((stats.total_storage_bytes / stats.storage_limit_bytes) * 100));
  }, [stats]);

  const storageLeft = Math.max(0, (stats?.storage_limit_bytes || 0) - (stats?.total_storage_bytes || 0));
  const readyIndexPercent = stats?.total_documents
    ? Math.round((stats.ready_documents / stats.total_documents) * 100)
    : 0;

  const handleShowErrorModal = (errorMsg: string) => {
    setSelectedError(errorMsg);
    setIsErrorModalOpen(true);
  };

  const handleAskDocument = (doc: DashboardDocument) => {
    navigate("/chat", { state: { documentId: doc._id } });
  };

  if (isLoading) {
    return (
      <div className="p-6 max-w-[1440px] mx-auto">
        <Skeleton active paragraph={{ rows: 12 }} />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-[1440px] mx-auto flex flex-col gap-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Tổng quan</h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-600 text-xs font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
              v2.4 Neural Core
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Chào mừng {user?.full_name || user?.email || "bạn"} trở lại. Dữ liệu đang hiển thị theo tài khoản USER của bạn.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-xl shadow-sm border border-gray-100">
          <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
            <ThunderboltOutlined />
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-gray-400">Chỉ mục Vector</span>
            <span className="text-xs font-mono font-medium text-gray-800">
              {stats?.ready_documents || 0}/{stats?.total_documents || 0} tài liệu sẵn sàng
            </span>
          </div>
        </div>
      </div>

      {isError && (
        <div className="bg-red-50 border border-red-100 text-red-700 rounded-xl p-4 text-sm flex items-center justify-between">
          <span>Không tải được dữ liệu dashboard.</span>
          <Button size="small" danger onClick={() => refetch()}>Thử lại</Button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-gray-500 text-sm">
            <span className="font-medium">Tổng tài liệu</span>
            <div className="p-2 rounded-lg bg-gray-50 text-indigo-600">
              <FilePdfOutlined className="text-lg" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-gray-900 tracking-tight">{stats?.total_documents || 0}</span>
            <span className="text-xs text-gray-500">tệp tin</span>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between text-xs">
            <span className="text-indigo-600 font-semibold flex items-center gap-1">
              <RiseOutlined /> {stats?.ready_documents || 0} sẵn sàng
            </span>
            <span className="text-gray-400 font-mono">Index: {readyIndexPercent}%</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-gray-500 text-sm">
            <span className="font-medium">Cuộc trò chuyện</span>
            <div className="p-2 rounded-lg bg-gray-50 text-indigo-600">
              <MessageOutlined className="text-lg" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-gray-900 tracking-tight">{stats?.chat_sessions || 0}</span>
            <span className="text-xs text-gray-500">tài liệu đã hỏi</span>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between text-xs">
            <span className="text-gray-700 font-medium flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-500" /> {stats?.processing_documents || 0} đang xử lý
            </span>
            <span className="text-gray-400 font-mono">RAG Active</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-gray-500 text-sm">
            <span className="font-medium">Câu hỏi đã gửi</span>
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
              <ThunderboltOutlined className="text-lg" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-gray-900 tracking-tight">{stats?.total_questions || 0}</span>
            <span className="text-xs text-gray-500">truy vấn RAG</span>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between text-xs">
            <span className="text-emerald-600 font-semibold flex items-center gap-1">
              <VerifiedOutlined /> Citations từ số trang
            </span>
            <span className="text-gray-400 font-mono">Top-K: 5</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-gray-500 text-sm">
            <span className="font-medium">Dung lượng đã dùng</span>
            <div className="p-2 rounded-lg bg-gray-50 text-gray-700">
              <DatabaseOutlined className="text-lg" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-3xl font-bold text-gray-900 tracking-tight">{formatBytes(stats?.total_storage_bytes)}</span>
            <span className="text-sm text-gray-400">/ {formatBytes(stats?.storage_limit_bytes)}</span>
          </div>
          <div className="mt-3 flex flex-col gap-1.5">
            <Progress percent={storagePercent} showInfo={false} strokeColor="#4f46e5" size="small" />
            <div className="flex justify-between items-center text-xs text-gray-400">
              <span className="font-mono">Còn trống {formatBytes(storageLeft)}</span>
              <span className="font-semibold text-indigo-600">{storagePercent}%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <ThunderboltOutlined className="text-indigo-600 text-lg" />
          <span className="text-xs font-bold uppercase tracking-wider text-gray-800">Thao tác nhanh</span>
        </div>
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <Button type="primary" icon={<UploadOutlined />} onClick={() => navigate("/documents")} className="bg-indigo-600 hover:bg-indigo-700 shadow-none font-medium text-xs h-9">
            Tải tài liệu PDF
          </Button>
          <Button icon={<PlusOutlined />} onClick={() => navigate("/chat")} className="text-xs h-9 text-gray-700 border-gray-200 hover:text-indigo-600">
            Bắt đầu trò chuyện mới
          </Button>
          <Button icon={<FileTextOutlined />} onClick={() => navigate("/documents")} className="text-xs h-9 text-gray-700 border-gray-200 hover:text-indigo-600">
            Tóm tắt tài liệu
          </Button>
          <Button icon={<SwapOutlined />} onClick={() => navigate("/compare")} className="text-xs h-9 text-gray-700 border-gray-200 hover:text-indigo-600">
            So sánh 2 tài liệu
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <section className="lg:col-span-7 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FolderOpenOutlined className="text-indigo-600 text-lg" />
              <h2 className="text-base font-semibold text-gray-900">Tài liệu gần đây</h2>
            </div>
            <button onClick={() => navigate("/documents")} className="text-xs font-medium text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
              Xem tất cả <ArrowRightOutlined />
            </button>
          </div>

          <div className="divide-y divide-gray-50">
            {documents.length === 0 && <Empty className="py-10" description="Chưa có tài liệu nào" />}
            {documents.map((doc) => (
              <div key={doc._id} className="p-4 flex items-center justify-between gap-3 hover:bg-gray-50/80 transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${getDocumentIconClass(doc.status)}`}>
                    <FilePdfOutlined className="text-xl" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-medium text-gray-800 truncate hover:text-indigo-600 cursor-pointer" title={doc.display_name}>
                      {doc.display_name}
                    </span>
                    <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5">
                      <span>{formatBytes(doc.size)}</span>
                      <span>•</span>
                      <span>{doc.total_pages || 0} trang</span>
                      <span>•</span>
                      <span>{formatRelativeTime(doc.created_at)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {doc.status === "READY" && (
                    <>
                      <Tag color="cyan" className="m-0 rounded border-0 text-xs py-0.5 font-medium">{statusLabel[doc.status]}</Tag>
                      <Button size="small" type="primary" icon={<ThunderboltOutlined />} className="bg-indigo-600 hover:bg-indigo-700 text-xs" onClick={() => handleAskDocument(doc)}>
                        Hỏi AI
                      </Button>
                    </>
                  )}
                  {doc.status === "PROCESSING" && (
                    <>
                      <Tag icon={<LoadingOutlined />} color="processing" className="m-0 rounded border-0 text-xs py-0.5">
                        {statusLabel[doc.status]}
                      </Tag>
                      <Button size="small" disabled className="text-xs">Đang vector hóa...</Button>
                    </>
                  )}
                  {doc.status === "FAILED" && (
                    <>
                      <Tag color="error" className="m-0 rounded border-0 text-xs py-0.5 font-medium">{statusLabel[doc.status]}</Tag>
                      <Button size="small" danger type="text" icon={<InfoCircleOutlined />} onClick={() => handleShowErrorModal(doc.error_message || "Lỗi không xác định")} className="text-xs hover:bg-red-50">
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
              Parser Engine: trích xuất PDF và lập chỉ mục theo từng trang
            </span>
            <span className="font-mono text-gray-400">{stats?.total_pages || 0} trang</span>
          </div>
        </section>

        <section className="lg:col-span-5 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageOutlined className="text-indigo-600 text-lg" />
              <h2 className="text-base font-semibold text-gray-900">Cuộc trò chuyện gần đây</h2>
            </div>
            <button onClick={() => navigate("/chat")} className="text-xs font-medium text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
              Xem tất cả <ArrowRightOutlined />
            </button>
          </div>

          <div className="p-4 flex flex-col gap-3">
            {conversations.length === 0 && <Empty className="py-10" description="Chưa có cuộc trò chuyện" />}
            {conversations.map((chat) => (
              <div key={`${chat.document_id}-${chat.last_message_id}`} onClick={() => navigate("/chat", { state: { documentId: chat.document_id } })} className="p-3.5 rounded-xl bg-gray-50 hover:bg-indigo-50/50 border border-transparent hover:border-indigo-100 transition-all cursor-pointer group flex flex-col gap-2">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-xs font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors line-clamp-1">
                    {chat.last_role === "user" ? "Câu hỏi gần nhất" : "Phản hồi gần nhất"}
                  </h3>
                  <span className="text-[11px] font-mono text-gray-400 shrink-0">{formatRelativeTime(chat.updated_at)}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <FilePdfOutlined className="text-indigo-500 text-xs" />
                  <span className="truncate">{chat.document_name}</span>
                </div>
                <p className="text-xs text-gray-600 bg-white p-2 rounded-lg border border-gray-100 line-clamp-2">
                  <span className="font-semibold text-gray-900">{chat.last_role === "user" ? "Bạn: " : "DOCMIND: "}</span>
                  "{chat.last_content}"
                </p>
                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-indigo-600 font-medium flex items-center gap-1">
                    <FileTextOutlined className="text-[11px]" /> {chat.citations_count} trích dẫn nguồn
                  </span>
                  <ArrowRightOutlined className="text-[10px] text-gray-300 group-hover:text-indigo-600 transition-all" />
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 pt-0 mt-auto">
            <Button type="dashed" block icon={<PlusOutlined />} onClick={() => navigate("/chat")} className="text-indigo-600 border-indigo-200 hover:border-indigo-500 text-xs font-semibold h-9">
              Mở phiên hỏi đáp ngữ cảnh mới
            </Button>
          </div>
        </section>
      </div>

      <div className="rounded-xl p-4 bg-gradient-to-r from-indigo-500/10 via-indigo-50/50 to-gray-50 border border-indigo-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm">
            <BulbOutlined className="text-xl" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900">Mẹo tối ưu câu hỏi RAG</h4>
            <p className="text-xs text-gray-600 mt-0.5">
              Hãy hỏi kèm nội dung cần đối chứng như số trang, điều khoản hoặc yêu cầu trích dẫn để DOCMIND trả lời sát tài liệu hơn.
            </p>
          </div>
        </div>
        <Button className="bg-white text-gray-700 hover:text-indigo-600 border-gray-200 text-xs font-medium shrink-0 h-9" onClick={() => message.info("Hãy đặt câu hỏi cụ thể theo tài liệu đang chọn.")}>
          Xem hướng dẫn prompt
        </Button>
      </div>

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
          </Button>,
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
