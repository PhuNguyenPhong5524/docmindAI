import React from 'react';
import {
  UsergroupAddOutlined,
  FileTextOutlined,
  MessageOutlined,
  ThunderboltOutlined,
  ArrowUpOutlined,
  CheckCircleOutlined,
  ThunderboltFilled,
  SafetyCertificateOutlined,
} from '@ant-design/icons';

interface MetricItem {
  title: string;
  value: string;
  icon: React.ReactNode;
  iconBg: string;
  badgeText: string;
  badgeIcon: React.ReactNode;
  badgeColor: string;
  subText: string;
}

const metrics: MetricItem[] = [
  {
    title: 'Tổng người dùng',
    value: '126',
    icon: <UsergroupAddOutlined className="text-xl text-indigo-600" />,
    iconBg: 'bg-indigo-50',
    badgeText: '+12',
    badgeIcon: <ArrowUpOutlined />,
    badgeColor: 'text-emerald-600',
    subText: 'Gia nhập trong tháng',
  },
  {
    title: 'Tổng tài liệu',
    value: '342',
    icon: <FileTextOutlined className="text-xl text-blue-600" />,
    iconBg: 'bg-blue-50',
    badgeText: '100%',
    badgeIcon: <CheckCircleOutlined />,
    badgeColor: 'text-indigo-600',
    subText: 'Đã vector hóa toàn diện',
  },
  {
    title: 'Cuộc trò chuyện',
    value: '481',
    icon: <MessageOutlined className="text-xl text-purple-600" />,
    iconBg: 'bg-purple-50',
    badgeText: 'RAG Live',
    badgeIcon: <ThunderboltFilled className="text-amber-500" />,
    badgeColor: 'text-indigo-700 font-bold',
    subText: 'Phiên hỏi đáp đa ngữ',
  },
  {
    title: 'Câu hỏi AI',
    value: '1,248',
    icon: <ThunderboltOutlined className="text-xl text-indigo-600" />,
    iconBg: 'bg-indigo-50',
    badgeText: '99.2%',
    badgeIcon: <SafetyCertificateOutlined />,
    badgeColor: 'text-emerald-600',
    subText: 'Trích dẫn chính xác',
  },
];

export const MetricCards: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((item, idx) => (
        <div
          key={idx}
          className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between overflow-hidden"
        >
          <div className="p-5 flex items-start justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500">{item.title}</span>
              <div className="mt-1">
                <span className="text-3xl font-extrabold text-slate-900 tracking-tight">{item.value}</span>
              </div>
            </div>
            <div className={`w-11 h-11 rounded-xl ${item.iconBg} flex items-center justify-center shrink-0`}>
              {item.icon}
            </div>
          </div>
          <div className="bg-slate-50/80 px-5 py-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className={`inline-flex items-center gap-1 font-semibold ${item.badgeColor}`}>
              {item.badgeIcon} {item.badgeText}
            </span>
            <span className="text-slate-400 font-medium">{item.subText}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MetricCards;