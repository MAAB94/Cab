import React from 'react';
import { X, Keyboard, Command } from 'lucide-react';

interface ShortcutsHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShortcutsHelpModal: React.FC<ShortcutsHelpModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: 'SPACE', description: 'Open Fast New Booking modal', category: 'Creation' },
    { key: 'D', description: 'Dispatch selected booking to driver', category: 'Dispatch' },
    { key: 'F', description: 'FOJ (Free On Job / Soon To Clear toggle for active driver)', category: 'Dispatch' },
    { key: 'R', description: 'Release driver from selected booking', category: 'Dispatch' },
    { key: 'H', description: 'Toggle Hold / Resume for selected booking', category: 'Management' },
    { key: 'E', description: 'Edit selected booking details', category: 'Management' },
    { key: 'C', description: 'Cancel selected booking with reason dialog', category: 'Management' },
    { key: 'P', description: 'Switch tab to Pre Bookings (Future reservations)', category: 'Navigation' },
    { key: 'Ctrl + M', description: 'Open Fleet GPS Tracking Radar Map', category: 'Navigation' },
    { key: 'Esc', description: 'Close any active modal or drawer', category: 'General' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-lg shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-[#143254] text-white dark:bg-slate-800 border-b border-[#214772] dark:border-slate-700">
          <div className="flex items-center gap-2">
            <Keyboard className="w-4 h-4 text-sky-300" />
            <h3 className="font-extrabold text-xs tracking-wider uppercase">
              Cab Treasure Dispatcher Hotkeys Reference
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-sky-200 hover:text-white hover:bg-[#1e4674] dark:hover:bg-slate-700 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3 text-xs overflow-y-auto max-h-[70vh]">
          <p className="text-slate-500 text-[11px]">
            Master controllers can operate the entire dispatch grid without touching the mouse.
            Hotkeys are automatically disabled when typing in inputs or search fields.
          </p>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {shortcuts.map((sc, i) => (
              <div
                key={i}
                className="py-2 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/40 px-2 rounded transition"
              >
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-mono font-bold text-xs border border-slate-300 dark:border-slate-700 shadow-2xs">
                    {sc.key}
                  </span>
                  <span className="text-slate-700 dark:text-slate-300">{sc.description}</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono uppercase">
                  {sc.category}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold bg-blue-700 text-white hover:bg-blue-600 rounded transition"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
