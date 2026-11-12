import React from 'react';
import {
  LayoutDashboard,
  CalendarPlus,
  MapPin,
  PhoneCall,
  Clock,
  Users,
  CarFront,
  Building2,
  Receipt,
  BarChart3,
  MessageSquare,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export type NavItemKey =
  | 'dashboard'
  | 'new_booking'
  | 'tracking_map'
  | 'call_history'
  | 'advance_booking'
  | 'drivers'
  | 'vehicles'
  | 'accounts'
  | 'finance'
  | 'reports'
  | 'messages'
  | 'settings';

interface SidebarProps {
  activeNav: NavItemKey;
  setActiveNav: (nav: NavItemKey) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  unreadMessagesCount: number;
  missedCallsCount: number;
  onOpenNewBooking: () => void;
  onOpenTrackingMap: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeNav,
  setActiveNav,
  isOpen,
  setIsOpen,
  unreadMessagesCount,
  missedCallsCount,
  onOpenNewBooking,
  onOpenTrackingMap,
}) => {
  const navItems = [
    { key: 'dashboard' as NavItemKey, label: 'Dashboard', icon: LayoutDashboard },
    {
      key: 'new_booking' as NavItemKey,
      label: 'New Booking',
      icon: CalendarPlus,
      action: onOpenNewBooking,
      shortcut: 'SPACE',
    },
    {
      key: 'tracking_map' as NavItemKey,
      label: 'Tracking Map',
      icon: MapPin,
      action: onOpenTrackingMap,
      shortcut: 'Ctrl+M',
    },
    {
      key: 'call_history' as NavItemKey,
      label: 'Call History',
      icon: PhoneCall,
      badge: missedCallsCount > 0 ? `${missedCallsCount}` : undefined,
      badgeColor: 'bg-rose-600',
    },
    { key: 'advance_booking' as NavItemKey, label: 'Advance Booking', icon: Clock },
    { key: 'drivers' as NavItemKey, label: 'Driver Management', icon: Users },
    { key: 'vehicles' as NavItemKey, label: 'Vehicle Management', icon: CarFront },
    { key: 'accounts' as NavItemKey, label: 'Customers & Accounts', icon: Building2 },
    { key: 'finance' as NavItemKey, label: 'Finance & Invoicing', icon: Receipt },
    { key: 'reports' as NavItemKey, label: 'Reports & Logs', icon: BarChart3 },
    {
      key: 'messages' as NavItemKey,
      label: 'Messages',
      icon: MessageSquare,
      badge: unreadMessagesCount > 0 ? `${unreadMessagesCount}` : undefined,
      badgeColor: 'bg-amber-500',
    },
    { key: 'settings' as NavItemKey, label: 'System Settings', icon: Settings },
  ];

  return (
    <aside
      className={`fixed lg:sticky top-[41px] left-0 h-[calc(100vh-41px)] z-30 flex flex-col bg-[#0b1728] text-slate-300 dark:bg-[#070e1a] border-r border-[#182f4e] transition-all duration-200 select-none shadow-md ${
        isOpen ? 'w-56' : 'w-14'
      }`}
    >
      {/* Nav List */}
      <div className="flex-1 py-2 overflow-y-auto overflow-x-hidden space-y-0.5 px-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeNav === item.key;

          return (
            <button
              key={item.key}
              onClick={() => {
                if (item.action) {
                  item.action();
                } else {
                  setActiveNav(item.key);
                }
              }}
              className={`w-full flex items-center gap-3 px-2.5 py-2 rounded text-xs font-semibold transition-all group relative ${
                isActive
                  ? 'bg-blue-700 text-white shadow-sm border border-blue-600'
                  : 'text-slate-300 hover:bg-[#15273f] hover:text-white'
              }`}
              title={!isOpen ? item.label : undefined}
            >
              <Icon
                className={`w-4 h-4 shrink-0 transition-colors ${
                  isActive ? 'text-white' : 'text-slate-400 group-hover:text-sky-300'
                }`}
              />
              {isOpen && (
                <div className="flex items-center justify-between flex-1 min-w-0">
                  <span className="truncate tracking-tight">{item.label}</span>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {item.shortcut && (
                      <span className="keycap text-[8px] py-0 px-1 font-bold">
                        {item.shortcut}
                      </span>
                    )}
                    {item.badge && (
                      <span
                        className={`text-[9px] font-mono font-bold text-white px-1.5 py-0.2 rounded-full ${
                          item.badgeColor || 'bg-blue-500'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Collapsed view indicator badge */}
              {!isOpen && item.badge && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500" />
              )}
            </button>
          );
        })}
      </div>

      {/* Sidebar Footer with Collapse Handle */}
      <div className="p-2 border-t border-[#182f4e] flex items-center justify-between bg-[#081220]/80">
        {isOpen && (
          <div className="text-[10px] text-slate-400 truncate font-mono flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
            <span>CLOUD X v8.4.2</span>
          </div>
        )}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-1 rounded text-slate-400 hover:text-white hover:bg-[#15273f] ml-auto transition"
          aria-label={isOpen ? 'Collapse Sidebar' : 'Expand Sidebar'}
          title={isOpen ? 'Collapse Sidebar' : 'Expand Sidebar'}
        >
          {isOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
      </div>
    </aside>
  );
};
