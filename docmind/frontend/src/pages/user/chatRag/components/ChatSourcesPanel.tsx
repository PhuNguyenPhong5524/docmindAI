import React from 'react';
import { Switch, Button } from 'antd';
import { 
  FilePdfOutlined, 
  FileWordOutlined, 
  PlusCircleOutlined, 
  SafetyOutlined,
  DatabaseOutlined
} from '@ant-design/icons';

export const ChatSourcesPanel: React.FC = () => {
  return (
    <aside className="w-[280px] shrink-0 bg-white flex flex-col justify-between border-l border-gray-200 z-10 select-none">
      <div className="flex flex-col h-full min-h-0">
        <div className="p-3 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DatabaseOutlined className="text-indigo-600" />
            <h2 className="text-sm font-bold text-gray-900">Tài liệu đang chọn</h2>
          </div>
          <span className="text-[11px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-bold">1 file</span>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          {/* File Card Đang kích hoạt */}
          <div className="bg-gray-50 p-3 rounded-xl border border-indigo-100 space-y-3">
            <div className="flex items-start gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                <FilePdfOutlined className="text-lg" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-xs font-bold text-gray-900 truncate" title="Quy_che_dao_tao_UIT.pdf">Quy_che_dao_tao_UIT.pdf</h3>
                <div className="flex items-center gap-2 mt-0.5 text-[11px] text-gray-400 font-mono">
                  <span>48 trang</span>
                  <span>•</span>
                  <span>2.4 MB</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-gray-200/60">
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                READY (Indexed)
              </span>
              <Switch defaultChecked size="small" />
            </div>

            <div className="p-2 bg-white rounded-lg grid grid-cols-2 gap-2 text-center border border-gray-100">
              <div>
                <div className="text-[10px] text-gray-400 uppercase font-mono">Chunks</div>
                <div className="text-xs font-semibold text-gray-800">192</div>
              </div>
              <div>
                <div className="text-[10px] text-gray-400 uppercase font-mono">Độ khớp</div>
                <div className="text-xs font-semibold text-indigo-600">Top 1 (100%)</div>
              </div>
            </div>
          </div>

          {/* File Card Tắt ngữ cảnh */}
          <div className="bg-white p-3 rounded-xl border border-gray-100 opacity-60 hover:opacity-100 transition-opacity">
            <div className="flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gray-100 text-gray-500 flex items-center justify-center shrink-0">
                <FileWordOutlined />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-medium text-gray-800 truncate">Thong_bao_hoc_phi.docx</h4>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-[10px] text-gray-400 font-mono">12 trang • 540 KB</span>
                  <Switch size="small" />
                </div>
              </div>
            </div>
          </div>

          <Button block icon={<PlusCircleOutlined />} className="text-xs font-semibold text-indigo-600 border-dashed border-indigo-200">
            Chọn thêm tài liệu
          </Button>
        </div>

        <div className="p-3 bg-gray-50 border-t border-gray-100 space-y-2">
          <div className="flex items-start gap-2 text-gray-500">
            <SafetyOutlined className="text-indigo-600 mt-0.5 shrink-0" />
            <p className="text-[11px] leading-relaxed">
              <strong className="text-gray-800">Bảo mật RAG:</strong> AI chỉ trích xuất thông tin từ các tài liệu đang bật công tắc.
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};