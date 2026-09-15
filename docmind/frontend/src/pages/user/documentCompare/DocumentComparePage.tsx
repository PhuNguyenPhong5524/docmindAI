import { useState } from 'react';
import { Button, Tag, message } from 'antd';
import {
  SyncOutlined,
  DownloadOutlined,
  ShareAltOutlined,
  ThunderboltOutlined,
  CopyOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';

import { DocCard } from './components/DocCard';
import { MatrixCard } from './components/MatrixCard';
import { SemanticQueryBar } from './components/SemanticQueryBar';
import { GroundTruthInspector } from './components/GroundTruthInspector';

const DocumentComparePage = () => {
  const [activeTab, setActiveTab] = useState<'matrix' | 'summary'>('matrix');
  const [prompt, setPrompt] = useState(
    'So sánh sự thay đổi về chuẩn đầu ra ngoại ngữ và điều kiện xét tốt nghiệp giữa hai phiên bản quy chế.'
  );
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const handleRunCompare = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      messageApi.success('Đã cập nhật dữ liệu so sánh RAG ma trận!');
    }, 1000);
  };

  return (
    <div className="w-full space-y-6 p-6">
      {contextHolder}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Tag color="indigo" className="uppercase font-semibold tracking-wide">
              DocMind Neural Diff 2.4
            </Tag>
            <span className="text-xs font-mono text-slate-400">v2.4.0-RAG</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">So sánh tài liệu</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Đối chiếu quy định và điều khoản giữa hai file PDF bằng AI RAG với trích dẫn chi tiết.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button icon={<DownloadOutlined />} onClick={() => messageApi.loading('Đang xuất PDF...', 1)}>
            Xuất PDF
          </Button>
          <Button
            icon={<ShareAltOutlined />}
            onClick={() => {
              navigator.clipboard?.writeText(window.location.href);
              messageApi.info('Đã sao chép liên kết!');
            }}
          >
            Chia sẻ
          </Button>
        </div>
      </div>

      {/* Dock chọn tài liệu */}
      <div className="grid grid-cols-1 lg:grid-cols-11 gap-4 items-center">
        <div className="lg:col-span-5">
          <DocCard
            type="A"
            label="Tài liệu A (Gốc / Đối chiếu)"
            title="Quy_che_dao_tao_UIT_2021.pdf"
            pages={42}
            size="2.1 MB"
            chunks={1280}
            uploadDate="14/10/2023"
            badgeBg="bg-slate-200 text-slate-700"
          />
        </div>
        <div className="lg:col-span-1 flex justify-center py-2 lg:py-0">
          <div className="w-10 h-10 rounded-full bg-indigo-600 text-white shadow-md flex items-center justify-center font-bold text-sm relative">
            VS
            <SyncOutlined spin className="absolute -top-1 -right-1 text-xs text-indigo-200" />
          </div>
        </div>
        <div className="lg:col-span-5">
          <DocCard
            type="B"
            label="Tài liệu B (Mới / Sửa đổi)"
            title="Quy_che_dao_tao_UIT_2024.pdf"
            pages={48}
            size="2.4 MB"
            chunks={1410}
            uploadDate="05/01/2024"
            badgeBg="bg-indigo-100 text-indigo-700"
          />
        </div>
      </div>

      {/* Status Banner */}
      <div className="flex items-center justify-between bg-slate-100/80 px-4 py-2.5 rounded-lg text-xs text-slate-600 border border-slate-200/60">
        <div className="flex items-center gap-2">
          <CheckCircleOutlined className="text-indigo-600 text-sm" />
          <span>
            Quy tắc so khớp: <strong className="text-slate-800">Trạng thái Vectorized (Sẵn sàng)</strong>
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-slate-500">
          <span>Vector Similarity Cosine: <strong>0.88</strong></span>
          <span className="text-indigo-600 font-medium">Deep-Scan Active</span>
        </div>
      </div>

      {/* Khung tìm kiếm Semantic */}
      <SemanticQueryBar
        prompt={prompt}
        setPrompt={setPrompt}
        loading={loading}
        onRunCompare={handleRunCompare}
      />

      {/* Tabs chuyển đổi */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-2">
        <div className="flex items-center gap-2">
          <Button
            type={activeTab === 'matrix' ? 'primary' : 'default'}
            onClick={() => setActiveTab('matrix')}
            className={activeTab === 'matrix' ? 'bg-indigo-600' : ''}
          >
            So sánh chi tiết (Matrix) <span className="ml-1 text-xs opacity-80">(3)</span>
          </Button>
          <Button
            type={activeTab === 'summary' ? 'primary' : 'default'}
            onClick={() => setActiveTab('summary')}
            className={activeTab === 'summary' ? 'bg-indigo-600' : ''}
          >
            Tóm tắt tổng quan RAG
          </Button>
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500" /> 1 Tăng</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500" /> 1 Thay đổi</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" /> 1 Giữ nguyên</span>
        </div>
      </div>

      {/* Banner AI Insights */}
      <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 mt-0.5">
            <ThunderboltOutlined />
          </div>
          <div>
            <h4 className="text-sm font-bold text-indigo-900">Phân tích chéo hoàn tất · Độ tin cậy 98.4%</h4>
            <p className="text-xs text-slate-600 mt-0.5">
              AI đã phát hiện <strong>3 điểm thay đổi trọng yếu</strong> và <strong>2 điều khoản giữ nguyên</strong> giữa 2 văn bản.
            </p>
          </div>
        </div>
        <Button size="small" icon={<CopyOutlined />} onClick={() => messageApi.success('Đã sao chép Markdown!')}>
          Sao chép Markdown
        </Button>
      </div>

      {/* Danh sách Ma trận so sánh / Tóm tắt */}
      {activeTab === 'matrix' ? (
        <div className="space-y-4">
          <MatrixCard
            index="01"
            title="Chuẩn đầu ra Tiếng Anh"
            subtitle="Quy định mức điểm chứng chỉ quốc tế xét tốt nghiệp"
            tagText="Tăng yêu cầu (+100 điểm)"
            tagType="error"
            docA={{
              clause: 'Điều 15, Khoản 2',
              content: <>Sinh viên cần đạt chứng chỉ tối thiểu <mark className="bg-indigo-100 text-indigo-900 px-1 rounded">TOEIC 450</mark> hoặc TOEFL ITP 450 điểm.</>,
              page: 18,
              chunk: 'Chunk #142',
            }}
            docB={{
              clause: 'Điều 18, Khoản 1b',
              content: <>Nâng chuẩn đầu ra lên <mark className="bg-red-100 text-red-800 px-1 rounded font-bold">TOEIC 550</mark> hoặc <mark className="bg-red-100 text-red-800 px-1 rounded font-bold">IELTS 5.5</mark>. Bỏ TOEFL ITP nội bộ.</>,
              page: 23,
              chunk: 'Chunk #308',
            }}
            aiInsight="Yêu cầu ngoại ngữ tăng thêm 100 điểm TOEIC, bắt buộc đạt tiêu chuẩn tương đương B2 CEFR."
          />

          <MatrixCard
            index="02"
            title="Thời hạn công nhận hiệu lực chứng chỉ"
            subtitle="Thời gian tính từ ngày thi tới thời điểm xét nộp tốt nghiệp"
            tagText="Sửa đổi (Rút ngắn)"
            tagType="warning"
            docA={{
              clause: 'Điều 16, Khoản 1',
              content: <>Chứng chỉ ngoại ngữ có giá trị nộp xét tốt nghiệp trong vòng <mark className="bg-indigo-100 text-indigo-900 px-1 rounded">tối đa 3 năm (36 tháng)</mark>.</>,
              page: 19,
              chunk: 'Chunk #155',
            }}
            docB={{
              clause: 'Điều 18, Khoản 3',
              content: <>Rút ngắn thời hạn công nhận còn <mark className="bg-amber-100 text-amber-900 px-1 rounded font-bold">2 năm (24 tháng)</mark> theo chuẩn ETS / IDP.</>,
              page: 24,
              chunk: 'Chunk #321',
            }}
            aiInsight="Sinh viên cần chú ý thời hạn chứng chỉ để nộp trước khi hết 24 tháng."
          />

          <MatrixCard
            index="03"
            title="Điểm trung bình tích lũy (GPA) tốt nghiệp"
            subtitle="Ngưỡng điểm tối thiểu tích lũy toàn khóa hệ 4.0"
            tagText="Giữ nguyên (Không đổi)"
            tagType="success"
            docA={{
              clause: 'Điều 14, Khoản 1a',
              content: <>Điểm trung bình tích lũy toàn khóa học thang điểm 4 đạt tối thiểu từ <span className="font-bold">2.00 / 4.00</span> trở lên.</>,
              page: 17,
              chunk: 'Chunk #130',
            }}
            docB={{
              clause: 'Điều 17, Khoản 1a',
              content: <>Điểm trung bình tích lũy toàn khóa học thang điểm 4 đạt tối thiểu từ <span className="font-bold">2.00 / 4.00</span> trở lên (Không đổi).</>,
              page: 22,
              chunk: 'Chunk #295',
            }}
            aiInsight="Quy định điểm số nền tảng duy trì ổn định qua các chu kỳ kiểm định."
          />
        </div>
      ) : (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 space-y-4">
          <h3 className="text-lg font-bold text-slate-800">Tóm lược tổng quan RAG</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            Văn bản <strong>Quy chế Đào tạo 2024 (Tài liệu B)</strong> siết chặt chuẩn đầu ra Anh ngữ và rút ngắn thời gian hiệu lực của chứng chỉ xuống 24 tháng. Mức chuẩn GPA duy trì ổn định 2.0/4.0.
          </p>
        </div>
      )}

      {/* Trích xuất Ground Truth */}
      <GroundTruthInspector />
    </div>
  );
}

export default DocumentComparePage;