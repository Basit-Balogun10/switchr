import React, { useState } from "react";
import { UserType } from "../../lib/types";

interface NavigationItem {
  id: string;
  label: string;
  icon: string;
  roles: UserType[];
  badge?: number;
}

interface SidebarProps {
  userRole: UserType;
  activeTab: string;
  onTabChange: (tab: string) => void;
  user: {
    fullName: string;
    email: string;
    profileImage?: string;
  };
  onSignOut: () => void;
}

const navigationConfig: Record<UserType, NavigationItem[]> = {
  user: [
    { id: 'dashboard', label: 'Dashboard', icon: '🏠', roles: ['user'] },
    { id: 'checker', label: 'Vehicle Checker', icon: '🔍', roles: ['user'] },
    { id: 'providers', label: 'Find Providers', icon: '🔧', roles: ['user'] },
    { id: 'stations', label: 'Station Map', icon: '🗺️', roles: ['user'] },
    { id: 'booking', label: 'My Bookings', icon: '📅', roles: ['user'] },
    { id: 'learning', label: 'Learning Hub', icon: '📚', roles: ['user'] },
    { id: 'trust-safety', label: 'Documents', icon: '🔒', roles: ['user'] },
  ],
  provider: [
    { id: 'provider-dash', label: 'Dashboard', icon: '📊', roles: ['provider'] },
    { id: 'booking', label: 'Manage Bookings', icon: '📋', roles: ['provider'] },
    { id: 'customers', label: 'Customers', icon: '👥', roles: ['provider'] },
    { id: 'analytics', label: 'Analytics', icon: '📈', roles: ['provider'] },
    { id: 'trust-safety', label: 'Checklists', icon: '✅', roles: ['provider'] },
  ],
  station_partner: [
    { id: 'station-dash', label: 'Dashboard', icon: '⛽', roles: ['station_partner'] },
    { id: 'stations', label: 'Manage Stations', icon: '🏢', roles: ['station_partner'] },
    { id: 'availability', label: 'Update Availability', icon: '🔄', roles: ['station_partner'] },
    { id: 'analytics', label: 'Analytics', icon: '📊', roles: ['station_partner'] },
  ],
  admin: [
    { id: 'admin-dashboard', label: 'Admin Dashboard', icon: '👑', roles: ['admin'] },
    { id: 'providers', label: 'All Providers', icon: '🔧', roles: ['admin'] },
    { id: 'stations', label: 'All Stations', icon: '🗺️', roles: ['admin'] },
    { id: 'users', label: 'User Management', icon: '👥', roles: ['admin'] },
    { id: 'analytics', label: 'Platform Analytics', icon: '📈', roles: ['admin'] },
  ],
};

export function Sidebar({ userRole, activeTab, onTabChange, user, onSignOut }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navigationItems = navigationConfig[userRole] || [];

  const toggleSidebar = () => {
    if (window.innerWidth < 1024) {
      setIsMobileOpen(!isMobileOpen);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };

  const handleItemClick = (itemId: string) => {
    onTabChange(itemId);
    if (window.innerWidth < 1024) {
      setIsMobileOpen(false);
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile menu button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 lg:hidden bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-2 text-white touch-friendly"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Sidebar */}
      <div className={`
        fixed left-0 top-0 h-full 
        ${isCollapsed ? 'w-16' : 'w-64'} lg:${isCollapsed ? 'w-16' : 'w-72'}
        bg-white/10 backdrop-blur-xl border-r border-white/20
        transform transition-all duration-300 ease-in-out z-50
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
      `}>
        {/* Header */}
        <div className="p-4 border-b border-white/20">
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">S</span>
                </div>
                <span className="text-white font-semibold text-lg">Switchr</span>
              </div>
            )}
            <button
              onClick={toggleSidebar}
              className="hidden lg:block text-white/70 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d={isCollapsed ? "M13 5l7 7-7 7M5 5l7 7-7 7" : "M11 19l-7-7 7-7M21 19l-7-7 7-7"} />
              </svg>
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleItemClick(item.id)}
              className={`
                w-full flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200 touch-friendly
                ${activeTab === item.id 
                  ? 'bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-500/30 text-white' 
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
                }
                ${isCollapsed ? 'justify-center px-2' : ''}
              `}
            >
              <span className="text-lg flex-shrink-0">{item.icon}</span>
              {!isCollapsed && (
                <>
                  <span className="font-medium">{item.label}</span>
                  {item.badge && (
                    <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-5 h-5 flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </button>
          ))}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-white/20">
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'}`}>
            <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-400 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white font-semibold text-sm">
                {user.fullName ? user.fullName.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}
              </span>
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium text-sm truncate">{user.fullName || 'User'}</p>
                <p className="text-white/60 text-xs truncate">{user.email}</p>
              </div>
            )}
          </div>
          
          {!isCollapsed && (
            <button
              onClick={onSignOut}
              className="w-full mt-3 flex items-center justify-center space-x-2 px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 hover:text-red-200 rounded-lg transition-colors touch-friendly"
            >
              <span>🚪</span>
              <span className="font-medium">Sign Out</span>
            </button>
          )}
        </div>
      </div>
    </>
  );
}