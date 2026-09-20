import React from 'react';
import { Drawer, Button } from 'antd';
import { SafetyCertificateOutlined, LockOutlined, UnlockOutlined } from '@ant-design/icons';
import type { User } from '../../../../types/adminUser';

interface UserDetailDrawerProps {
  open: boolean;
  user: User | null;
  onClose: () => void;
  onOpenBlockModal: (user: User) => void;
}

export const UserDetailDrawer: React.FC<UserDetailDrawerProps> = ({
  open,
  user,
  onClose,
  onOpenBlockModal,
}) => {
  if (!user) return null;

  // Lấy joinDate từ backend gửi lên, nếu không có thì tự format
  const joinDate = user.joinDate || (user.created_at 
    ? new Date(user.created_at).toLocaleDateString('vi-VN') 
    : 'Mới tham gia');

  // Lấy dữ liệu THẬT 100% từ Database do Backend gửi sang
  const docsCount = user.docsCount || 0;
  const storageUsed = user.totalStorage || "0.00"; 
  const chatsCount = user.chatsCount || 0;

  const isAdmin = user.role === 'ADMIN';
  const isActive = user.status === 'ACTIVE';

  return (
    <Drawer
      title={<span className="text-slate-800 font-bold">Chi tiết người dùng</span>}
      placement="right"
      onClose={onClose}
      open={open}
      width={450}
      footer={
        <div className="flex justify-between items-center py-2">
          <Button onClick={onClose} className="border-slate-300 text-slate-600 font-medium rounded-lg">
            Đóng
          </Button>
          <Button 
            onClick={() => onOpenBlockModal(user)} 
            danger={isActive}
            className={`font-medium rounded-lg border-none text-white ${isActive ? 'bg-red-500 hover:bg-red-600' : 'bg-emerald-500 hover:bg-emerald-600'}`}
            icon={isActive ? <LockOutlined /> : <UnlockOutlined />}
          >
            {isActive ? 'Khóa tài khoản' : 'Mở khóa tài khoản'}
          </Button>
        </div>
      }
    >
      <div className="flex flex-col items-center mb-6 mt-2">
        <div className="w-24 h-24 rounded-full bg-indigo-600 text-white flex items-center justify-center text-3xl font-bold shadow-md mb-4">
          {user.name ? user.name.substring(0, 2).toUpperCase() : 'U'}
        </div>
        <h2 className="text-xl font-bold text-slate-900">{user.name || user.full_name || 'Người dùng'}</h2>
        <p className="text-sm text-slate-500 mb-3">{user.email}</p>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 text-xs font-bold text-indigo-700 bg-indigo-50 rounded-md border border-indigo-100">
            {user.role || 'USER'}
          </span>
          <span className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-md border ${
            isActive ? 'text-emerald-700 bg-emerald-50 border-emerald-200' : 'text-red-700 bg-red-50 border-red-200'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
            {isActive ? 'Hoạt động' : 'Đã khóa'}
          </span>
        </div>
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 mb-6 flex items-start gap-3">
        <SafetyCertificateOutlined className="text-slate-400 text-lg mt-0.5" />
        <p className="text-xs text-slate-500 leading-relaxed">
          Dữ liệu nhạy cảm (mật khẩu băm, JWT token, khóa bí mật) được bảo vệ và ẩn hoàn toàn khỏi console.
        </p>
      </div>

      <div className="mb-6">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Thông tin hoạt động hệ thống</h3>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <p className="text-xs text-slate-500 mb-1">Ngày tham gia</p>
            <p className="text-sm font-semibold text-slate-800">{joinDate}</p>
          </div>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <p className="text-xs text-slate-500 mb-1">Trạng thái mạng</p>
            <p className={`text-sm font-semibold ${user.isOnline ? 'text-emerald-600' : 'text-slate-400'}`}>
              {user.isOnline ? 'Trực tuyến' : 'Ngoại tuyến'}
            </p>
            <p className="text-[10px] text-slate-400 mt-1">
              IP: {user.isOnline ? 'Đang kết nối' : 'Chưa ghi nhận'}
            </p>
          </div>
        </div>

        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-3">
          <p className="text-xs font-bold text-slate-500 uppercase">Khối lượng sử dụng tài nguyên AI</p>
          <div className="flex justify-between items-center pb-2 border-b border-slate-200/60">
            <span className="text-sm text-slate-600 flex items-center gap-2">
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
              Tài liệu đã tải lên
            </span>
            <span className="text-sm font-semibold text-slate-800">{docsCount} tài liệu <span className="text-xs text-slate-400 font-normal">({storageUsed} MB)</span></span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-600 flex items-center gap-2">
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
              Câu hỏi RAG Embeddings
            </span>
            <span className="text-sm font-semibold text-indigo-600">{chatsCount} truy vấn</span>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Phân quyền chi tiết</h3>
        <div className="bg-white border border-slate-200 rounded-xl divide-y divide-slate-100">
          <div className="flex justify-between items-center p-3 hover:bg-slate-50 transition-colors">
            <span className="text-sm text-slate-700">Truy cập API Vector Ingestion</span>
            <div className={`w-4 h-4 rounded-full border-[4px] ${docsCount > 0 || isAdmin ? 'border-indigo-500' : 'border-slate-300'}`}></div>
          </div>
          <div className="flex justify-between items-center p-3 hover:bg-slate-50 transition-colors">
            <span className="text-sm text-slate-700">Chia sẻ tài liệu công khai</span>
            <div className={`w-4 h-4 rounded-full border-[4px] ${isActive ? 'border-indigo-500' : 'border-slate-300'}`}></div>
          </div>
          <div className="flex justify-between items-center p-3 hover:bg-slate-50 transition-colors">
            <span className="text-sm text-slate-700">Quyền quản trị viên Tenant</span>
            <div className={`w-4 h-4 rounded-full border-[4px] ${isAdmin ? 'border-indigo-500' : 'border-slate-300'}`}></div>
          </div>
        </div>
      </div>
    </Drawer>
  );
};