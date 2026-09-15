import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import Logo from '../components/Logo';

export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#f8f9ff] text-[#0b1c30]">
      {/* Header */}
      <header className="w-full px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Logo className="w-10 h-10" />
          <span className="font-semibold text-lg tracking-tight">
            DOCMIND <span className="text-[#4f46e5] text-xs font-mono uppercase">AI Core</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#4f46e5] animate-pulse"></div>
          <span className="text-xs text-[#464555]">Status: All Vector Engines Normal</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full flex-1 flex flex-col">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="w-full px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-100">
        <p className="text-xs text-[#464555]">© 2025 DOCMIND AI Inc. Cognitive Retrieval & Enterprise RAG.</p>
        <div className="flex items-center gap-4 text-xs text-[#464555]">
          <Link to="#" className="hover:text-black">System Status</Link>
          <Link to="#" className="hover:text-black">Privacy Policy</Link>
          <Link to="#" className="hover:text-black">Documentation</Link>
        </div>
      </footer>
    </div>
  );
};