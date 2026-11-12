import React from 'react';
import { Keyboard, HelpCircle, Layers, CheckSquare } from 'lucide-react';

interface ShortcutBarProps {
  onOpenHelp: () => void;
  onOpenNewBooking: () => void;
  onOpenTrackingMap: () => void;
  selectedCount: number;
}

export const ShortcutBar: React.FC<ShortcutBarProps> = ({
  onOpenHelp,
  onOpenNewBooking,
  onOpenTrackingMap,
  selectedCount,
}) => {
  const hotkeys = [
    { key: 'SPACE', label: 'New Booking', action: onOpenNewBooking },
    { key: 'D', label: 'Dispatch' },
    { key: 'F', label: 'FOJ / STC' },
    { key: 'H', label: 'Hold' },
    { key: 'C', label: 'Cancel' },
    { key: 'R', label: 'Release' },
    { key: 'P', label: 'Pre Booking Tab' },
    { key: 'Ctrl+M', label: 'Radar Map', action: onOpenTrackingMap },
  ];

  return (
    <footer className="sticky bottom-0 z-30 flex items-center justify-between px-3 py-1 bg-[#0b1626] text-slate-300 border-t border-[#1c385c] text-[11px] shadow-lg select-none">
      {/* Left: Keyboard indicator & Hotkey keycaps */}
      <div className="flex items-center gap-2.5 overflow-x-auto">
        <div className="flex items-center gap-1.5 text-sky-400 shrink-0 font-mono font-bold text-[10px]">
          <Keyboard className="w-3.5 h-3.5" />
          <span className="hidden sm:inline uppercase tracking-widest text-slate-400">
            HOTKEYS:
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {hotkeys.map((h, i) => (
            <button
              key={i}
              onClick={h.action}
              className="inline-flex items-center gap-1.5 px-1.5 py-0.5 rounded hover:bg-[#163152] transition text-slate-300 hover:text-white shrink-0 group"
              title={`Press ${h.key} to ${h.label}`}
            >
              <span className="keycap">
                {h.key}
              </span>
              <span className="text-[10px] text-slate-400 group-hover:text-slate-200 font-medium">
                {h.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Right: Selected Row counter & Help button */}
      <div className="flex items-center gap-2 shrink-0 ml-2">
        {selectedCount > 0 && (
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-blue-900/80 border border-blue-700 text-sky-200 font-mono text-[10px] font-bold">
            <CheckSquare className="w-3 h-3 text-sky-400" />
            <span>{selectedCount} Selected</span>
          </div>
        )}

        <button
          onClick={onOpenHelp}
          className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#132c4d] hover:bg-[#1c3f6e] text-sky-200 hover:text-white transition border border-[#224b7a] text-[10px] font-bold tracking-tight shadow-xs"
          title="Open Hotkeys & Controller Reference"
        >
          <HelpCircle className="w-3 h-3 text-sky-400" />
          <span className="hidden sm:inline">Controller Manual</span>
        </button>
      </div>
    </footer>
  );
};
