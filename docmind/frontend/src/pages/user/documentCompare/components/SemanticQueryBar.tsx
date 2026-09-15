import React from 'react';
import { Input, Button, Tag } from 'antd';
import { SyncOutlined } from '@ant-design/icons';

const { TextArea } = Input;

interface SemanticQueryBarProps {
  prompt: string;
  setPrompt: React.Dispatch<React.SetStateAction<string>>;
  loading: boolean;
  onRunCompare: () => void;
}

export const SemanticQueryBar: React.FC<SemanticQueryBarProps> = ({
  prompt,
  setPrompt,
  loading,
  onRunCompare,
}) => {
  const tags = ['Tiêu chuẩn tiếng Anh', 'Quy định tốt nghiệp', 'Chính sách bảo lưu'];

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 space-y-3">
      <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
        <span>Yêu cầu nội dung so sánh chuyên sâu (Semantic Query)</span>
        <span className="text-slate-400 font-normal">Gợi ý: chuẩn đầu ra, học phí, hoãn thi, GPA</span>
      </label>
      <TextArea
        rows={3}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Nhập câu hỏi hoặc các điều khoản cần đối chiếu..."
        className="rounded-lg text-sm"
      />
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-1.5 flex-wrap mb-4">
          <span className="text-xs text-slate-400">Tags:</span>
          {tags.map((tag) => (
            <Tag
              key={tag}
              className="cursor-pointer hover:border-indigo-500 hover:text-indigo-600 transition-colors"
              onClick={() => setPrompt((prev) => (prev ? `${prev} (${tag})` : tag))}
            >
              {tag}
            </Tag>
          ))}
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <Button size="small" type="text" onClick={() => setPrompt('')}>
            Đặt lại
          </Button>
          <Button
            type="primary"
            icon={<SyncOutlined spin={loading} />}
            loading={loading}
            onClick={onRunCompare}
            className="bg-indigo-600 hover:bg-indigo-500"
          >
            So sánh bằng AI
          </Button>
        </div>
      </div>
    </div>
  );
};