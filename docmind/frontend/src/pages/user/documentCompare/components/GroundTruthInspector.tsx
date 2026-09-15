import React from 'react';

export const GroundTruthInspector: React.FC = () => {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 space-y-3">
      <div className="flex items-center justify-between text-xs text-slate-500 border-b border-slate-100 pb-2">
        <span className="font-bold text-slate-800 text-sm">Bằng chứng trích xuất đối chiếu (Ground Truth)</span>
        <span>OCR Accuracy: 99.5%</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/60 font-mono text-xs text-slate-700">
          <span className="font-bold text-slate-500 block mb-1">Doc A (Trang 18, Điều 15):</span>
          "2. Chuẩn trình độ Tiếng Anh: Sinh viên phải đạt chứng chỉ TOEIC tối thiểu 450 điểm..."
        </div>
        <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/60 font-mono text-xs text-slate-700">
          <span className="font-bold text-indigo-600 block mb-1">Doc B (Trang 23, Điều 18):</span>
          "1b. Chuẩn đầu ra Tiếng Anh tối thiểu: Bắt buộc đạt chứng chỉ TOEIC 550 điểm hoặc IELTS 5.5..."
        </div>
      </div>
    </div>
  );
};