import React, { useState } from 'react';
import { Menu, Search, Bell, ChevronDown } from 'lucide-react';
import { useSidebar } from '../../contexts/SidebarContext';

export const TopBar: React.FC = () => {
  const { toggleSidebar } = useSidebar();
  const [search, setSearch] = useState('');

  return (
    <header className="sticky top-0 z-40 h-16 bg-surface/95 backdrop-blur-md border-b border-border flex items-center gap-4 px-5 shrink-0">
      {/* Toggle */}
      <button
        onClick={toggleSidebar}
        className="p-2 rounded-lg text-text-muted hover:text-text hover:bg-border/30 transition-colors"
        aria-label="Toggle sidebar"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Search */}
      <div className="relative flex-1 max-w-sm hidden sm:block">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
        <input
          type="text"
          placeholder="Search users, roles, or anything..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-border bg-bg text-text focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors placeholder:text-text-muted"
        />
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2 ml-auto">
        {/* Notification Bell */}
        <button className="relative p-2.5 rounded-xl text-text-muted hover:text-text hover:bg-border/30 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-danger ring-2 ring-surface" />
        </button>

        {/* Profile */}
        <button className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl hover:bg-border/20 transition-colors group">
          <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white text-sm font-bold shrink-0 shadow-sm">
            S
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-sm font-semibold text-text leading-tight">Shivam Gupta</p>
            <p className="text-[10px] text-text-muted">Admin</p>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-text-muted hidden sm:block" />
        </button>
      </div>
    </header>
  );
};
