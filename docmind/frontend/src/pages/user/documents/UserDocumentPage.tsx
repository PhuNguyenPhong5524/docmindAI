import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Table, Input, Button, Drawer, Modal, Progress, Tag, Upload, message, Empty
} from 'antd';
import {
  UploadOutlined, SearchOutlined, ControlOutlined, FilePdfOutlined,
  MessageOutlined, ThunderboltOutlined, DeleteOutlined, SyncOutlined,
  ExclamationCircleOutlined, ReloadOutlined, NodeIndexOutlined,
  SafetyCertificateOutlined, InboxOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { UploadFile, UploadProps } from 'antd';
import { useDeleteDocument, useDocuments, useUploadDocument } from '../../../hooks/user/useDocuments';
import type { DocumentStatus, UserDocument } from '../../../types/document';

const { Dragger } = Upload;
const MAX_FILE_SIZE = 20 * 1024 * 1024;
const MAX_UPLOAD_FILES = 3;

type FilterStatus = 'all' | 'ready' | 'processing' | 'error';

interface DocumentRow extends UserDocument {
  key: string;
}

const formatBytes = (bytes: number) => {
  if (!bytes) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${(bytes / 1024 ** index).toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
};

const formatDate = (value?: string) => {
  if (!value) return '--';
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
};

const statusLabel: Record<DocumentStatus, string> = {
  PROCESSING: 'Đang xử lý',
  READY: 'Sẵn sàng',
  FAILED: 'Thất bại',
};

export const UserDocumentPage: React.FC = () => {
  const navigate = useNavigate();
  const { data, isLoading, isFetching, refetch } = useDocuments();
  const uploadMutation = useUploadDocument();
  const deleteMutation = useDeleteDocument();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<DocumentRow | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterStatus>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(4);

  const documents = useMemo<DocumentRow[]>(() => {
    return (data?.data || []).map((doc) => ({ ...doc, key: doc._id }));
  }, [data?.data]);

  const filteredData = useMemo(() => {
    return documents.filter((item) => {
      if (activeFilter === 'ready' && item.status !== 'READY') return false;
      if (activeFilter === 'processing' && item.status !== 'PROCESSING') return false;
      if (activeFilter === 'error' && item.status !== 'FAILED') return false;

      const query = searchTerm.trim().toLowerCase();
      if (!query) return true;

      return `${item.display_name} ${item.original_name}`.toLowerCase().includes(query);
    });
  }, [activeFilter, documents, searchTerm]);

  const handleDelete = (doc: DocumentRow) => {
    setSelectedDoc(doc);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedDoc) return;

    try {
      await deleteMutation.mutateAsync(selectedDoc._id);
      message.success(`Đã xóa tài liệu "${selectedDoc.display_name}".`);
      setIsDeleteModalOpen(false);
      setSelectedDoc(null);
    } catch {
      message.error('Không thể xóa tài liệu.');
    }
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      message.warning('Vui lòng chọn file PDF.');
      return;
    }

    try {
      for (const file of selectedFiles) {
        await uploadMutation.mutateAsync(file);
      }

      message.success(`Tải và xử lý ${selectedFiles.length} file PDF thành công.`);
      setSelectedFiles([]);
      setIsDrawerOpen(false);
    } catch {
      message.error('Không thể tải tài liệu PDF.');
    }
  };

  const uploadFileList: UploadFile[] = selectedFiles.map((file) => ({
    uid: `${file.name}-${file.lastModified}`,
    name: file.name,
    status: 'done',
  }));

  const uploadProps: UploadProps = {
    name: 'pdf_file',
    multiple: true,
    maxCount: MAX_UPLOAD_FILES,
    accept: 'application/pdf',
    fileList: uploadFileList,
    beforeUpload: (file) => {
      if (selectedFiles.length >= MAX_UPLOAD_FILES) {
        message.warning(`Bạn chỉ có thể tải tối đa ${MAX_UPLOAD_FILES} file PDF mỗi lần.`);
        return Upload.LIST_IGNORE;
      }

      if (file.type !== 'application/pdf') {
        message.error('Hệ thống chỉ hỗ trợ file PDF.');
        return Upload.LIST_IGNORE;
      }

      if (file.size > MAX_FILE_SIZE) {
        message.error('File PDF không được vượt quá 20MB.');
        return Upload.LIST_IGNORE;
      }

      setSelectedFiles((prev) => {
        if (prev.length >= MAX_UPLOAD_FILES) {
          message.warning(`Bạn chỉ có thể tải tối đa ${MAX_UPLOAD_FILES} file PDF mỗi lần.`);
          return prev;
        }

        if (prev.some((item) => item.name === file.name && item.lastModified === file.lastModified)) {
          return prev;
        }

        return [...prev, file];
      });

      return false;
    },
    onRemove: (file) => {
      setSelectedFiles((prev) => prev.filter((item) => `${item.name}-${item.lastModified}` !== file.uid));
    },
  };

  const columns: ColumnsType<DocumentRow> = [
    {
      title: 'Tài liệu & Nhãn định danh',
      dataIndex: 'display_name',
      key: 'name',
      minWidth: 320,
      render: (text, record) => (
        <div className="flex items-start gap-3 py-1">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 shadow-sm mt-0.5 ${
            record.status === 'FAILED' ? 'bg-red-50 text-red-600' :
            record.status === 'PROCESSING' ? 'bg-blue-50 text-blue-600 relative' : 'bg-indigo-50 text-indigo-600'
          }`}>
            {record.status === 'PROCESSING' ? <SyncOutlined spin className="text-xl" /> : <FilePdfOutlined className="text-xl" />}
          </div>
          <div className="flex flex-col min-w-0 pr-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-900 truncate hover:text-indigo-600 cursor-pointer">{text}</span>
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono shrink-0 ${
                record.status === 'FAILED' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'
              }`}>{record.mime_type}</span>
            </div>
            <span className="text-xs text-gray-500 truncate mt-0.5">{record.error_message || record.original_name}</span>
          </div>
        </div>
      ),
    },
    {
      title: <span className="whitespace-nowrap">Kích thước</span>,
      dataIndex: 'size',
      key: 'size',
      width: 120,
      render: (size) => <span className="font-mono text-sm text-gray-700 font-medium whitespace-nowrap">{formatBytes(size)}</span>,
    },
    {
      title: <span className="whitespace-nowrap">Số trang</span>,
      dataIndex: 'total_pages',
      key: 'pages',
      width: 110,
      render: (pages) => <span className="text-sm text-gray-600 whitespace-nowrap">{pages || 0} trang</span>,
    },
    {
      title: 'Trạng thái RAG',
      key: 'status',
      width: 200,
      render: (_, record) => {
        if (record.status === 'PROCESSING') {
          return (
            <div className="flex flex-col gap-1.5 w-full pr-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-blue-600 font-semibold flex items-center gap-1 whitespace-nowrap">
                  <SyncOutlined spin /> {statusLabel.PROCESSING}
                </span>
                <span className="font-mono text-gray-800 font-bold ml-2">...</span>
              </div>
              <Progress percent={35} showInfo={false} size="small" status="active" />
            </div>
          );
        }
        if (record.status === 'FAILED') {
          return <Tag color="error" className="rounded-full px-2.5 py-1 m-0 border-0 text-xs font-semibold whitespace-nowrap">{statusLabel.FAILED}</Tag>;
        }
        return <Tag color="processing" className="rounded-full px-2.5 py-1 m-0 border-0 bg-indigo-50 text-indigo-700 text-xs font-semibold whitespace-nowrap">{statusLabel.READY}</Tag>;
      },
    },
    {
      title: <span className="whitespace-nowrap">Ngày tải lên</span>,
      dataIndex: 'created_at',
      key: 'uploadDate',
      width: 150,
      render: (text) => <span className="font-mono text-xs text-gray-500 whitespace-nowrap">{formatDate(text)}</span>,
    },
    {
      title: 'Thao tác',
      key: 'actions',
      align: 'right',
      width: 230,
      fixed: 'right',
      render: (_, record) => (
        <div className="flex items-center justify-end gap-1.5 whitespace-nowrap">
          {record.status === 'READY' && (
            <>
              <Button
                type="primary"
                size="small"
                icon={<MessageOutlined />}
                className="bg-indigo-600 hover:bg-indigo-700 text-xs font-medium"
                onClick={() => navigate('/chat', { state: { documentId: record._id } })}
              >
                Hỏi AI
              </Button>
              <Button size="small" icon={<ThunderboltOutlined />} className="text-xs text-gray-600">
                Tóm tắt
              </Button>
            </>
          )}
          {record.status === 'PROCESSING' && (
            <Button size="small" disabled icon={<SyncOutlined spin />} className="text-xs bg-gray-50 text-gray-400">
              Đang xử lý
            </Button>
          )}
          {record.status === 'FAILED' && (
            <Button size="small" disabled icon={<ReloadOutlined />} className="text-xs text-indigo-600 border-indigo-200">
              Thất bại
            </Button>
          )}
          <Button
            type="text"
            danger
            size="small"
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 max-w-[1600px] mx-auto w-full relative flex flex-col gap-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-indigo-100 rounded-full blur-3xl opacity-40 pointer-events-none"></div>
        <div className="flex flex-col gap-1.5 z-10">
          <div className="flex items-center gap-2 text-indigo-600 font-mono text-xs font-medium uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-indigo-600 animate-ping"></span>
            Embedding Vector Store: Active
          </div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Tài liệu của tôi</h1>
          <p className="text-sm text-gray-500">Tải lên và quản lý các tài liệu tri thức dùng cho công nghệ RAG của DOCMIND AI.</p>
        </div>

        <div className="flex flex-wrap items-center gap-4 z-10">
          <div className="flex items-center gap-3 bg-gray-50 border border-gray-100 px-4 py-2.5 rounded-lg shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600">
              <NodeIndexOutlined className="text-xl" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-400 uppercase font-semibold">Documents</span>
              <span className="text-base font-bold text-gray-900">{documents.length}</span>
            </div>
          </div>
          <Button
            type="primary"
            size="large"
            icon={<UploadOutlined />}
            onClick={() => setIsDrawerOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 shadow-md font-medium"
          >
            Tải tài liệu
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 items-center">
        <div className="xl:col-span-5">
          <Input
            size="large"
            prefix={<SearchOutlined className="text-gray-400" />}
            placeholder="Tìm kiếm theo tên tài liệu..."
            className="rounded-lg bg-white border-gray-200"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>
        <div className="xl:col-span-7 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 bg-gray-50 p-1 rounded-xl border border-gray-100">
            <Button type="text" className={`rounded-lg text-sm ${activeFilter === 'all' ? 'bg-white shadow-sm text-indigo-600 font-semibold' : 'text-gray-500'}`} onClick={() => { setActiveFilter('all'); setCurrentPage(1); }}>
              Tất cả <Tag className="ml-1 bg-indigo-50 text-indigo-600 border-0 m-0">{documents.length}</Tag>
            </Button>
            <Button type="text" className={`rounded-lg text-sm ${activeFilter === 'ready' ? 'bg-white shadow-sm text-indigo-600 font-semibold' : 'text-gray-500'}`} onClick={() => { setActiveFilter('ready'); setCurrentPage(1); }}>
              Sẵn sàng <Tag className="ml-1 bg-gray-100 text-gray-500 border-0 m-0">{documents.filter(i => i.status === 'READY').length}</Tag>
            </Button>
            <Button type="text" className={`rounded-lg text-sm ${activeFilter === 'processing' ? 'bg-white shadow-sm text-indigo-600 font-semibold' : 'text-gray-500'}`} onClick={() => { setActiveFilter('processing'); setCurrentPage(1); }}>
              Đang xử lý <Tag className="ml-1 bg-blue-50 text-blue-600 border-0 m-0">{documents.filter(i => i.status === 'PROCESSING').length}</Tag>
            </Button>
            <Button type="text" className={`rounded-lg text-sm ${activeFilter === 'error' ? 'bg-white shadow-sm text-indigo-600 font-semibold' : 'text-gray-500'}`} onClick={() => { setActiveFilter('error'); setCurrentPage(1); }}>
              Thất bại <Tag className="ml-1 bg-red-50 text-red-600 border-0 m-0">{documents.filter(i => i.status === 'FAILED').length}</Tag>
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button icon={<ReloadOutlined />} loading={isFetching} className="text-gray-500 border-gray-200" onClick={() => refetch()} />
            <Button icon={<ControlOutlined />} className="text-gray-500 border-gray-200">Bộ lọc</Button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <Table
          rowSelection={{ type: 'checkbox' }}
          columns={columns}
          dataSource={filteredData}
          loading={isLoading}
          locale={{ emptyText: <Empty description="Chưa có tài liệu" /> }}
          scroll={{ x: 1050 }}
          pagination={{
            current: currentPage,
            pageSize,
            total: filteredData.length,
            onChange: (page, size) => {
              setCurrentPage(page);
              setPageSize(size);
            },
            showTotal: (total, range) => (
              <span className="text-gray-500 text-sm">
                Hiển thị {range[0]} - {range[1]} trên {total} tài liệu
              </span>
            ),
            className: "px-4 py-3 bg-gray-50 m-0 border-t border-gray-100"
          }}
          className="ant-table-striped"
          rowClassName={() => 'hover:bg-gray-50/50'}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-start gap-4 hover:shadow-md transition-all cursor-default">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <NodeIndexOutlined className="text-2xl" />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-sm font-semibold text-gray-900">Embeddings Engine</span>
            <p className="text-xs text-gray-500 leading-relaxed">Sử dụng Gemini Embedding cho từng chunk tài liệu.</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-start gap-4 hover:shadow-md transition-all cursor-default">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <SafetyCertificateOutlined className="text-2xl" />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-sm font-semibold text-gray-900">Bảo mật đa tầng</span>
            <p className="text-xs text-gray-500 leading-relaxed">Tài liệu được phân quyền theo tài khoản đang đăng nhập.</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-start gap-4 hover:shadow-md transition-all cursor-default">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <ThunderboltOutlined className="text-2xl" />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-sm font-semibold text-gray-900">Vector Search RAG</span>
            <p className="text-xs text-gray-500 leading-relaxed">Chỉ tài liệu READY mới được dùng để hỏi AI.</p>
          </div>
        </div>
      </div>

      <Drawer
        title={
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-sm">
              <UploadOutlined className="text-lg" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold text-gray-900 leading-tight">Tải lên tài liệu PDF mới</span>
              <span className="text-xs text-gray-500 font-normal">Trích xuất văn bản và lập chỉ mục Vector</span>
            </div>
          </div>
        }
        placement="right"
        width={560}
        onClose={() => {
          if (!uploadMutation.isPending) {
            setIsDrawerOpen(false);
            setSelectedFiles([]);
          }
        }}
        open={isDrawerOpen}
        footer={
          <div className="flex items-center justify-between gap-4">
            <Button onClick={() => setIsDrawerOpen(false)} className="border-gray-200" disabled={uploadMutation.isPending}>Hủy bỏ</Button>
            <Button type="primary" icon={<ThunderboltOutlined />} className="bg-indigo-600" onClick={handleUpload} loading={uploadMutation.isPending}>
              Bắt đầu xử lý
            </Button>
          </div>
        }
      >
        <div className="flex flex-col gap-6">
          <Dragger {...uploadProps} className="bg-gray-50 hover:bg-gray-100 border-2 border-dashed border-gray-200 hover:border-indigo-400 transition-all rounded-xl p-6">
            <p className="ant-upload-drag-icon text-indigo-500">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text text-sm font-semibold text-gray-800">Kéo thả tài liệu PDF vào đây hoặc nhấn để chọn file</p>
            <p className="ant-upload-hint text-xs text-gray-500 mt-2 px-4">
              Hỗ trợ tối đa <strong>{MAX_UPLOAD_FILES} file PDF/lần</strong>, mỗi file không quá <strong>20MB</strong>.
            </p>
          </Dragger>
        </div>
      </Drawer>

      <Modal
        title={
          <div className="flex items-center gap-2 text-red-600">
            <ExclamationCircleOutlined className="text-xl" />
            <span>Xóa tài liệu vĩnh viễn?</span>
          </div>
        }
        open={isDeleteModalOpen}
        onOk={handleConfirmDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
        confirmLoading={deleteMutation.isPending}
        okText="Xác nhận xóa"
        cancelText="Hủy bỏ"
        okButtonProps={{ danger: true, className: 'shadow-sm' }}
      >
        <div className="py-2 text-gray-600 text-sm leading-relaxed">
          Bạn đang yêu cầu xóa tài liệu <code className="text-red-600 bg-red-50 px-1.5 py-0.5 rounded border border-red-100 mx-1">{selectedDoc?.display_name}</code>.
        </div>
      </Modal>
    </div>
  );
};

export default UserDocumentPage;
