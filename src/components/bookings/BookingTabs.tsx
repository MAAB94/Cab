import React from 'react';
import {
  Calendar,
  Clock,
  Activity,
  CheckCircle,
  UserX,
  XCircle,
  Search,
} from 'lucide-react';

export type BookingTabKey =
  | 'today'
  | 'pre_bookings'
  | 'recent'
  | 'completed'
  | 'no_show'
  | 'cancelled'
  | 'advance_search';

interface BookingTabsProps {
  activeTab: BookingTabKey;
  setActiveTab: (tab: BookingTabKey) => void;
  counts: {
    today: number;
    pre: number;
    recent: number;
    completed: number;
    noShow: number;
    cancelled: number;
  };
}

export const BookingTabs: React.FC<BookingTabsProps> = ({
  activeTab,
  setActiveTab,
  counts,
}) => {
  const tabs = [
    {
      key: 'today' as BookingTabKey,
      label: "Today's Booking",
      icon: Calendar,
      count: counts.today,
      badgeColor: 'bg-blue-700 text-white',
    },
    {
      key: 'pre_bookings' as BookingTabKey,
      label: 'Pre Bookings',
      icon: Clock,
      count: counts.pre,
      badgeColor: 'bg-indigo-700 text-white',
    },
    {
      key: 'recent' as BookingTabKey,
      label: 'Recent Jobs',
      icon: Activity,
      count: counts.recent,
      badgeColor: 'bg-emerald-700 text-white',
    },
    {
      key: 'completed' as BookingTabKey,
      label: 'Completed',
      icon: CheckCircle,
      count: counts.completed,
      badgeColor: 'bg-slate-700 text-white',
    },
    {
      key: 'no_show' as BookingTabKey,
      label: 'No Show',
      icon: UserX,
      count: counts.noShow,
      badgeColor: 'bg-amber-700 text-white',
    },
    {
      key: 'cancelled' as BookingTabKey,
      label: 'Cancelled',
      icon: XCircle,
      count: counts.cancelled,
      badgeColor: 'bg-rose-700 text-white',
    },
    {
      key: 'advance_search' as BookingTabKey,
      label: 'Advance Search',
      icon: Search,
    },
  ];

  return (
    <div className="flex items-center gap-1 bg-[#0f243c]/8 dark:bg-slate-900 px-2 pt-1.5 border-b border-slate-200 dark:border-slate-800 overflow-x-auto text-xs font-semibold select-none">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.key;

        return (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-t transition-all whitespace-nowrap shrink-0 border-t-2 text-[11px] ${
              isActive
                ? 'bg-white dark:bg-slate-800/90 text-blue-800 dark:text-sky-300 border-blue-700 dark:border-sky-400 font-bold shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100/70 dark:hover:bg-slate-800/40 border-transparent font-medium'
            }`}
          >
            <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-blue-700 dark:text-sky-400' : 'text-slate-400'}`} />
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={`ml-1 px-1.5 py-0.2 rounded text-[10px] font-mono font-bold tabular-nums ${
                  isActive
                    ? tab.badgeColor
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
