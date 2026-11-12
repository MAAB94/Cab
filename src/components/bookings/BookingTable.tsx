import React, { useState, useMemo } from 'react';
import { Booking, Driver, BookingStatus } from '../../types/dispatch';
import {
  formatCurrency,
  getStatusBadgeClasses,
} from '../../utils/formatters';
import {
  Search,
  Filter,
  ArrowUpDown,
  ChevronDown,
  ChevronRight,
  Send,
  Edit2,
  XCircle,
  Pause,
  Play,
  Printer,
  Eye,
  UserCheck,
  UserX,
  Phone,
  FileText,
  Calendar,
  RefreshCw,
  Clock,
  Layers,
} from 'lucide-react';
import { soundManager } from '../../utils/sound';

interface BookingTableProps {
  bookings: Booking[];
  drivers: Driver[];
  selectedBookingIds: string[];
  onToggleSelectBooking: (id: string) => void;
  onSelectAll: (ids: string[]) => void;
  onDispatch: (booking: Booking) => void;
  onEdit: (booking: Booking) => void;
  onCancel: (booking: Booking) => void;
  onHoldToggle: (booking: Booking) => void;
  onViewDetails: (booking: Booking) => void;
  onPrint: (booking: Booking) => void;
  onMarkNoShow: (booking: Booking) => void;
  onComplete: (booking: Booking) => void;
  groupByTimeSlots?: boolean;
}

type SortField = 'pickupTime' | 'fare' | 'reference' | 'status' | 'bookingTime';
type SortOrder = 'asc' | 'desc';

export const BookingTable: React.FC<BookingTableProps> = ({
  bookings,
  drivers,
  selectedBookingIds,
  onToggleSelectBooking,
  onSelectAll,
  onDispatch,
  onEdit,
  onCancel,
  onHoldToggle,
  onViewDetails,
  onPrint,
  onMarkNoShow,
  onComplete,
  groupByTimeSlots = true,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [accountFilter, setAccountFilter] = useState<string>('ALL');
  const [driverFilter, setDriverFilter] = useState<string>('ALL');
  const [sortField, setSortField] = useState<SortField>('pickupTime');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});
  const [isGroupingActive, setIsGroupingActive] = useState<boolean>(groupByTimeSlots);

  // Unique accounts for filter dropdown
  const uniqueAccounts = useMemo(() => {
    const set = new Set<string>();
    bookings.forEach((b) => set.add(b.account));
    return Array.from(set);
  }, [bookings]);

  // Filtered and sorted bookings
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      // Search query across ref, passenger, addresses, driver, account, phone
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesRef = b.reference.toLowerCase().includes(query);
        const matchesPassenger = b.passengerName.toLowerCase().includes(query);
        const matchesPickup = b.pickupAddress.toLowerCase().includes(query);
        const matchesDest = b.destinationAddress.toLowerCase().includes(query);
        const matchesDriver = b.assignedDriverNumber?.toLowerCase().includes(query);
        const matchesAccount = b.account.toLowerCase().includes(query);
        const matchesPhone = b.passengerPhone.toLowerCase().includes(query);

        if (
          !matchesRef &&
          !matchesPassenger &&
          !matchesPickup &&
          !matchesDest &&
          !matchesDriver &&
          !matchesAccount &&
          !matchesPhone
        ) {
          return false;
        }
      }

      // Status filter
      if (statusFilter !== 'ALL' && b.status !== statusFilter) {
        return false;
      }

      // Account filter
      if (accountFilter !== 'ALL' && b.account !== accountFilter) {
        return false;
      }

      // Driver filter
      if (driverFilter !== 'ALL') {
        if (driverFilter === 'UNASSIGNED') {
          if (b.assignedDriverNumber) return false;
        } else if (b.assignedDriverNumber !== driverFilter) {
          return false;
        }
      }

      return true;
    });
  }, [bookings, searchQuery, statusFilter, accountFilter, driverFilter]);

  const sortedBookings = useMemo(() => {
    return [...filteredBookings].sort((a, b) => {
      let comparison = 0;
      if (sortField === 'pickupTime') {
        comparison = a.pickupTime.localeCompare(b.pickupTime);
      } else if (sortField === 'bookingTime') {
        comparison = a.bookingTime.localeCompare(b.bookingTime);
      } else if (sortField === 'fare') {
        comparison = a.fare - b.fare;
      } else if (sortField === 'reference') {
        comparison = a.reference.localeCompare(b.reference);
      } else if (sortField === 'status') {
        comparison = a.status.localeCompare(b.status);
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [filteredBookings, sortField, sortOrder]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const toggleGroupCollapse = (groupKey: string) => {
    setCollapsedGroups((prev) => ({
      ...prev,
      [groupKey]: !prev[groupKey],
    }));
  };

  // Group by hour slot (e.g., "08:00 - 09:00")
  const groupedBookings = useMemo(() => {
    if (!isGroupingActive) {
      return { 'All Scheduled Jobs': sortedBookings };
    }

    const groups: Record<string, Booking[]> = {};
    sortedBookings.forEach((b) => {
      const hour = b.pickupTime.split(':')[0] || '00';
      const slotLabel = `${hour}:00 - ${String(Number(hour) + 1).padStart(2, '0')}:00`;
      if (!groups[slotLabel]) groups[slotLabel] = [];
      groups[slotLabel].push(b);
    });

    return groups;
  }, [sortedBookings, isGroupingActive]);

  const allVisibleIds = sortedBookings.map((b) => b.id);
  const isAllSelected =
    allVisibleIds.length > 0 && allVisibleIds.every((id) => selectedBookingIds.includes(id));

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded shadow-xs overflow-hidden">
      {/* Filtering Toolbar */}
      <div className="p-2 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
        {/* Search */}
        <div className="flex items-center gap-2 flex-1 min-w-[220px] max-w-sm">
          <div className="relative w-full">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter Ref, Passenger, Address, Postcode, Phone..."
              className="w-full pl-8 pr-3 py-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-600 text-xs shadow-2xs"
            />
          </div>
        </div>

        {/* Filter dropdowns & quick toggles */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Status Quick Pills */}
          <div className="hidden sm:flex items-center gap-1 p-0.5 bg-slate-200/80 dark:bg-slate-800 rounded text-[10px] font-bold">
            <button
              onClick={() => setStatusFilter('ALL')}
              className={`px-2 py-0.5 rounded transition ${
                statusFilter === 'ALL'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              ALL
            </button>
            <button
              onClick={() => setStatusFilter('PENDING')}
              className={`px-2 py-0.5 rounded transition ${
                statusFilter === 'PENDING'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-2xs'
                  : 'text-amber-800 dark:text-amber-400 hover:text-amber-900'
              }`}
            >
              PENDING
            </button>
            <button
              onClick={() => setStatusFilter('DISPATCHED')}
              className={`px-2 py-0.5 rounded transition ${
                statusFilter === 'DISPATCHED'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'text-blue-700 dark:text-blue-300 hover:text-blue-900'
              }`}
            >
              DISPATCHED
            </button>
          </div>

          {/* Account Filter */}
          <div className="flex items-center gap-1">
            <select
              value={accountFilter}
              onChange={(e) => setAccountFilter(e.target.value)}
              className="px-2 py-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-600 text-[11px]"
            >
              <option value="ALL">All Accounts & Cash</option>
              {uniqueAccounts.map((acc) => (
                <option key={acc} value={acc}>
                  {acc}
                </option>
              ))}
            </select>
          </div>

          {/* Driver Filter */}
          <select
            value={driverFilter}
            onChange={(e) => setDriverFilter(e.target.value)}
            className="px-2 py-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-600 font-mono text-[11px]"
          >
            <option value="ALL">All Drivers</option>
            <option value="UNASSIGNED">Unassigned Only</option>
            {drivers.map((d) => (
              <option key={d.id} value={d.driverNumber}>
                {d.driverNumber} - {d.fullName}
              </option>
            ))}
          </select>

          {/* Time Slot Group Toggle */}
          <button
            onClick={() => setIsGroupingActive(!isGroupingActive)}
            className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] font-semibold border transition ${
              isGroupingActive
                ? 'bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-800'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700'
            }`}
            title="Toggle Time Slot Hourly Grouping"
          >
            <Layers className="w-3 h-3" />
            <span className="hidden md:inline">Slots</span>
          </button>

          {/* Counter Tag */}
          <span className="font-mono font-bold text-slate-600 dark:text-slate-300 text-[11px] px-2 py-0.5 bg-slate-200 dark:bg-slate-800 rounded border border-slate-300 dark:border-slate-700 tabular-nums">
            {sortedBookings.length} {sortedBookings.length === 1 ? 'Job' : 'Jobs'}
          </span>
        </div>
      </div>

      {/* High-Density Operational Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-left text-xs border-collapse whitespace-nowrap">
          {/* Blue Cab Treasure Table Header */}
          <thead className="sticky top-0 z-20 bg-[#16375c] text-slate-100 font-semibold shadow-xs select-none">
            <tr className="h-8 text-[11px]">
              <th className="px-2 w-8 text-center border-r border-[#244c79]">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={() => {
                    if (isAllSelected) {
                      onSelectAll([]);
                    } else {
                      onSelectAll(allVisibleIds);
                    }
                  }}
                  className="rounded border-slate-400 text-blue-600 focus:ring-0 cursor-pointer"
                />
              </th>

              <th
                onClick={() => handleSort('reference')}
                className="px-2.5 py-1 cursor-pointer hover:bg-[#1e4573] border-r border-[#244c79] transition font-bold tracking-wider"
              >
                <div className="flex items-center gap-1">
                  <span>REF NO.</span>
                  <ArrowUpDown className="w-3 h-3 text-sky-300" />
                </div>
              </th>

              <th className="px-2 py-1 border-r border-[#244c79] text-sky-200 font-bold tracking-wider text-[10px]">
                SOURCE
              </th>

              <th
                onClick={() => handleSort('pickupTime')}
                className="px-2.5 py-1 cursor-pointer hover:bg-[#1e4573] border-r border-[#244c79] transition font-bold tracking-wider"
              >
                <div className="flex items-center gap-1">
                  <span>PICKUP TIME</span>
                  <ArrowUpDown className="w-3 h-3 text-sky-300" />
                </div>
              </th>

              <th className="px-2 py-1 border-r border-[#244c79] text-sky-200 font-bold tracking-wider text-[10px]">
                ZONE / PLOT
              </th>
              <th className="px-2.5 py-1 border-r border-[#244c79] font-bold tracking-wider">
                PASSENGER
              </th>
              <th className="px-3 py-1 border-r border-[#244c79] min-w-[190px] font-bold tracking-wider">
                PICKUP ADDRESS
              </th>
              <th className="px-3 py-1 border-r border-[#244c79] min-w-[190px] font-bold tracking-wider">
                DESTINATION
              </th>

              <th
                onClick={() => handleSort('fare')}
                className="px-2.5 py-1 cursor-pointer hover:bg-[#1e4573] border-r border-[#244c79] text-right transition font-bold tracking-wider"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>FARE (£)</span>
                  <ArrowUpDown className="w-3 h-3 text-sky-300" />
                </div>
              </th>

              <th className="px-2.5 py-1 border-r border-[#244c79] font-bold tracking-wider">
                ACCOUNT / PAY
              </th>
              <th className="px-2.5 py-1 border-r border-[#244c79] font-bold tracking-wider text-[10px]">
                VEHICLE
              </th>
              <th className="px-2.5 py-1 border-r border-[#244c79] font-bold tracking-wider">
                DRIVER
              </th>

              <th
                onClick={() => handleSort('status')}
                className="px-2.5 py-1 cursor-pointer hover:bg-[#1e4573] border-r border-[#244c79] transition font-bold tracking-wider"
              >
                <div className="flex items-center gap-1">
                  <span>STATUS</span>
                  <ArrowUpDown className="w-3 h-3 text-sky-300" />
                </div>
              </th>

              <th className="px-3 py-1 text-center font-bold tracking-wider">
                ACTIONS
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-[11px]">
            {sortedBookings.length === 0 ? (
              <tr>
                <td colSpan={14} className="p-8 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-1">
                    <FileText className="w-8 h-8 text-slate-300 dark:text-slate-600" />
                    <p className="font-semibold text-slate-700 dark:text-slate-300">
                      No dispatch records found matching filters
                    </p>
                    <p className="text-xs text-slate-400">
                      Press <span className="keycap text-[9px] py-0 px-1">SPACE</span> to enter a new operational booking.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              Object.entries(groupedBookings).map(([groupLabel, groupItems]) => {
                const isCollapsed = collapsedGroups[groupLabel];

                return (
                  <React.Fragment key={groupLabel}>
                    {/* Time Slot Group Banner */}
                    {isGroupingActive && (
                      <tr className="bg-slate-100/90 dark:bg-slate-800/90 font-bold text-slate-800 dark:text-slate-200 sticky top-8 z-10 border-y border-slate-200 dark:border-slate-700">
                        <td colSpan={14} className="px-3 py-1 text-xs">
                          <button
                            onClick={() => toggleGroupCollapse(groupLabel)}
                            className="flex items-center gap-2 hover:text-blue-700 dark:hover:text-sky-300 transition"
                          >
                            {isCollapsed ? (
                              <ChevronRight className="w-3.5 h-3.5 text-blue-700 dark:text-sky-400" />
                            ) : (
                              <ChevronDown className="w-3.5 h-3.5 text-blue-700 dark:text-sky-400" />
                            )}
                            <Clock className="w-3 h-3 text-slate-500" />
                            <span className="font-mono font-bold tracking-tight text-blue-900 dark:text-sky-300">
                              {groupLabel}
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono font-normal">
                              ({groupItems.length} {groupItems.length === 1 ? 'booking' : 'bookings'})
                            </span>
                          </button>
                        </td>
                      </tr>
                    )}

                    {/* Booking Rows */}
                    {!isCollapsed &&
                      groupItems.map((booking, rowIdx) => {
                        const isSelected = selectedBookingIds.includes(booking.id);
                        const statusStyle = getStatusBadgeClasses(booking.status);

                        return (
                          <tr
                            key={booking.id}
                            className={`h-8 dispatch-table-row ${
                              isSelected
                                ? 'bg-sky-100/90 dark:bg-blue-950/70'
                                : rowIdx % 2 === 0
                                ? 'bg-white dark:bg-slate-900 hover:bg-sky-50/80 dark:hover:bg-slate-800/60'
                                : 'bg-slate-50/50 dark:bg-slate-900/60 hover:bg-sky-50/80 dark:hover:bg-slate-800/60'
                            }`}
                          >
                            {/* Checkbox */}
                            <td className="px-2 text-center border-r border-slate-100 dark:border-slate-800">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => onToggleSelectBooking(booking.id)}
                                className="rounded border-slate-300 text-blue-600 focus:ring-0 cursor-pointer"
                              />
                            </td>

                            {/* Reference */}
                            <td
                              onClick={() => onViewDetails(booking)}
                              className="px-2.5 font-mono font-bold text-blue-700 dark:text-sky-400 cursor-pointer hover:underline border-r border-slate-100 dark:border-slate-800"
                            >
                              {booking.reference}
                            </td>

                            {/* Source */}
                            <td className="px-2 border-r border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-[10px] font-mono">
                              {booking.leadSource}
                            </td>

                            {/* Pickup Time */}
                            <td className="px-2.5 font-mono font-bold text-slate-900 dark:text-slate-100 border-r border-slate-100 dark:border-slate-800 tabular-nums">
                              {booking.pickupTime}
                            </td>

                            {/* Plot / Zone */}
                            <td className="px-2 font-mono font-bold text-blue-900 dark:text-sky-300 border-r border-slate-100 dark:border-slate-800">
                              {booking.zone}
                            </td>

                            {/* Passenger */}
                            <td className="px-2.5 font-bold text-slate-900 dark:text-slate-100 border-r border-slate-100 dark:border-slate-800">
                              <div className="flex items-center gap-1.5 truncate max-w-[140px]">
                                <span className="truncate">{booking.passengerName}</span>
                                {booking.passengerPhone && (
                                  <a
                                    href={`tel:${booking.passengerPhone}`}
                                    className="text-slate-400 hover:text-emerald-600 shrink-0"
                                    title={booking.passengerPhone}
                                  >
                                    <Phone className="w-2.5 h-2.5" />
                                  </a>
                                )}
                              </div>
                            </td>

                            {/* Pickup Address */}
                            <td className="px-3 text-slate-700 dark:text-slate-300 truncate max-w-[210px] border-r border-slate-100 dark:border-slate-800" title={booking.pickupAddress}>
                              {booking.pickupAddress}
                            </td>

                            {/* Destination Address */}
                            <td className="px-3 text-slate-700 dark:text-slate-300 truncate max-w-[210px] border-r border-slate-100 dark:border-slate-800" title={booking.destinationAddress}>
                              {booking.destinationAddress}
                            </td>

                            {/* Fare */}
                            <td className="px-2.5 text-right font-mono font-bold text-slate-900 dark:text-slate-100 tabular-nums border-r border-slate-100 dark:border-slate-800">
                              {formatCurrency(booking.fare)}
                            </td>

                            {/* Account / Pay */}
                            <td className="px-2.5 border-r border-slate-100 dark:border-slate-800">
                              <div className="truncate max-w-[110px]">
                                <span className="font-semibold text-slate-800 dark:text-slate-200 block truncate leading-tight">
                                  {booking.account}
                                </span>
                                <span className="text-[9px] text-slate-400 font-mono leading-tight">
                                  {booking.paymentMethod}
                                </span>
                              </div>
                            </td>

                            {/* Vehicle Requirement */}
                            <td className="px-2.5 text-slate-600 dark:text-slate-400 border-r border-slate-100 dark:border-slate-800 text-[10px]">
                              {booking.vehicleType}
                            </td>

                            {/* Assigned Driver */}
                            <td className="px-2.5 border-r border-slate-100 dark:border-slate-800">
                              {booking.assignedDriverNumber ? (
                                <span className="px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-blue-900 dark:text-sky-300 font-mono font-bold text-[10px] border border-slate-300 dark:border-slate-700 shadow-2xs">
                                  {booking.assignedDriverNumber}
                                </span>
                              ) : (
                                <button
                                  onClick={() => onDispatch(booking)}
                                  className="text-[10px] text-blue-600 dark:text-sky-400 hover:underline font-bold"
                                >
                                  + Assign
                                </button>
                              )}
                            </td>

                            {/* Status */}
                            <td className="px-2.5 border-r border-slate-100 dark:border-slate-800">
                              <span
                                className={`inline-block px-1.5 py-0.2 rounded text-[10px] font-mono font-bold border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}
                              >
                                {booking.status}
                              </span>
                            </td>

                            {/* Action Buttons */}
                            <td className="px-2 text-center">
                              <div className="flex items-center justify-center gap-1">
                                {booking.status === 'PENDING' && (
                                  <button
                                    onClick={() => onDispatch(booking)}
                                    className="p-1 rounded bg-blue-700 hover:bg-blue-600 text-white transition shadow-2xs"
                                    title="Dispatch Driver (Hotkey: D)"
                                  >
                                    <Send className="w-3 h-3" />
                                  </button>
                                )}

                                {booking.status === 'ALLOCATED' && (
                                  <button
                                    onClick={() => onComplete(booking)}
                                    className="p-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white transition shadow-2xs"
                                    title="Mark Completed"
                                  >
                                    <UserCheck className="w-3 h-3" />
                                  </button>
                                )}

                                <button
                                  onClick={() => onEdit(booking)}
                                  className="p-1 rounded text-slate-500 hover:text-blue-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                                  title="Edit Booking (Hotkey: E)"
                                >
                                  <Edit2 className="w-3 h-3" />
                                </button>

                                <button
                                  onClick={() => onHoldToggle(booking)}
                                  className="p-1 rounded text-slate-500 hover:text-amber-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                                  title={
                                    booking.status === 'ON_HOLD'
                                      ? 'Resume Booking (Hotkey: H)'
                                      : 'Hold Booking (Hotkey: H)'
                                  }
                                >
                                  {booking.status === 'ON_HOLD' ? (
                                    <Play className="w-3 h-3 text-emerald-600" />
                                  ) : (
                                    <Pause className="w-3 h-3" />
                                  )}
                                </button>

                                <button
                                  onClick={() => onViewDetails(booking)}
                                  className="p-1 rounded text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                                  title="View Details"
                                >
                                  <Eye className="w-3 h-3" />
                                </button>

                                <button
                                  onClick={() => onPrint(booking)}
                                  className="p-1 rounded text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                                  title="Print Ticket"
                                >
                                  <Printer className="w-3 h-3" />
                                </button>

                                {booking.status !== 'CANCELLED' && booking.status !== 'COMPLETED' && (
                                  <button
                                    onClick={() => onCancel(booking)}
                                    className="p-1 rounded text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                                    title="Cancel Booking (Hotkey: C)"
                                  >
                                    <XCircle className="w-3 h-3" />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
