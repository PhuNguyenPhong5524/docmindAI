import React, { useState } from 'react';
import { 
  Table, Input, Button, Drawer, Modal, Progress, Tag, Upload 
} from 'antd';
import {
  UploadOutlined, SearchOutlined, ControlOutlined, FilePdfOutlined,
  MessageOutlined, ThunderboltOutlined, DeleteOutlined, SyncOutlined,
  ExclamationCircleOutlined, ReloadOutlined, NodeIndexOutlined, 
  SafetyCertificateOutlined, InboxOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Dragger } = Upload;

interface DocumentType {
  key: string;
  name: string;
  version: string;
  description: string;
  size: string;
  pages: number;
  status: 'ready' | 'processing' | 'error';
  progress?: number;
  uploadDate: string;
}

// Dữ liệu mẫu nhiều mục để test phân trang
const mockData: DocumentType[] = [
  {
    key: '1',
    name: 'Quy_che_dao_tao_UIT.pdf',
    version: 'v2.4',
    description: 'Bản thảo quy định chuẩn tín chỉ & đồ án tốt nghiệp năm học 2024-2025',
    size: '2.4 MB',
    pages: 48,
    status: 'ready',
    uploadDate: '24/10/2024 09:15',
  },
  {
    key: '2',
    name: 'Hop_dong_nghien_cuu_AI.pdf',
    version: 'NDA',
    description: 'Hợp đồng hợp tác chuyển giao công nghệ sinh trắc học và mô hình ngôn ngữ lớn',
    size: '1.8 MB',
    pages: 24,
    status: 'ready',
    uploadDate: '22/10/2024 14:32',
  },
  {
    key: '3',
    name: 'Bao_cao_tai_chinh_Q3.pdf',
    version: 'BETA-PARSER',
    description: 'Bảng cân đối kế toán & kết quả hoạt động kinh doanh hợp nhất',
    size: '8.2 MB',
    pages: 112,
    status: 'processing',
    progress: 45,
    uploadDate: '24/10/2024 10:02',
  },
  {
    key: '4',
    name: 'Scan_giao_trinh_cu.pdf',
    version: 'OCR ERROR',
    description: 'Lỗi OCR: Chất lượng bản quét quá mờ, độ phân giải dưới 150 DPI',
    size: '15.1 MB',
    pages: 30,
    status: 'error',
    uploadDate: '20/10/2024 16:45',
  },
  {
    key: '5',
    name: 'Tai_lieu_Kien_truc_Microservices.pdf',
    version: 'v1.0',
    description: 'Tài liệu thiết kế hệ thống phân tán và giao tiếp giữa các services',
    size: '5.6 MB',
    pages: 64,
    status: 'ready',
    uploadDate: '18/10/2024 11:20',
  },
  {
    key: '6',
    name: 'Huong_dan_su_dung_RAG_API.pdf',
    version: 'v3.1',
    description: 'Quy chuẩn tích hợp chuỗi RAG Pipeline với cơ sở dữ liệu Vector',
    size: '3.1 MB',
    pages: 18,
    status: 'ready',
    uploadDate: '15/10/2024 08:30',
  },
  {
    key: '7',
    name: 'Kiem_thu_hieu_nang_Database.pdf',
    version: 'DRAFT',
    description: 'Báo cáo đo lường tốc độ truy vấn Cosine Similarity trên 1 triệu record',
    size: '12.4 MB',
    pages: 85,
    status: 'processing',
    progress: 70,
    uploadDate: '12/10/2024 15:10',
  },
];

export const UserDocumentPage: React.FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState('all');

  // State quản lý phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(4);

  const handleDelete = (docName: string) => {
    setSelectedDoc(docName);
    setIsDeleteModalOpen(true);
  };

  // Cấu hình cột đã sửa kích thước
  const columns: ColumnsType<DocumentType> = [
    {
      title: 'Tài liệu & Nhãn định danh',
      dataIndex: 'name',
      key: 'name',
      minWidth: 320,
      render: (text, record) => (
        <div className="flex items-start gap-3 py-1">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 shadow-sm mt-0.5 ${
            record.status === 'error' ? 'bg-red-50 text-red-600' :
            record.status === 'processing' ? 'bg-blue-50 text-blue-600 relative' : 'bg-indigo-50 text-indigo-600'
          }`}>
            {record.status === 'processing' ? <SyncOutlined spin className="text-xl" /> : <FilePdfOutlined className="text-xl" />}
          </div>
          <div className="flex flex-col min-w-0 pr-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-900 truncate hover:text-indigo-600 cursor-pointer">{text}</span>
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono shrink-0 ${
                record.status === 'error' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'
              }`}>{record.version}</span>
            </div>
            <span className="text-xs text-gray-500 truncate mt-0.5">{record.description}</span>
          </div>
        </div>
      ),
    },
    {
      title: <span className="whitespace-nowrap">Kích thước</span>,
      dataIndex: 'size',
      key: 'size',
      width: 120,
      render: (text) => <span className="font-mono text-sm text-gray-700 font-medium whitespace-nowrap">{text}</span>,
    },
    {
      title: <span className="whitespace-nowrap">Số trang</span>,
      dataIndex: 'pages',
      key: 'pages',
      width: 110,
      render: (text) => <span className="text-sm text-gray-600 whitespace-nowrap">{text} trang</span>,
    },
    {
      title: 'Trạng thái RAG',
      key: 'status',
      width: 200,
      render: (_, record) => {
        if (record.status === 'processing') {
          return (
            <div className="flex flex-col gap-1.5 w-full pr-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-blue-600 font-semibold flex items-center gap-1 whitespace-nowrap">
                  <SyncOutlined spin /> Trích xuất vector
                </span>
                <span className="font-mono text-gray-800 font-bold ml-2">{record.progress}%</span>
              </div>
              <Progress percent={record.progress} showInfo={false} size="small" status="active" />
            </div>
          );
        }
        if (record.status === 'error') {
          return <Tag color="error" className="rounded-full px-2.5 py-1 m-0 border-0 text-xs font-semibold whitespace-nowrap">FAILED (OCR Fault)</Tag>;
        }
        return <Tag color="processing" className="rounded-full px-2.5 py-1 m-0 border-0 bg-indigo-50 text-indigo-700 text-xs font-semibold whitespace-nowrap">READY (Indexed)</Tag>;
      },
    },
    {
      title: <span className="whitespace-nowrap">Ngày tải lên</span>,
      dataIndex: 'uploadDate',
      key: 'uploadDate',
      width: 150,
      render: (text) => <span className="font-mono text-xs text-gray-500 whitespace-nowrap">{text}</span>,
    },
    {
      title: 'Thao tác',
      key: 'actions',
      align: 'right',
      width: 230,
      fixed: 'right',
      render: (_, record) => (
        <div className="flex items-center justify-end gap-1.5 whitespace-nowrap">
          {record.status === 'ready' && (
            <>
              <Button type="primary" size="small" icon={<MessageOutlined />} className="bg-indigo-600 hover:bg-indigo-700 text-xs font-medium">
                Hỏi AI
              </Button>
              <Button size="small" icon={<ThunderboltOutlined />} className="text-xs text-gray-600">
                Tóm tắt
              </Button>
            </>
          )}
          {record.status === 'processing' && (
            <Button size="small" disabled icon={<SyncOutlined spin />} className="text-xs bg-gray-50 text-gray-400">
              Đang xử lý
            </Button>
          )}
          {record.status === 'error' && (
            <Button size="small" icon={<ReloadOutlined />} className="text-xs text-indigo-600 border-indigo-200">
              Thử lại
            </Button>
          )}
          <Button 
            type="text" 
            danger 
            size="small" 
            icon={<DeleteOutlined />} 
            onClick={() => handleDelete(record.name)} 
          />
        </div>
      ),
    },
  ];

  // Lọc dữ liệu theo tab chọn
  const filteredData = mockData.filter((item) => {
    if (activeFilter === 'ready') return item.status === 'ready';
    if (activeFilter === 'processing') return item.status === 'processing';
    if (activeFilter === 'error') return item.status === 'error';
    return true;
  });

  return (
    <div className="p-6 max-w-[1600px] mx-auto w-full relative flex flex-col gap-6">
      
      {/* Header Section */}
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
              <span className="text-[10px] text-gray-400 uppercase font-semibold">Vectors Indexed</span>
              <span className="text-base font-bold text-gray-900">142,850</span>
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

      {/* Toolbar */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 items-center">
        <div className="xl:col-span-5">
          <Input 
            size="large" 
            prefix={<SearchOutlined className="text-gray-400" />} 
            placeholder="Tìm kiếm theo tên tài liệu, ID, hoặc metadata..." 
            className="rounded-lg bg-white border-gray-200"
            suffix={<span className="text-xs text-gray-400 border px-1.5 py-0.5 rounded">⌘ K</span>}
          />
        </div>
        <div className="xl:col-span-7 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 bg-gray-50 p-1 rounded-xl border border-gray-100">
            <Button type="text" className={`rounded-lg text-sm ${activeFilter === 'all' ? 'bg-white shadow-sm text-indigo-600 font-semibold' : 'text-gray-500'}`} onClick={() => { setActiveFilter('all'); setCurrentPage(1); }}>
              Tất cả <Tag className="ml-1 bg-indigo-50 text-indigo-600 border-0 m-0">{mockData.length}</Tag>
            </Button>
            <Button type="text" className={`rounded-lg text-sm ${activeFilter === 'ready' ? 'bg-white shadow-sm text-indigo-600 font-semibold' : 'text-gray-500'}`} onClick={() => { setActiveFilter('ready'); setCurrentPage(1); }}>
              Sẵn sàng <Tag className="ml-1 bg-gray-100 text-gray-500 border-0 m-0">{mockData.filter(i => i.status === 'ready').length}</Tag>
            </Button>
            <Button type="text" className={`rounded-lg text-sm ${activeFilter === 'processing' ? 'bg-white shadow-sm text-indigo-600 font-semibold' : 'text-gray-500'}`} onClick={() => { setActiveFilter('processing'); setCurrentPage(1); }}>
              Đang xử lý <Tag className="ml-1 bg-blue-50 text-blue-600 border-0 m-0">{mockData.filter(i => i.status === 'processing').length}</Tag>
            </Button>
            <Button type="text" className={`rounded-lg text-sm ${activeFilter === 'error' ? 'bg-white shadow-sm text-indigo-600 font-semibold' : 'text-gray-500'}`} onClick={() => { setActiveFilter('error'); setCurrentPage(1); }}>
              Thất bại <Tag className="ml-1 bg-red-50 text-red-600 border-0 m-0">{mockData.filter(i => i.status === 'error').length}</Tag>
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button icon={<ReloadOutlined />} className="text-gray-500 border-gray-200" />
            <Button icon={<ControlOutlined />} className="text-gray-500 border-gray-200">Bộ lọc</Button>
          </div>
        </div>
      </div>

      {/* Main Table với Phân Trang và Scroll ngang */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <Table 
          rowSelection={{ type: 'checkbox' }}
          columns={columns} 
          dataSource={filteredData} 
          scroll={{ x: 1050 }}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: filteredData.length,
            onChange: (page, size) => {
              setCurrentPage(page);
              setPageSize(size);
            },
            showTotal: (total, range) => (
              <span className="text-gray-500 text-sm">
                Hiển thị {range[0]} - {range[1]} trên {total} tài liệu • Dung lượng: <strong className="text-gray-800">27.5 MB / 2 GB</strong>
              </span>
            ),
            className: "px-4 py-3 bg-gray-50 m-0 border-t border-gray-100"
          }}
          className="ant-table-striped"
          rowClassName={() => 'hover:bg-gray-50/50'}
        />
      </div>

      {/* Bento Stats Footer */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-start gap-4 hover:shadow-md transition-all cursor-default">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <NodeIndexOutlined className="text-2xl" />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-sm font-semibold text-gray-900">Embeddings Engine</span>
            <p className="text-xs text-gray-500 leading-relaxed">Sử dụng mô hình <code className="bg-gray-50 text-indigo-600 px-1 py-0.5 rounded border border-gray-100">text-embedding-3-large</code> 3072 chiều.</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-start gap-4 hover:shadow-md transition-all cursor-default">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <SafetyCertificateOutlined className="text-2xl" />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-sm font-semibold text-gray-900">Bảo mật đa tầng</span>
            <p className="text-xs text-gray-500 leading-relaxed">Tài liệu được mã hóa AES-256 at-rest và phân tách phân quyền workspace.</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-start gap-4 hover:shadow-md transition-all cursor-default">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <ThunderboltOutlined className="text-2xl" />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-sm font-semibold text-gray-900">Hybrid Search RAG</span>
            <p className="text-xs text-gray-500 leading-relaxed">Kết hợp BM25 Keyword Search và Vector Cosine Similarity cho phản hồi &lt;400ms.</p>
          </div>
        </div>
      </div>

      {/* Upload Drawer */}
      <Drawer
        title={
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-sm">
              <UploadOutlined className="text-lg" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold text-gray-900 leading-tight">Tải lên tài liệu PDF mới</span>
              <span className="text-xs text-gray-500 font-normal">Trích xuất văn bản, nhận diện và lập chỉ mục Vector</span>
            </div>
          </div>
        }
        placement="right"
        width={560}
        onClose={() => setIsDrawerOpen(false)}
        open={isDrawerOpen}
        footer={
          <div className="flex items-center justify-between gap-4">
            <Button onClick={() => setIsDrawerOpen(false)} className="border-gray-200">Hủy bỏ</Button>
            <Button type="primary" icon={<ThunderboltOutlined />} className="bg-indigo-600" onClick={() => setIsDrawerOpen(false)}>
              Bắt đầu xử lý (Embed RAG)
            </Button>
          </div>
        }
      >
        <div className="flex flex-col gap-6">
          <Dragger name="file" multiple={true} className="bg-gray-50 hover:bg-gray-100 border-2 border-dashed border-gray-200 hover:border-indigo-400 transition-all rounded-xl p-6">
            <p className="ant-upload-drag-icon text-indigo-500">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text text-sm font-semibold text-gray-800">Kéo thả tài liệu PDF vào đây hoặc nhấn để chọn file</p>
            <p className="ant-upload-hint text-xs text-gray-500 mt-2 px-4">
              Hỗ trợ tài liệu PDF tối đa <strong>50MB/file</strong>.
            </p>
          </Dragger>
        </div>
      </Drawer>

      {/* Delete Confirmation Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2 text-red-600">
            <ExclamationCircleOutlined className="text-xl" />
            <span>Xóa tài liệu vĩnh viễn?</span>
          </div>
        }
        open={isDeleteModalOpen}
        onOk={() => setIsDeleteModalOpen(false)}
        onCancel={() => setIsDeleteModalOpen(false)}
        okText="Xác nhận xóa"
        cancelText="Hủy bỏ"
        okButtonProps={{ danger: true, className: 'shadow-sm' }}
      >
        <div className="py-2 text-gray-600 text-sm leading-relaxed">
          Bạn đang yêu cầu xóa tài liệu <code className="text-red-600 bg-red-50 px-1.5 py-0.5 rounded border border-red-100 mx-1">{selectedDoc}</code>.
        </div>
      </Modal>

    </div>
  );
};

export default UserDocumentPage;