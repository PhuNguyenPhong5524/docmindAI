import React from 'react';
import { Empty, Select, Switch } from 'antd';
import {
  FilePdfOutlined,
  SafetyOutlined,
  DatabaseOutlined
} from '@ant-design/icons';
import type { UserDocument } from '../../../../types/document';

interface ChatSourcesPanelProps {
  documents: UserDocument[];
  selectedDocumentId?: string;
  onSelectDocument: (documentId: string) => void;
}

const formatBytes = (bytes: number) => {
  if (!bytes) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${(bytes / 1024 ** index).toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
};

export const ChatSourcesPanel: React.FC<ChatSourcesPanelProps> = ({
  documents,
  selectedDocumentId,
  onSelectDocument,
}) => {
  const selectedDocument = documents.find((doc) => doc._id === selectedDocumentId);

  return (
    <aside className="w-[280px] shrink-0 bg-white flex flex-col justify-between border-l border-gray-200 z-10 select-none">
      <div className="flex flex-col h-full min-h-0">
        <div className="p-3 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DatabaseOutlined className="text-indigo-600" />
            <h2 className="text-sm font-bold text-gray-900">Tài liệu đang chọn</h2>
          </div>
          <span className="text-[11px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-bold">{documents.length} file</span>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          <Select
            className="w-full"
            placeholder="Chọn tài liệu READY"
            value={selectedDocumentId}
            onChange={onSelectDocument}
            options={documents.map((doc) => ({
              value: doc._id,
              label: doc.display_name,
            }))}
          />

          {selectedDocument ? (
            <div className="bg-gray-50 p-3 rounded-xl border border-indigo-100 space-y-3">
              <div className="flex items-start gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                  <FilePdfOutlined className="text-lg" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xs font-bold text-gray-900 truncate" title={selectedDocument.display_name}>{selectedDocument.display_name}</h3>
                  <div className="flex items-center gap-2 mt-0.5 text-[11px] text-gray-400 font-mono">
                    <span>{selectedDocument.total_pages || 0} trang</span>
                    <span>•</span>
                    <span>{formatBytes(selectedDocument.size)}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-gray-200/60">
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  READY (Indexed)
                </span>
                <Switch checked size="small" />
              </div>
            </div>
          ) : (
            <Empty description="Chưa chọn tài liệu" />
          )}

          <div className="space-y-2">
            {documents.filter((doc) => doc._id !== selectedDocumentId).map((doc) => (
              <button
                key={doc._id}
                type="button"
                onClick={() => onSelectDocument(doc._id)}
                className="w-full bg-white p-3 rounded-xl border border-gray-100 hover:border-indigo-300 transition-all text-left"
              >
                <div className="flex items-start gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center shrink-0">
                    <FilePdfOutlined />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-medium text-gray-800 truncate">{doc.display_name}</h4>
                    <span className="text-[10px] text-gray-400 font-mono">{doc.total_pages || 0} trang • {formatBytes(doc.size)}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="p-3 bg-gray-50 border-t border-gray-100 space-y-2">
          <div className="flex items-start gap-2 text-gray-500">
            <SafetyOutlined className="text-indigo-600 mt-0.5 shrink-0" />
            <p className="text-[11px] leading-relaxed">
              <strong className="text-gray-800">Bảo mật RAG:</strong> AI chỉ trích xuất thông tin từ tài liệu READY đang chọn.
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};
