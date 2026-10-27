import React from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { useSidebar } from '../../contexts/SidebarContext';

export const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isCollapsed } = useSidebar();
  const sidebarWidth = isCollapsed ? 72 : 220;

  return (
    <div className="min-h-screen bg-bg text-text">
      <Sidebar />
      <div
        className="flex flex-col min-h-screen transition-all duration-300"
        style={{ marginLeft: sidebarWidth }}
      >
        <TopBar />
        <main className="flex-1 p-6">
          {children}
        </main>
        <footer className="border-t border-border py-4 px-6 text-xs text-text-muted">
          <div className="flex items-center justify-between">
            <span>AuraUI User Management · Built with MERN Stack</span>
            <span>© 2026 AuraUI</span>
          </div>
        </footer>
      </div>
    </div>
  );
};
