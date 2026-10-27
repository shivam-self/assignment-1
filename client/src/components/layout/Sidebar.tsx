import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Settings,
  Layers,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useSidebar } from '../../contexts/SidebarContext';

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/users', label: 'Users', icon: Users, end: false },
  { to: '/settings', label: 'Settings', icon: Settings, end: false },
];

export const Sidebar: React.FC = () => {
  const { isCollapsed, toggleSidebar } = useSidebar();

  return (
    <aside
      className={`fixed top-0 left-0 h-full z-50 flex flex-col bg-surface border-r border-border shadow-sm transition-all duration-300 ${
        isCollapsed ? 'w-[72px]' : 'w-[220px]'
      }`}
    >
      {/* Brand */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-border shrink-0">
        <div className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center shrink-0 shadow-sm">
          <Layers className="w-5 h-5 text-white" />
        </div>
        {!isCollapsed && (
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm text-text leading-tight truncate">AuraUI</p>
            <p className="text-[10px] text-text-muted truncate">User Management</p>
          </div>
        )}
        <button
          onClick={toggleSidebar}
          className="shrink-0 p-1.5 rounded-lg text-text-muted hover:text-text hover:bg-border/40 transition-colors"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        {!isCollapsed && (
          <p className="text-[10px] font-semibold text-text-muted uppercase tracking-widest px-3 pb-2">
            Main
          </p>
        )}

        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            title={isCollapsed ? label : undefined}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                isCollapsed ? 'justify-center' : ''
              } ${
                isActive
                  ? 'bg-accent/10 text-accent'
                  : 'text-text-muted hover:text-text hover:bg-border/30'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  className={`w-5 h-5 shrink-0 transition-colors ${
                    isActive ? 'text-accent' : 'text-text-muted group-hover:text-text'
                  }`}
                />
                {!isCollapsed && <span className="truncate">{label}</span>}
                {!isCollapsed && isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-accent" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      {!isCollapsed && (
        <div className="px-3 py-4 border-t border-border shrink-0">
          <div className="rounded-xl bg-accent/8 border border-accent/15 px-3 py-3 text-center">
            <p className="text-xs font-semibold text-accent mb-0.5">AuraUI v1.0</p>
            <p className="text-[10px] text-text-muted">MERN Stack Dashboard</p>
          </div>
        </div>
      )}
    </aside>
  );
};
