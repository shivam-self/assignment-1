import React from 'react';
import { NavLink } from 'react-router-dom';
import { ThemePanel } from '../theme/ThemePanel';
import { LayoutDashboard, Users, Layers } from 'lucide-react';

export const Navbar: React.FC = () => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-surface/90 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div className="flex items-center gap-6">
          <NavLink
            to="/"
            className="flex items-center gap-2.5 font-bold text-base text-text tracking-tight hover:opacity-90 transition-opacity"
          >
            <div className="w-9 h-9 rounded-xl bg-accent text-white flex items-center justify-center shadow-md">
              <Layers className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="leading-tight">AuraUI</span>
              <span className="text-[10px] text-text-muted font-normal tracking-wide">
                User Management
              </span>
            </div>
          </NavLink>

          {/* Nav Links */}
          <nav className="hidden sm:flex items-center gap-1">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-border/40 text-accent'
                    : 'text-text-muted hover:text-text hover:bg-border/20'
                }`
              }
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </NavLink>

            <NavLink
              to="/users"
              className={({ isActive }) =>
                `flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-border/40 text-accent'
                    : 'text-text-muted hover:text-text hover:bg-border/20'
                }`
              }
            >
              <Users className="w-4 h-4" />
              <span>Users</span>
            </NavLink>
          </nav>
        </div>

        {/* Right Header Area: Mobile nav links + ThemePanel */}
        <div className="flex items-center gap-3">
          <nav className="flex sm:hidden items-center gap-1">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `p-2 rounded-lg text-sm transition-colors ${
                  isActive ? 'bg-border/40 text-accent' : 'text-text-muted hover:text-text'
                }`
              }
              title="Dashboard"
            >
              <LayoutDashboard className="w-5 h-5" />
            </NavLink>
            <NavLink
              to="/users"
              className={({ isActive }) =>
                `p-2 rounded-lg text-sm transition-colors ${
                  isActive ? 'bg-border/40 text-accent' : 'text-text-muted hover:text-text'
                }`
              }
              title="Users"
            >
              <Users className="w-5 h-5" />
            </NavLink>
          </nav>

          <ThemePanel />
        </div>
      </div>
    </header>
  );
};
