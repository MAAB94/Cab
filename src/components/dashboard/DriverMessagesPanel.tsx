import React, { useState } from 'react';
import { DriverMessage, Driver } from '../../types/dispatch';
import { MessageSquare, Send, ArrowDownLeft, ArrowUpRight, CheckCheck } from 'lucide-react';
import { soundManager } from '../../utils/sound';

interface DriverMessagesPanelProps {
  messages: DriverMessage[];
  drivers: Driver[];
  onSendMessage: (driverNumber: string, messageText: string) => void;
  onMarkRead: (messageId: string) => void;
}

export const DriverMessagesPanel: React.FC<DriverMessagesPanelProps> = ({
  messages,
  drivers,
  onSendMessage,
  onMarkRead,
}) => {
  const [selectedDriverNumber, setSelectedDriverNumber] = useState<string>(
    drivers[0]?.driverNumber || 'D-101'
  );
  const [replyText, setReplyText] = useState<string>('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    onSendMessage(selectedDriverNumber, replyText.trim());
    setReplyText('');
    soundManager.playRadioClick();
  };

  const unreadCount = messages.filter((m) => !m.isRead).length;

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded shadow-xs overflow-hidden">
      {/* Panel Header */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-[#1b3a5f] text-white dark:bg-slate-800 border-b border-[#254d7d] dark:border-slate-700 text-xs font-semibold">
        <div className="flex items-center gap-1.5">
          <MessageSquare className="w-3.5 h-3.5 text-sky-300" />
          <span className="tracking-wide uppercase text-[11px] font-bold">Driver Messages (MDT)</span>
          {unreadCount > 0 && (
            <span className="ml-1 px-1.5 py-0.2 rounded bg-amber-400 text-slate-950 font-bold text-[9px] font-mono">
              {unreadCount} NEW
            </span>
          )}
        </div>
        <span className="text-[10px] text-sky-300 font-mono font-medium">Radio Terminal</span>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 text-xs min-h-[95px] max-h-[125px] p-1">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center p-3 text-slate-400 text-xs">
            No recent messages
          </div>
        ) : (
          messages.map((msg) => {
            const isIncoming = msg.direction === 'INCOMING';

            return (
              <div
                key={msg.id}
                onClick={() => !msg.isRead && onMarkRead(msg.id)}
                className={`p-1.5 rounded transition cursor-pointer ${
                  !msg.isRead
                    ? 'bg-amber-50/80 dark:bg-amber-950/40 font-medium'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] mb-0.5">
                  <div className="flex items-center gap-1.5">
                    {isIncoming ? (
                      <ArrowDownLeft className="w-3 h-3 text-sky-600 dark:text-sky-400" />
                    ) : (
                      <ArrowUpRight className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                    )}
                    <span className="font-mono font-bold text-[10px] text-blue-700 dark:text-sky-300">
                      {msg.driverNumber}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono tabular-nums">
                      {msg.timestamp}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    {msg.priority === 'URGENT' && (
                      <span className="text-[8px] bg-rose-600 text-white font-bold px-1 rounded">
                        URGENT
                      </span>
                    )}
                    {msg.isRead ? (
                      <CheckCheck className="w-3 h-3 text-slate-400" />
                    ) : (
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    )}
                  </div>
                </div>
                <p className="text-[11px] text-slate-700 dark:text-slate-300 leading-snug truncate">
                  {msg.message}
                </p>
              </div>
            );
          })
        )}
      </div>

      {/* Quick Reply Form */}
      <form
        onSubmit={handleSend}
        className="p-1.5 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800 flex items-center gap-1.5"
      >
        <select
          value={selectedDriverNumber}
          onChange={(e) => setSelectedDriverNumber(e.target.value)}
          className="px-1.5 py-1 text-[11px] font-mono font-bold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          {drivers.map((d) => (
            <option key={d.id} value={d.driverNumber}>
              {d.driverNumber}
            </option>
          ))}
        </select>

        <input
          type="text"
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          placeholder="Transmit MDT dispatch msg..."
          className="flex-1 min-w-0 px-2 py-1 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />

        <button
          type="submit"
          className="p-1.5 bg-blue-700 hover:bg-blue-600 text-white rounded transition shrink-0 shadow-2xs"
          title="Transmit radio MDT message"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
