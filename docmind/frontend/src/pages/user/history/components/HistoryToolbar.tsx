// Thanh tìm kiếm, bộ lọc thời gian & tài liệu
import React from 'react';
import { Input, Select, Button, Tooltip } from 'antd';
import type { InputRef } from 'antd';

interface HistoryToolbarProps {
  searchInputRef: React.RefObject<InputRef | null>;
  searchText: string;
  onSearchChange: (value: string) => void;
  dateFilter: string;
  onDateFilterChange: (key: string) => void;
  selectedDoc: string;
  onDocChange: (value: string) => void;
  onResetFilters: () => void;
  documentOptions: string[];
}

export const HistoryToolbar: React.FC<HistoryToolbarProps> = ({
  searchInputRef,
  searchText,
  onSearchChange,
  dateFilter,
  onDateFilterChange,
  selectedDoc,
  onDocChange,
  onResetFilters,
  documentOptions,
}) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col lg:flex-row items-center justify-between gap-4">
      <div className="w-full lg:flex-1">
        <Input
          ref={searchInputRef}
          value={searchText}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Tìm kiếm cuộc trò chuyện hoặc tài liệu..."
          prefix={<span className="material-symbols-outlined text-slate-400 text-[20px] mr-1">search</span>}
          suffix={
            <span className="text-xs font-mono text-slate-400 px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200">
              ⌘K
            </span>
          }
          className="rounded-lg py-2"
          allowClear
        />
      </div>

      <div className="flex items-center gap-3 w-full lg:w-auto overflow-x-auto pb-1 lg:pb-0">
        <div className="flex items-center bg-slate-100 p-1 rounded-lg shrink-0">
          {[
            { key: 'all', label: 'Tất cả' },
            { key: 'today', label: 'Hôm nay' },
            { key: '7days', label: '7 ngày qua' },
            { key: '30days', label: '30 ngày qua' },
          ].map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => onDateFilterChange(item.key)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                dateFilter === item.key
                  ? 'bg-white text-slate-800 shadow-sm font-semibold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <Select
          value={selectedDoc || undefined}
          onChange={onDocChange}
          placeholder="Lọc theo tài liệu (Tất cả)"
          allowClear
          className="w-56 shrink-0"
          options={documentOptions.map((doc) => ({ value: doc, label: doc }))}
        />

        <Tooltip title="Làm mới bộ lọc">
          <Button
            type="text"
            icon={<span className="material-symbols-outlined text-[20px] text-slate-500">restart_alt</span>}
            onClick={onResetFilters}
            className="flex items-center justify-center shrink-0"
          />
        </Tooltip>
      </div>
    </div>
  );
};