import React, { useState, useEffect } from 'react';
import {
  Menu,
  Volume2,
  VolumeX,
  Sun,
  Moon,
  Zap,
  Bell,
  User,
  LogOut,
  Radio,
  CheckCircle2,
  AlertTriangle,
  Info,
  Car,
  X,
  Clock,
  Activity,
  Headphones,
} from 'lucide-react';
import { soundManager } from '../utils/sound';

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  autoDispatch: boolean;
  setAutoDispatch: (auto: boolean) => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  notifications: Array<{
    id: string;
    title: string;
    time: string;
    type: 'dispatch' | 'urgent' | 'driver' | 'info';
  }>;
  onClearNotifications: () => void;
  onOpenNewBooking: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  sidebarOpen,
  setSidebarOpen,
  autoDispatch,
  setAutoDispatch,
  theme,
  setTheme,
  soundEnabled,
  setSoundEnabled,
  notifications,
  onClearNotifications,
  onOpenNewBooking,
}) => {
  const [showNotificationMenu, setShowNotificationMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundManager.setSoundEnabled(next);
    if (next) soundManager.playDispatch();
  };

  const toggleAutoDispatch = () => {
    const next = !autoDispatch;
    setAutoDispatch(next);
    soundManager.playRadioClick();
  };

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between px-3 py-1.5 bg-[#0f2744] text-white dark:bg-[#0b1626] border-b border-[#1c3d64] dark:border-slate-800 shadow-md select-none">
      {/* Left: Brand, Sidebar Toggle, Clock, Fast Booking */}
      <div className="flex items-center gap-2.5">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1.5 rounded hover:bg-[#1a3d66] dark:hover:bg-slate-800 text-sky-200 hover:text-white transition-colors"
          title="Toggle Navigation Sidebar"
          aria-label="Toggle Sidebar"
        >
          <Menu className="w-4 h-4" />
        </button>

        {/* Brand Lockup */}
        <div className="flex items-center gap-1.5 bg-[#091b30] dark:bg-slate-900/90 px-2.5 py-1 rounded border border-[#1e426d] dark:border-slate-800">
          <Radio className="w-3.5 h-3.5 text-sky-400" />
          <span className="font-extrabold tracking-tight text-xs text-white uppercase font-sans">
            Cab Treasure
          </span>
          <span className="bg-sky-500 text-[#091b30] font-black text-[9px] px-1 py-0.2 rounded uppercase tracking-wider font-mono">
            CLOUD X
          </span>
        </div>

        {/* Real-time Precision Clock */}
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#091b30]/70 border border-[#1e426d]/60 text-slate-300">
          <Clock className="w-3.5 h-3.5 text-sky-400" />
          <span className="font-mono text-xs font-bold text-sky-200 tracking-wider tabular-nums">
            {currentTime || '08:00:00'}
          </span>
          <span className="text-[10px] font-mono text-slate-400">BST</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 ml-0.5 animate-pulse" />
        </div>

        {/* System Channel Indicator */}
        <div className="hidden xl:flex items-center gap-1 text-[11px] text-slate-300 font-mono pl-1">
          <Headphones className="w-3 h-3 text-sky-400" />
          <span>DESK 01</span>
          <span className="text-slate-500">·</span>
          <span className="text-emerald-400 font-semibold">ONLINE</span>
        </div>

        {/* Fast Action CTA */}
        <button
          onClick={onOpenNewBooking}
          className="ml-1 hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded transition shadow-sm border border-emerald-500"
          title="Fast New Booking (Hotkey: SPACE)"
        >
          <Car className="w-3.5 h-3.5" />
          <span>New Booking</span>
          <span className="keycap bg-emerald-800! border-emerald-600! text-emerald-100! text-[9px] py-0 px-1">
            SPACE
          </span>
        </button>
      </div>

      {/* Right Controls: Auto Dispatch, Sound, Theme, Notifications, Profile */}
      <div className="flex items-center gap-2">
        {/* AUTO Dispatch Industrial Switch */}
        <div className="flex items-center gap-1.5 bg-[#091b30] dark:bg-slate-900 px-2.5 py-1 rounded border border-[#1e426d] dark:border-slate-800">
          <Zap className={`w-3.5 h-3.5 ${autoDispatch ? 'text-amber-400' : 'text-slate-400'}`} />
          <span className="text-[11px] font-semibold text-slate-200 hidden sm:inline tracking-tight font-sans">
            AUTO ALLOCATION
          </span>
          <button
            onClick={toggleAutoDispatch}
            className={`relative inline-flex h-4 w-8 items-center rounded-full transition-colors focus:outline-none ${
              autoDispatch ? 'bg-amber-400' : 'bg-slate-700'
            }`}
            aria-pressed={autoDispatch}
            title={autoDispatch ? 'Automatic Allocation ON' : 'Automatic Allocation OFF'}
          >
            <span
              className={`inline-block h-3 w-3 transform rounded-full bg-slate-950 transition-transform ${
                autoDispatch ? 'translate-x-4.5' : 'translate-x-0.5'
              }`}
            />
          </button>
          <span
            className={`text-[9px] font-mono font-bold px-1 py-0.2 rounded ${
              autoDispatch
                ? 'bg-amber-400/20 text-amber-300'
                : 'bg-slate-800 text-slate-400'
            }`}
          >
            {autoDispatch ? 'AUTO ON' : 'MANUAL'}
          </span>
        </div>

        {/* Audio Synthesizer Toggle */}
        <button
          onClick={toggleSound}
          className={`p-1.5 rounded transition border ${
            soundEnabled
              ? 'bg-[#153457] border-[#224d7c] text-sky-300 hover:text-white'
              : 'bg-[#091b30] border-[#1e426d] text-slate-400 hover:text-slate-200'
          }`}
          title={soundEnabled ? 'Mute Dispatch Synthesizer' : 'Enable Dispatch Synthesizer'}
          aria-label="Sound Toggle"
        >
          {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
        </button>

        {/* Dark/Light Toggle */}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-1.5 rounded bg-[#091b30] border border-[#1e426d] text-slate-300 hover:text-white hover:bg-[#153457] transition"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          aria-label="Theme Toggle"
        >
          {theme === 'dark' ? (
            <Sun className="w-3.5 h-3.5 text-amber-300" />
          ) : (
            <Moon className="w-3.5 h-3.5 text-sky-300" />
          )}
        </button>

        {/* Notifications Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotificationMenu(!showNotificationMenu)}
            className="p-1.5 rounded bg-[#091b30] border border-[#1e426d] text-slate-300 hover:text-white hover:bg-[#153457] relative transition"
            title="Dispatch Notifications"
            aria-label="Notifications"
          >
            <Bell className="w-3.5 h-3.5" />
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[9px] font-bold text-white shadow font-mono">
                {notifications.length}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotificationMenu && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded shadow-2xl z-50 text-slate-800 dark:text-slate-100 animate-in fade-in duration-100">
              <div className="flex items-center justify-between px-3 py-2 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60">
                <div className="flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-blue-600 dark:text-sky-400" />
                  <span className="font-bold text-[11px] tracking-wide uppercase text-slate-700 dark:text-slate-200">
                    Dispatch Activity Feed
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={onClearNotifications}
                    className="text-[10px] text-blue-600 dark:text-sky-400 hover:underline font-medium"
                  >
                    Clear All
                  </button>
                  <button
                    onClick={() => setShowNotificationMenu(false)}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-slate-400 text-xs">
                    No active notifications
                  </div>
                ) : (
                  notifications.map((item) => (
                    <div
                      key={item.id}
                      className="p-2.5 hover:bg-slate-50 dark:hover:bg-slate-800/40 flex items-start gap-2.5 transition"
                    >
                      {item.type === 'dispatch' && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      )}
                      {item.type === 'urgent' && (
                        <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                      )}
                      {item.type === 'driver' && (
                        <Car className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
                      )}
                      {item.type === 'info' && (
                        <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-800 dark:text-slate-200 leading-snug text-[11px]">
                          {item.title}
                        </p>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {item.time}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Controller Profile */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 pl-2 pr-2 py-1 rounded bg-[#091b30] border border-[#1e426d] hover:bg-[#153457] transition"
            aria-label="User Profile"
          >
            <div className="w-5 h-5 rounded bg-blue-600 text-white flex items-center justify-center font-bold text-[10px] font-mono shadow-xs">
              SJ
            </div>
            <div className="hidden lg:flex flex-col text-left">
              <span className="text-xs font-bold leading-none text-white tracking-tight">
                S. Jenkins
              </span>
              <span className="text-[9px] text-sky-300 font-mono leading-none mt-0.5">
                Senior Controller
              </span>
            </div>
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded shadow-xl z-50 text-slate-800 dark:text-slate-100 py-1 text-xs">
              <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                <p className="font-bold">Sarah Jenkins</p>
                <p className="text-[10px] text-slate-400 font-mono">sarah.jenkins@cabtreasure.co.uk</p>
                <span className="inline-block mt-1 text-[9px] font-bold px-1.5 py-0.2 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 rounded border border-blue-200 dark:border-blue-800 font-mono">
                  Super Dispatcher (Full RBAC)
                </span>
              </div>
              <button
                onClick={() => setShowUserMenu(false)}
                className="w-full text-left px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2"
              >
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>Console Preferences</span>
              </button>
              <button
                onClick={() => {
                  setShowUserMenu(false);
                  soundManager.playRadioClick();
                }}
                className="w-full text-left px-3 py-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-2"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Lock / End Shift</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
