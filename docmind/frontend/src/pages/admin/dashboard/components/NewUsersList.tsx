import React from 'react';
import { UserAddOutlined, ArrowRightOutlined } from '@ant-design/icons';

interface UserItem {
  id: string;
  name: string;
  email: string;
  avatarBg: string;
  avatarColor: string;
  initials: string;
  status: 'active' | 'blocked';
  statusText: string;
  time: string;
}

const users: UserItem[] = [
  {
    id: '1',
    name: 'Trần Bảo Ngọc',
    email: 'ngoc.tran@uit.edu.vn',
    avatarBg: 'bg-indigo-100',
    avatarColor: 'text-indigo-700',
    initials: 'TB',
    status: 'active',
    statusText: 'Hoạt động',
    time: '15 phút trước',
  },
  {
    id: '2',
    name: 'Lê Hoàng Nam',
    email: 'nam.le@fpt.com',
    avatarBg: 'bg-blue-100',
    avatarColor: 'text-blue-700',
    initials: 'LH',
    status: 'active',
    statusText: 'Hoạt động',
    time: '2 giờ trước',
  },
  {
    id: '3',
    name: 'Vũ Minh Quân',
    email: 'quan.vu@vnu.edu.vn',
    avatarBg: 'bg-rose-100',
    avatarColor: 'text-rose-700',
    initials: 'VM',
    status: 'blocked',
    statusText: 'Đã khóa',
    time: 'Hôm qua',
  },
  {
    id: '4',
    name: 'Đỗ Thanh Thảo',
    email: 'thao.do@techcorp.vn',
    avatarBg: 'bg-purple-100',
    avatarColor: 'text-purple-700',
    initials: 'ĐT',
    status: 'active',
    statusText: 'Hoạt động',
    time: '2 ngày trước',
  },
];

export const NewUsersList: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col h-full overflow-hidden">
      <div className="px-5 py-4 flex items-center justify-between border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-2">
          <UserAddOutlined className="text-indigo-600 text-base" />
          <h3 className="text-base font-bold text-slate-800">Người dùng mới</h3>
        </div>
        <button className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer">
          <span>Xem tất cả</span>
          <ArrowRightOutlined className="text-[10px]" />
        </button>
      </div>

      <div className="p-3 divide-y divide-slate-100 flex-1">
        {users.map((user) => (
          <div
            key={user.id}
            className="flex items-center justify-between p-2.5 hover:bg-slate-50/80 rounded-xl transition-colors gap-3"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div
                className={`w-9 h-9 rounded-full ${user.avatarBg} ${user.avatarColor} flex items-center justify-center font-bold text-xs shrink-0`}
              >
                {user.initials}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-slate-800 truncate">{user.name}</span>
                <span className="text-[11px] text-slate-400 truncate">{user.email}</span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1 shrink-0">
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold ${
                  user.status === 'active'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                    : 'bg-rose-50 text-rose-700 border border-rose-100'
                }`}
              >
                {user.statusText}
              </span>
              <span className="text-[11px] text-slate-400">{user.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewUsersList;